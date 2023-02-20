import {gql} from "@urql/core";
import {client} from "./client";
import type {OperationInput} from "../types";

const INSERT_OPERATION = gql`
mutation ($objects: [operation_insert_input!]!) {
    insert_operation (
        objects: $objects
    ) {
        affected_rows
        returning {
            id
        }
    }
}
`

const UPDATE_OPERATION = gql`
    mutation (
        $id: Int!
        $tx: Int
        $error: String
    ) {
        update_operation_by_pk (
            pk_columns: {id: $id},
            _set: {
              tx_id: $tx,
              tx_error: $error
            }
        ) {
            id
        }
    }
`

export async function insertOp(
  inputs: OperationInput[]
) : Promise<{id: number}[]> {
    const result = await client.mutation(
        INSERT_OPERATION,
        {objects: inputs.map(i => ({
            actions: JSON.stringify(i.actions),
            chain: i.chain,
            user_id: i.userId,
            type: i.type,
            tx_id: i.txId,
            request_id: i.requestId,
        }))}
    ).toPromise();
    if (result.error) {
        console.log(result.error);
        throw new Error("Failed to insert operation");
    }
    return result.data.insert_operation.returning;
}

export async function updateOp(
    id: number,
    tx?: number,
    error?: string
) : Promise<void> {
    if (!tx && !error) {
        throw new Error("Neither tx or error is provided");
    }
    const result = await client.mutation(
        UPDATE_OPERATION,
        {id, tx, error}
    ).toPromise();
    if (result.error) {
        console.log(result.error);
        throw new Error("Failed to update operation");
    }
    return result.data.update_operation_by_pk.returning;
}