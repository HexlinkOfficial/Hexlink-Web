import {gql} from "@urql/core";
import {client} from "./client";
import type {TxStatus} from "../types";

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
        $status: String!
        $error: String
    ) {
        update_transaction_by_pk (
            pk_columns: {id: $id},
            _set: {
              status: $status,
              error: $error
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
            })),
        }
    ).toPromise();
    if (result.error) {
        console.log(result.error);
        throw new Error("Failed to insert operation");
    }
    return result.data.insert_transaction.returning;
}

export async function updateTx(
  id: number,
  status: TxStatus,
  error?: string,
) : Promise<void> {
    const result = await client.mutation(
        UPDATE_TRANSACTION,
        {id, status, error}
    ).toPromise();
    if (result.error) {
        console.log(result.error);
        throw new Error("Failed to insert operation");
    }
    return result.data.update_transaction_by_pk.returning;
}