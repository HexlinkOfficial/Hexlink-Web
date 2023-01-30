import {gql} from "@urql/core";
import {client} from "./client";
import type {RedPacketClaimInput} from "../types";

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

export const UPDATE_REDPACKET_CLAIM = gql`
    mutation (
        $id: Int!
        $claimed: String
    ) {
        update_redpacket_claim_by_pk (
            pk_columns: {id: $id},
            _set: {
              claimed: $claimed,
            }
        ) {
            id
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
          tx: d.tx,
          tx_status: d.txStatus || "",
          claimer: d.claimer || "",
          claimed: d.claimed || "",
        })),
      }
  ).toPromise();
  return result.data.insert_redpacket_claim.returning;
}

export async function updateRedPacketClaim(
  id: number,
  claimed?: string
) : Promise<void> {
  const result = await client.mutation(
      UPDATE_REDPACKET_CLAIM,
      {id, claimed}
  ).toPromise();
  return result.data.update_redpacket_claim_by_pk.returning;
}