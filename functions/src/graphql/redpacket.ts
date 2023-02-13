import {gql} from "@urql/core";
import {client} from "./client";

export const GET_REDPACKET = gql`
  query GetRedPacket($id: String!) {
    redpacket_by_pk(id: $id) {
        id
        user_id
        metadata
        creator
        type
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

export interface RedPacketErc721Metadata {
  token: string,
  salt: string,
  name: string,
  symbol: string,
  tokenURI: string,
  maxSupply: number,
  validator: string,
  creator: string,
}

export interface RedPacket {
  id: string,
  user_id: string,
  metadata: RedPacketMetadata | RedPacketErc721Metadata,
  creator: string,
  type: "erc20" | "erc721",
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
    type: rp.type,
  };
}
