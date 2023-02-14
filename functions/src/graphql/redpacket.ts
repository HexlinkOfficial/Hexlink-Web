import {gql} from "@urql/core";
import {client} from "./client";
import type {ValidationRule} from "../../redpacket";

export const GET_REDPACKET = gql`
  query GetRedPacket($id: String!) {
    redpacket_by_pk(id: $id) {
        id
        user_id
        metadata
        creator
        type
        validation_data
    }
  }
`;

export interface RedPacketMetadataBase {
  token: string,
  salt: string,
  creator: string,
  validator: string,
  validationRules: ValidationRule[],
}

export interface RedPacketMetadata extends RedPacketMetadataBase {
  balance: string,
  split: number,
  mode: string
}

export interface RedPacketErc721Metadata extends RedPacketMetadataBase {
  name: string,
  symbol: string,
  tokenURI: string,
  maxSupply: number,
}

export interface RedPacket {
  id: string,
  user_id: string,
  metadata: RedPacketMetadata | RedPacketErc721Metadata,
  creator: string,
  validationData: any[],
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
    validationData: JSON.parse(rp.validation_data),
  };
}
