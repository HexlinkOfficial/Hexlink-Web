import { gql } from '@urql/core';
import { useAuthStore } from '@/stores/auth';
import { handleUrqlResponse, setUrqlClientIfNecessary } from './urql';
import { useChainStore } from '@/stores/chain';
import type { RedPacketDB } from "@/types";

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
      chain: useChainStore().chain.name,
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
        state: r.state ? JSON.parse(r.state) : r.state,
      } as RedPacketDB;
    });
  } else {
    return await getCreatedRedPackets();
  }
}