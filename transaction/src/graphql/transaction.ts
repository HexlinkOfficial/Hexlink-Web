import {gql, createClient} from "@urql/core";
import type {TxStatus} from "../types";

const client = createClient({
  url: process.env.VITE_HASURA_URL!,
  fetchOptions: () => {
    return {
      headers: {"x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET!},
    };
  },
});

const INSERT_TRANSACTION = gql`
mutation ($objects: [transaction_insert_input!]!) {
    insert_transaction (
        objects: $objects
    ) {
        affected_rows
        returning {
            id
        }
    }
}
`

const UPDATE_TRANSACTION = gql`
    mutation (
        $id: Int!
        $txStatus: String!
    ) {
        update_transaction_by_pk (
            pk_columns: {id: $id},
            _set: {
              tx_status: $txStatus,
            }
        ) {
            id
        }
    }
`

export async function insertTx(
  data: {tx: string, chain: string}[],
) : Promise<{id: number}[]> {
    const result = await client.mutation(
        INSERT_TRANSACTION,
        {
            objects: data.map((d) => ({
                tx: d.tx,
                chain: d.chain,
                status: "pending",
            })),
        }
    ).toPromise();
    return result.data.insert_transaction.returning;
}

export async function updateTxStatus(
  id: number,
  status: TxStatus,
) : Promise<void> {
    const result = await client.mutation(
        UPDATE_TRANSACTION,
        {id, status}
    ).toPromise();
    return result.data.update_transaction_by_pk.returning;
}