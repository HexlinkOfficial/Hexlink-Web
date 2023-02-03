import { gql } from '@urql/core';
import { useAuthStore } from '@/stores/auth';
import { handleUrqlResponse, setUrqlClientIfNecessary } from './urql';
import { useChainStore } from '@/stores/chain';
import type { RedPacketDB, CreateRedPacketOp } from "@/types";

export const GET_REDPACKET = gql`
  query GetRedPacket($id: String!) {
    redpacket_by_pk(id: $id) {
        creator,
        metadata,
        created_at,
        operation {
          chain
        }
    }
  }
`

export const GET_CREATED_REDPACKETS = gql`
    query GetRedPacketByUser (
        $userId: String!,
        $chain: String!,
    ) {
        operation (
            where: {
              user_id: { _eq: $userId },
              chain: { _eq: $chain },
              type: { _eq: "create_redpacket" },
            },
            limit: 100
        ) {
            id
            type
            created_at
            request
            transaction {
              tx
              status
              error
            }
            redpackets {
              id,
              metadata,
              deposit,
              created_at
            }
        }
    }
`

export interface RedPacketDBRaw {
  id: string,
  metadata: string,
  deposit: string,
  created_at: string
}

function parseRedPacket(op: any) : RedPacketDB {
  const r = (op.claim.redPackets || []).length > 0
    ? op.claim.redPackets[0]
    : undefined;
  if (r) {
    return {
      id: r.id,
      metadata: JSON.parse(r.metadata),
      deposit: JSON.parse(r.deposit),
      createdAt: new Date(r.created_at),
    };
  } else {
    const request = JSON.parse(op.request);
    return {
      id: request.id,
      metadata: JSON.parse(request.metadata),
      deposit: JSON.parse(request.deposit),
      createdAt: new Date(op.created_at),
    };
  }
}

export async function getCreatedRedPackets() : Promise<CreateRedPacketOp[]> {
  const client = setUrqlClientIfNecessary(
    useAuthStore().user!.idToken!
  );
  const result = await client.query(
    GET_CREATED_REDPACKETS,
    {
      userId: useAuthStore().user!.uid,
      chain: useChainStore().chain.name,
    }
  ).toPromise();
  if (await handleUrqlResponse(result)) {
    return result.data.operation.map((op : any) => {
      return {
        id: op.id,
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
  const client = setUrqlClientIfNecessary(
    useAuthStore().user!.idToken!
  );
  const result = await client.query(
    GET_REDPACKET,
    {id: redPacketId}
  ).toPromise();
  if (await handleUrqlResponse(result)) {
    const rp = result.data.redpacket_by_pk;
    if (rp) {
      return {
        id: redPacketId,
        metadata: JSON.parse(rp.metadata),
        createdAt: new Date(rp.created_at),
        creator: JSON.parse(rp.creator),
        chain: rp.operation.chain
      }
    } else {
      throw new Error("Redpacket not found");
    }
  } else {
    return await getRedPacket(redPacketId);
  }
}