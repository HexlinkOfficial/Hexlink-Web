import { gql } from '@urql/core';
import { useAuthStore } from '@/stores/auth';
import { handleUrqlResponse, setUrqlClientIfNecessary } from './urql';
import { useNetworkStore } from '@/stores/network';

export const GET_REDPACKET = gql`
  query GetRedPacket($id: String!) {
    redpacket_by_pk(id: $id) {
        id
        user_id
        chain
        tx
        creator
        metadata
    }
  }
`

export const GET_REDPACKETS = gql`
    query GetRedPacketByUser (
        $userId: String!,
        $chain: String!,
    ) {
        redpacket (
            where: {
              user_id: { _eq: $userId },
              chain: { _eq: $chain },
            }
        ) {
            id
            user_id
            chain
            tx
            creator
            metadata
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

export const UPDATE_REDPACKET = gql`
    mutation (
        $id: String!
        $tx: String!
    ) {
        update_redpacket_by_pk (
            pk_columns: {id: $id},
            _set: { tx: $tx }
        ) {
            id
        }
    }
`

export interface RedPacketDBMetadata {
  token: string
  salt: string,
  mode: string,
  split: number,
  balance: string,
  validator: string,
  expiredAt: number,
  contract: string
}

export interface RedPacketDBCreator {
  provider: string;
  handle: string;
  displayName?: string;
}

export interface RedPacketDB {
  id: string,
  userId: string,
  chain: string,
  metadata: RedPacketDBMetadata,
  creator: RedPacketDBCreator,
  tx?: string
}

export async function getRedPacket(
  redPacketId: string
) : Promise<RedPacketDB> {
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
        creator: JSON.parse(rp.creator)
      } as RedPacketDB;
    } else {
      return {
        id: "0",
        userId: "0",
        chain: "0",
        metadata: {
          token: "",
          salt: "",
          mode: "",
          split: 0,
          balance: "",
          validator: "",
          expiredAt: 0,
          contract: ""
        },
        creator: {
          provider: "",
          handle: "",
          displayName: ""
        }
      }
    }
  } else {
    return await getRedPacket(redPacketId);
  }
}

export async function getRedPacketsByUser(
  userId: string
) : Promise<RedPacketDB[]> {
  const client = setUrqlClientIfNecessary(
    useAuthStore().user!.idToken!
  );
  const result = await client.query(
    GET_REDPACKETS,
    {
      userId: useAuthStore().user!.uid,
      chain: useNetworkStore().network.name
    }
  ).toPromise();
  if (await handleUrqlResponse(result)) {
    return result.data.redpacket.map((r : any) => {
      return {
        id: r.id,
        userId: r.user_id,
        metadata: JSON.parse(r.metadata),
        creator: JSON.parse(r.creator)
      } as RedPacketDB;
    });
  } else {
    return await getRedPacketsByUser(userId);
  }
}

export async function insertRedPacket(
  data: {
    id: string,
    creator: RedPacketDBCreator,
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

export async function updateRedPacket(
  data: {id: string, tx: string},
) : Promise<void> {
  const client = setUrqlClientIfNecessary(useAuthStore().user!.idToken!)
  const result = await client.mutation(
      UPDATE_REDPACKET,
      data
  ).toPromise();
  if (!await handleUrqlResponse(result)) {
    await updateRedPacket(data);
}
}
