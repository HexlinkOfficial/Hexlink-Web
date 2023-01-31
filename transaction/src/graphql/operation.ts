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
            to: i.input.to,
            value: i.input.value || "0",
            callData: i.input.callData || "",
            callGasLimit: i.input.callGasLimit || "0",
            chain: i.chain,
            args: JSON.stringify(i.args),
            actions: JSON.stringify(i.actions),
            txId: i.txId,
        }))}
    ).toPromise();
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
    return result.data.update_operation_by_pk.returning;
}