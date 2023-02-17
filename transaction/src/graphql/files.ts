import {gql} from "@urql/core";
import {client} from "./client";

const INSERT_FILE = gql`
mutation ($objects: [file_insert_input!]!) {
    insert_file (
        objects: $objects
    ) {
        affected_rows
        returning {
            id
        }
    }
}
`

const UPDATE_FILE_STATUS = gql`
    mutation (
        id: Int!,
        $status: String!
    ) {
        update_file_by_pk (
            pk_columns: {id: $id},
            _set: {
                status: $status,
            }
        ) {
            id
        }
    }
`

export type FileStatus = "queued" | "uploading" | "uploaded" | "error";

export async function addFile(
    inputs: {
        size: number,
        md5: string,
        userId: string,
        mimetype: string,
    }[]
) : Promise<{id: number}[]> {
    const result = await client.mutation(
        INSERT_FILE,
        {objects: inputs.map(i => ({
            md5: i.md5,
            user_id: i.userId,
            mimetype: i.mimetype,
            size: i.size,
            status: "queued",
        }))}
    ).toPromise();
    return result.data.insert_file.returning;
}


export async function updateFileStatus(
    userId: string,
    md5: string,
    status: FileStatus,
) : Promise<{id: number}[]> {
    const result = await client.mutation(
        UPDATE_FILE_STATUS,
        {userId, md5, status}
    ).toPromise();
    return result.data.update_file_by_pk.returning;
}