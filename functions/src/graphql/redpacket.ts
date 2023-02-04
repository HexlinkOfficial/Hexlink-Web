import {gql} from "@urql/core";
import {client} from "./client";

export const GET_REDPACKET = gql`
  query GetRedPacket($id: String!) {
    redpacket_by_pk(id: $id) {
        id
        user_id
        metadata
        creator
    }
  }
`;

export interface RedPacketMetadata {
  token: string,
  salt: string,
  balance: string,
  validator: string,
  creator: string,
  split: number,
  mode: string
}

export interface RedPacket {
  id: string,
  user_id: string,
  metadata: RedPacketMetadata,
  creator: string,
}

export async function getRedPacket(
    redPacketId: string
) : Promise<RedPacket | undefined> {
  const result = await client().query(
      GET_REDPACKET,
      {id: redPacketId}
  ).toPromise();
  if (result.error) {
    console.log("Failed to get red packet", result.error);
    return undefined;
  }
  const rp = result.data?.redpacket_by_pk;
  return {
    id: rp.id,
    user_id: rp.user_id,
    metadata: JSON.parse(rp.metadata),
    creator: JSON.parse(rp.creator),
  };
}
