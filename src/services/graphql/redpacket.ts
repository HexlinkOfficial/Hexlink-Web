import { gql } from '@urql/core';
import { useAuthStore } from '@/stores/auth';
import { handleUrqlResponse, setUrqlClientIfNecessary } from './urql';

export const GET_REDPACKET = gql`
    query GetRedpacket (
        $userUid: String!,
        $redPacketId: String!
    ) {
        redpacket (
            where: {
              user_uid: { _eq: $userUid},
              red_packet_id: { _eq: $redPacketId }
            }
        ) {
            red_packet_id
            gas_station_enabled
            user_id
            metadata
        }
    }
`

export const GET_REDPACKET_BY_USER = gql`
    query GetRedpacketByuser (
        $userUid: String!,
        $userId: String!
    ) {
        redpacket (
            where: {
              user_uid: { _eq: $userUid},
              user_id: { _eq: $userId }
            }
        ) {
            user_id
            red_packet_id
            gas_station_enabled
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
                red_packet_id
            }
        }
    }
`

export interface RedPacketData {
  red_packet_id: string,
  user_id: string,
  gas_station_enabled: boolean,
}

export interface RedPacketOutput extends RedPacketData {
  metadata: string
}

export interface RedPacketInput extends RedPacketData {
  metadata: string,
  user_uid: string
}

export interface Metadata {
  mode: number,
  split: number,
  balance: number,
  validator?: string,
  expiredAt?: string,
  salt?: string,
  token?: string
}

export interface ParsedRedPacket extends RedPacketData {
  metadata: Metadata
}

const store = useAuthStore();

export async function getRedPacket(
  redPacketId: string
) : Promise<RedPacketOutput[]> {
  const client = setUrqlClientIfNecessary(store.user!.idToken!);
  const result = await client.query(
    GET_REDPACKET,
    {userUid: store.user!.uid, redPacketId: redPacketId}
  ).toPromise();
  if (await handleUrqlResponse(result)) {
    return result.data.redpacket;
  } else {
    return await getRedPacket(redPacketId);
  }
}

export async function getRedPacketByUser(
  userId: string
) : Promise<RedPacketOutput[]> {
  const client = setUrqlClientIfNecessary(store.user!.idToken!);
  const result = await client.query(
    GET_REDPACKET_BY_USER,
    {userUid: store.user!.uid, userId: userId}
  ).toPromise();
  if (await handleUrqlResponse(result)) {
    return result.data.redpacket;
  } else {
    return await getRedPacketByUser(userId);
  }
}

export async function insertRedPacket(
  data: RedPacketInput[],
) : Promise<{red_packet_id: string}[]> {
  const client = setUrqlClientIfNecessary(store.user!.idToken!)
  const result = await client.mutation(
      INSERT_REDPACKET,
      {
          objects: data.map(d => ({
              user_uid: store.user!.uid,
              red_packet_id: d.red_packet_id,
              user_id: d.user_id,
              gas_station_enabled: d.gas_station_enabled,
              metadata: d.metadata
          }))
      }
  ).toPromise();
  if (await handleUrqlResponse(result)) {
      return result.data.insert_redpacket.returning;
  } else {
      return await insertRedPacket(data);
  }
}
