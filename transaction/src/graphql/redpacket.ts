import {gql} from "@urql/core";
import {client} from "./client";
import type {RedPacketClaimInput} from "../types";
<<<<<<< HEAD
import type {
  HexlinkUserInfo
} from "../../../functions/redpacket";
=======
import type { HexlinkUserInfo } from "../../../functions/redpacket";
>>>>>>> d967c25 (update)

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
`

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
          claimer: JSON.stringify(d.claimer || {}),
          claimed: d.claimed?.toString() ||  "0",
          op_id: d.opId,
        })),
      }
  ).toPromise();
  return result.data.insert_redpacket_claim.returning;
}

const INSERT_REDPACKET = gql`
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
`;

export async function insertRedPacket(
    uid: string,
    data: {
      id: string,
      userId: string,
      creator: HexlinkUserInfo,
      metadata: any,
      opId: number,
      deposit: any,
      type: "erc20" | "erc721",
    }[],
) : Promise<{id: string}[]> {
  const result = await client.mutation(
      INSERT_REDPACKET,
      {
        objects: data.map((d) => ({
          user_id: uid,
          id: d.id,
          metadata: JSON.stringify(d.metadata),
          creator: JSON.stringify(d.creator),
          op_id: d.opId,
          deposit: JSON.stringify(d.deposit),
          type: d.type,
        })),
      }
  ).toPromise();
  return result.data.insert_redpacket.returning;
}