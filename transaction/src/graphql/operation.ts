import {gql} from "@urql/core";
import {client} from "./client";

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
        $tx: Int!
    ) {
        update_operation_by_pk (
            pk_columns: {id: $id},
            _set: {
              tx_id: $tx,
            }
        ) {
            id
        }
    }
`

interface OperationInput {
    to: string,
    value?: string,
    callData?: string,
    callGasLimit?: string,
    chain: string,
    args: any,
    actions: string[],
}

export async function insertOp(
  inputs: OperationInput[]
) : Promise<{id: number}[]> {
    const result = await client.mutation(
        INSERT_OPERATION,
        {objects: inputs.map(i => ({
            to: i.to,
            value: i.value || "0",
            callData: i.callData || "",
            callGasLimit: i.callGasLimit || "0",
            chain: i.chain,
            args: JSON.stringify(i.args),
            actions: i.actions.join(","),
        }))}
    ).toPromise();
    return result.data.insert_operation.returning;
}

export async function updateOp(
  id: number,
  tx: number,
) : Promise<void> {
    const result = await client.mutation(
        UPDATE_OPERATION,
        {id, tx}
    ).toPromise();
    return result.data.update_operation_by_pk.returning;
}