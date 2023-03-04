import { gql } from '@urql/core';
import { useAuthStore } from '@/stores/auth';
import { handleUrqlResponse, setUrqlClientIfNecessary } from './urql';
import { useChainStore } from '@/stores/chain';
import type { RedPacketDB, CreateRedPacketOp } from "@/types";

export const GET_REDPACKET = gql`
  query GetRedPacket(
    $id: String!,
  ) {
    redpacket_public(
      where: {
        id: { _eq: $id }
      },
    ) {
        creator,
        metadata,
        created_at,
        type,
        operation_public {
          chain
        }
    }
  }
`

export const GET_REDPACKET_PRIVATE = gql`
  query GetRedPacket($id: String!) {
    redpacket_by_pk(id: $id) {
        id
        user_id
        metadata
        creator
        type
        validation_data
        operation {
          chain
        }
    }
  }
`;

export const GET_CREATED_REDPACKETS = gql`
    query GetRedPacketByUser (
        $userId: String!,
        $chain: String!,
        $type: String!,
    ) {
        operation (
            where: {
              user_id: { _eq: $userId },
              chain: { _eq: $chain },
              type: { _eq: $type },
            },
            limit: 100
        ) {
            id
            type
            created_at
            tx_error
            transaction {
              tx
              status
              error
            }
            redpackets {
              id,
              metadata,
              created_at,
              validation_data,
              type
            }
            request {
              args
            }
        }
    }
`

export interface RedPacketDBRaw {
  id: string,
  metadata: string,
  created_at: string
}

function parseRedPacket(op: any) : RedPacketDB | undefined {
  const r = (op.redpackets || []).length > 0
    ? op.redpackets[0]
    : undefined;
  if (r) {
    return {
      id: r.id,
      metadata: JSON.parse(r.metadata),
      createdAt: new Date(r.created_at),
      type: r.type,
    };
  } else if (op.request?.args) {
    const {redpacketId, metadata, type} = JSON.parse(op.request.args);
    return {
      id: redpacketId,
      metadata,
      createdAt: new Date(op.created_at),
      type,
    }
  }
}

export async function getCreatedRedPackets() : Promise<CreateRedPacketOp[]> {
  const client = await setUrqlClientIfNecessary(
    useAuthStore().user!.idToken!
  );
  const result = await client.query(
    GET_CREATED_REDPACKETS,
    {
      userId: useAuthStore().user!.uid,
      chain: useChainStore().chain.name,
      type: "create_redpacket",
    }
  ).toPromise();
  if (await handleUrqlResponse(result)) {
    return result.data.operation.map((op : any) => {
      return {
        id: op.id,
        type: op.type,
        createdAt: new Date(op.created_at),
        redpacket: parseRedPacket(op),
        tx: op.transaction?.tx,
        txStatus: op.transaction?.status,
        error: op.tx_error || op.transaction?.error,
      };
    });
  } else {
    return await getCreatedRedPackets();
  }
}

export async function getRedPacket(
  redPacketId: string
) : Promise<RedPacketDB | undefined> {
  const client = await setUrqlClientIfNecessary(
    useAuthStore().user!.idToken!
  );
  const result = await client.query(
    GET_REDPACKET,
    {id: redPacketId}
  ).toPromise();
  if (await handleUrqlResponse(result)) {
    if ((result.data.redpacket_public?.length || 0) > 0) {
      const rp = result.data.redpacket_public[0];
      return {
        id: redPacketId,
        metadata: JSON.parse(rp.metadata),
        createdAt: new Date(rp.created_at),
        creator: JSON.parse(rp.creator),
        chain: rp.operation_public.chain,
        type: rp.type,
      }
    } else {
      throw new Error("Redpacket not found");
    }
  } else {
    return await getRedPacket(redPacketId);
  }
}

export async function getRedPacketPrivate(
  redPacketId: string
) : Promise<RedPacketDB | undefined> {
  const client = await setUrqlClientIfNecessary(
    useAuthStore().user!.idToken!
  );
  const result = await client.query(
    GET_REDPACKET_PRIVATE,
    {id: redPacketId}
  ).toPromise();
  if (await handleUrqlResponse(result)) {
    const rp = result.data?.redpacket_by_pk;
    if (rp) {
      return {
        id: redPacketId,
        metadata: JSON.parse(rp.metadata),
        createdAt: new Date(rp.created_at),
        creator: JSON.parse(rp.creator),
        chain: rp.operation.chain,
        validationData: JSON.parse(rp.validation_data || "[]"),
        type: rp.type,
      }
    } else {
      throw new Error("Redpacket not found");
    }
  } else {
    return await getRedPacket(redPacketId);
  }
}