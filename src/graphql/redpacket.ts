import { gql } from '@urql/core';
import { useAuthStore } from '@/stores/auth';
import { handleUrqlResponse, setUrqlClientIfNecessary } from './urql';
import { useNetworkStore } from '@/stores/network';
import type { HexlinkUserInfo, RedPacketDB, RedPacketDBMetadata, RedPacketOnchainState } from "@/types";

export const GET_REDPACKET = gql`
  query GetRedPacket($id: String!) {
    redpacket_by_pk(id: $id) {
        id
        user_id
        chain
        tx
        creator
        metadata
        created_at
    }
  }
`

export const GET_CREATED_REDPACKETS = gql`
    query GetRedPacketByUser (
        $userId: String!,
        $chain: String!,
    ) {
        redpacket (
            where: {
              user_id: { _eq: $userId },
              chain: { _eq: $chain },
            },
            limit: 100
        ) {
            id
            user_id
            chain
            tx
            creator
            metadata
            created_at
            status
            state
        }
    }
`

export const INSERT_REDPACKET = gql`
    mutation ($objects: [redpacket_insert_input!]!) {
        insert_redpacket (
            objects: $objects
        ) {
            affected_rows
            returning {
                id
            }
        }
    }
`

export const UPDATE_REDPACKET_STATUS = gql`
    mutation (
        $id: String!
        $status: String!
        $state: String
    ) {
        update_redpacket_by_pk (
            pk_columns: {id: $id},
            _set: { status: $status, state: $state }
        ) {
            id
        }
    }
`

export async function getRedPacket(
  redPacketId: string
) : Promise<RedPacketDB | undefined> {
  const client = setUrqlClientIfNecessary(useAuthStore().user!.idToken!);
  const result = await client.query(
    GET_REDPACKET,
    {id: redPacketId}
  ).toPromise();
  if (await handleUrqlResponse(result)) {
    const rp = result.data.redpacket_by_pk;
    if(rp) {
      return {
        id: rp.id,
        userId: rp.user_id,
        chain: rp.chain,
        metadata: JSON.parse(rp.metadata),
        creator: JSON.parse(rp.creator),
        createdAt: rp.created_at
      } as RedPacketDB;
    } else {
      return undefined;
    }
  } else {
    return await getRedPacket(redPacketId);
  }
}

export async function getCreatedRedPackets() : Promise<RedPacketDB[]> {
  const client = setUrqlClientIfNecessary(
    useAuthStore().user!.idToken!
  );
  const result = await client.query(
    GET_CREATED_REDPACKETS,
    {
      userId: useAuthStore().user!.uid,
      chain: useNetworkStore().network.name.toString()
    }
  ).toPromise();
  if (await handleUrqlResponse(result)) {
    return result.data.redpacket.map((r : any) => {
      return {
        id: r.id,
        chain: r.chain,
        userId: r.user_id,
        metadata: JSON.parse(r.metadata),
        creator: JSON.parse(r.creator),
        createdAt: r.created_at,
        tx: r.tx,
        status: r.status,
        state: JSON.parse(r.state || {}),
      } as RedPacketDB;
    });
  } else {
    return await getCreatedRedPackets();
  }
}

export async function insertRedPacket(
  data: {
    id: string,
    creator: HexlinkUserInfo,
    metadata: RedPacketDBMetadata,
    chain: string,
    tx: string
  }[],
) : Promise<{id: string}[]> {
  const client = setUrqlClientIfNecessary(useAuthStore().user!.idToken!)
  const result = await client.mutation(
      INSERT_REDPACKET,
      {
          objects: data.map(d => ({
              user_id: useAuthStore().user!.uid,
              id: d.id,
              metadata: JSON.stringify(d.metadata),
              chain: d.chain,
              creator: JSON.stringify(d.creator),
              tx: d.tx
          }))
      }
  ).toPromise();
  if (await handleUrqlResponse(result)) {
      return result.data.insert_redpacket.returning;
  } else {
      return await insertRedPacket(data);
  }
}

export async function updateRedPacketStatus(
  data: {id: string, status: string, state?: RedPacketOnchainState},
) : Promise<void> {
  const client = setUrqlClientIfNecessary(useAuthStore().user!.idToken!)
  const result = await client.mutation(
      UPDATE_REDPACKET_STATUS,
      {
        id: data.id,
        status: data.status,
        state: data.state ? JSON.stringify(data.state) : undefined
      }
  ).toPromise();
  if (!await handleUrqlResponse(result)) {
      await updateRedPacketStatus(data);
  }
}
