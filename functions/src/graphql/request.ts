import {gql} from "@urql/core";
import {client} from "./client";

export const INSERT_REQUEST = gql`
mutation ($objects: [request_insert_input!]!) {
    insert_request (
        objects: $objects
    ) {
        affected_rows
        returning {
            id
        }
    }
}
`;

export interface RequestInput {
    args: any,
    to: string,
    calldataHash?: string,
    value?: string,
    callGasLimit?: string
}

export async function insertRequest(
    userId: string,
    inputs: RequestInput[]
) : Promise<{id: number}[]> {
  const result = await client().mutation(
      INSERT_REQUEST,
      {objects: inputs.map((i) => ({
        user_id: userId,
        to: i.to,
        datahash: i.calldataHash,
        gaslimit: i.callGasLimit,
        value: i.value,
        args: JSON.stringify(i.args),
      }))}
  ).toPromise();
  console.log(result);
  return result.data.insert_request.returning;
}
