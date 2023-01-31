/* eslint-disable require-jsdoc */
import {gql, createClient} from "@urql/core";
import * as functions from "firebase-functions";

const secrets = functions.config().doppler || {};
const client = () => createClient({
  url: secrets.VITE_HASURA_URL,
  fetchOptions: () => {
    return {
      headers: {"x-hasura-admin-secret": secrets.HASURA_GRAPHQL_ADMIN_SECRET},
    };
  },
});

export const GET_REDPACKET = gql`
  query GetRedPacket($id: String!) {
    redpacket_by_pk(id: $id) {
        id
        user_id
        metadata
        chain
        creator
    }
  }
`;

export interface RedPacketMetadata {
  token: string,
  salt: string,
  tokenAmount: string,
  validator: string,
  creator: string,
  split: number,
  mode: string
}

export interface RedPacket {
  id: string,
  user_id: string,
  metadata: RedPacketMetadata,
  chain: string,
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
    chain: rp.chain,
    creator: JSON.parse(rp.creator),
  };
}
