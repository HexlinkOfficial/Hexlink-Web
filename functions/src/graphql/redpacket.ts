/* eslint-disable require-jsdoc */
import {gql, createClient} from "@urql/core";
import * as functions from "firebase-functions";

const secrets = functions.config().doppler || {};
const client = createClient({
  url: secrets.VITE_HASURA_URL,
  fetchOptions: () => {
    return {
      headers: {"x-hasura-admin-secret": secrets.HASURA_GRAPHQL_ADMIN_SECRET},
    };
  },
});

const INSERT_REDPACKET_CLAIM = gql`
    mutation ($objects: [redpacket_claim_insert_input!]!) {
        insert_redpacket_claim (
            objects: $objects
        ) {
            affected_rows
            returning {
                id
            }
        }
    }
`;

export interface RedPacketClaimInput {
  redPacketId: string,
  creatorId: string,
  tx?: string,
  claimerId: string,
}

export interface HexlinkUserInfo {
  provider: string;
  handle: string;
  displayName?: string;
}

export interface RedPacketClaim extends RedPacketClaimInput {
  createdAt: Date,
  id: string,
  claimerId: string,
  claimer: HexlinkUserInfo,
}

export async function insertRedPacketClaim(
    data: RedPacketClaimInput[],
) : Promise<{id: string}[]> {
  const result = await client.mutation(
      INSERT_REDPACKET_CLAIM,
      {
        objects: data.map((d) => ({
          redpacket_id: d.redPacketId,
          claimer_id: d.claimerId,
          creator_id: d.creatorId,
          tx: d.tx || "",
        })),
      }
  ).toPromise();
  console.log(result);
  return result.data.insert_redpacket_claim.returning;
}

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

export interface RedPacket {
  id: string,
  user_id: string,
  metadata: string,
  chain: string,
  creator: string,
}

export async function getRedPacket(
    redPacketId: string
) : Promise<RedPacket | undefined> {
  const result = await client.query(
      GET_REDPACKET,
      {id: redPacketId}
  ).toPromise();
  if (result.error) {
    console.log("Failed to get red packet", result.error);
    return undefined;
  }
  return result.data?.redpacket_by_pk;
}
