import { gql } from '@urql/core';
import { useAuthStore } from '@/stores/auth';
import { handleUrqlResponse, setUrqlClientIfNecessary } from './urql';

export const GET_REDPACKET = gql`
  query GetRedPacket($id: String!) {
    red_packet_by_pk(id: $id) {
        id
        user_id
        metadata
    }
  }
`

export const GET_REDPACKETS = gql`
    query GetRedPacketByUser (
        $userId: String!,
    ) {
        redpacket (
            where: {
              user_id: { _eq: $userId},
            }
        ) {
            id
            user_id
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

export interface Metadata {
  token: string
  salt: string,
  mode: string,
  split: number,
  balance: string,
  validator: string,
  expiredAt: number,
}

export interface RedPacketDB {
  id: string,
  userId: string,
  metadata: Metadata
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
    const rp = result.data.redpacket;
    return {
      id: rp.id,
      userId: rp.user_id,
      metadata: JSON.parse(rp.metadata)
    } as RedPacketDB;
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
    {userId: useAuthStore().user!.uid}
  ).toPromise();
  if (await handleUrqlResponse(result)) {
    console.log(result.data.redpacket)
    return result.data.redpacket.map((r : any) => {
      return {
        id: r.id,
        userId: r.user_id,
        metadata: JSON.parse(r.metadata)
      } as RedPacketDB;
    });
  } else {
    return await getRedPacketsByUser(userId);
  }
}

export async function insertRedPacket(
  data: {id: string, metadata: Metadata}[],
) : Promise<{id: string}[]> {
  const client = setUrqlClientIfNecessary(useAuthStore().user!.idToken!)
  const result = await client.mutation(
      INSERT_REDPACKET,
      {
          objects: data.map(d => ({
              user_id: useAuthStore().user!.uid,
              id: d.id,
              metadata: JSON.stringify(d.metadata)
          }))
      }
  ).toPromise();
  if (await handleUrqlResponse(result)) {
      return result.data.insert_redpacket.returning;
  } else {
      return await insertRedPacket(data);
  }
}
