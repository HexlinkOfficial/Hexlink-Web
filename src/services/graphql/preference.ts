import { gql } from '@urql/core'
import type { IUser, IAuth, Preference, Network } from '@/types';
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
    user: IUser,
    network: Network
) : Promise<PreferenceOutput[]> {
    const client = setUrqlClientIfNecessary(user.idToken!)
    const result = await client.query(
        GET_TOKEN_PREFERENCES,
        {userId: user.uid, chain: network.chainId.toString()}
    ).toPromise();
    if (await handleUrqlResponse(result)) {
        return result.data.preference;
    } else {
        return await getTokenPreferences(user, network);
    }
}

export async function insertTokenPreferences(
    user: IUser,
    data: PreferenceInput[],
) : Promise<{id: number}[]> {
    const client = setUrqlClientIfNecessary(user.idToken!)
    const result = await client.mutation(
        INSERT_TOKEN_PREFERENCES,
        {
            objects: data.map(d => ({
                user_id: user.uid,
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
        return await insertTokenPreferences(user, data);
    }
}

export async function updateTokenPreference(
    user: IUser,
    data: {
        id: number,
        display: boolean,
    },
) : Promise<void> {
    const client = setUrqlClientIfNecessary(user.idToken!);
    const result = await client.mutation(
        UPDATE_TOKEN_PREFERENCE,
        data
    ).toPromise();
    if (!await handleUrqlResponse(result)) {
        await updateTokenPreference(user, data);
    }
}