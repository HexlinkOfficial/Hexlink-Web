import {gql, createClient} from "@urql/core";
import type {TxStatus, RedPacketClaimInput} from "../types";

const client = createClient({
  url: process.env.VITE_HASURA_URL!,
  fetchOptions: () => {
    return {
      headers: {"x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET!},
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
`

export const UPDATE_REDPACKET_CLAIM_TX = gql`
    mutation (
        $id: Int!
        $txStatus: String!
        $claimed: String
    ) {
        update_redpacket_claim_by_pk (
            pk_columns: {id: $id},
            _set: {
              tx_status: $txStatus,
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

export async function updateRedPacketTxStatus(
  id: number,
  txStatus: TxStatus,
  claimed?: string
) : Promise<void> {
const result = await client.mutation(
    UPDATE_REDPACKET_CLAIM_TX,
    {id, txStatus, claimed}
).toPromise();
return result.data.update_redpacket_claim_by_pk.returning;
}