import { gql } from '@urql/core'
import type { IAuth } from '@/types';
import { handleUrqlResponse, setUrqlClientIfNecessary } from './urql'

export const GET_TOKEN_PREFERENCES = gql`
    query GetPreferences (
        $userId: String!
        $chain: String!
    ) {
        preference (
            where: {
                user_id: { _eq: $userId },
                chain: { _eq: $chain }
            }
        ) {
            id
            token_address
            token_alias
            display
        }
    }
`

export const INSERT_TOKEN_PREFERENCES = gql`
    mutation ($objects: [preference_insert_input!]!) {
        insert_preference (
            objects: $objects
        ) {
            affected_rows
            returning {
                id
            }
        }
    }
`

export const UPDATE_TOKEN_PREFERENCE = gql`
    mutation (
        $id: Int!
        $display: Boolean!
    ) {
        update_preference_by_pk (
            pk_columns: {id: $id},
            _set: { display: $display }
        ) {
            id
        }
    }
`

export interface Preference {
    id: number;
    token_alias?: string;
    display: boolean;
}

export interface PreferenceOutput extends Preference {
    token_address: string,
}

export interface PreferenceInput {
    chain: string,
    token_address: string,
    token_alias?: string,
    display: boolean,
}

export async function getTokenPreferences(
    store: IAuth,
    chain: string
) : Promise<PreferenceOutput[]> {
    const client = setUrqlClientIfNecessary(store.idToken!)
    const result = await client.query(
        GET_TOKEN_PREFERENCES,
        {userId: store.user!.uid, chain}
    ).toPromise();
    if (await handleUrqlResponse(result)) {
        return result.data.preference;
    } else {
        return await getTokenPreferences(store, chain);
    }
}

export async function insertTokenPreferences(
    store: IAuth,
    data: PreferenceInput[],
) : Promise<{id: number}[]> {
    const client = setUrqlClientIfNecessary(store.idToken!)
    const result = await client.mutation(
        INSERT_TOKEN_PREFERENCES,
        {
            objects: data.map(d => ({
                user_id: store.user!.uid,
                chain: d.chain,
                token_address: d.token_address.toLowerCase(),
                token_alias: d.token_alias,
                display: d.display,
            }))
        }
    ).toPromise();
    if (await handleUrqlResponse(result)) {
        return result.data.insert_preference.returning;
    } else {
        return await insertTokenPreferences(store, data);
    }
}

export async function updateTokenPreference(
    store: IAuth,
    data: {
        id: number,
        display: boolean,
    },
) : Promise<void> {
    const client = setUrqlClientIfNecessary(store.idToken!);
    const result = await client.mutation(
        UPDATE_TOKEN_PREFERENCE,
        data
    ).toPromise();
    if (!await handleUrqlResponse(result)) {
        await updateTokenPreference(store, data);
    }
}