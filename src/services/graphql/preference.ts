import { gql } from '@urql/core'
import type { IUser, Token, Network, TokenMetadata } from '@/types';
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
            metadata
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

export interface PreferenceInput {
    chain: string,
    tokenAddress: string,
    tokenAlias?: string,
    display: boolean,
    metadata: TokenMetadata,
}

export async function getTokenPreferences(
    user: IUser,
    network: Network
) : Promise<Token[]> {
    const client = setUrqlClientIfNecessary(user.idToken!)
    const result = await client.query(
        GET_TOKEN_PREFERENCES,
        {userId: user.uid, chain: network.name}
    ).toPromise();
    if (await handleUrqlResponse(result)) {
        return result.data.preference.map((p : any) => {
            const metadata = JSON.parse(p.metadata);
            return {
                metadata: {
                    ...metadata,
                    chain: network.name
                },
                preference: {
                    id: p.id,
                    tokenAlias: p.token_alias,
                    display: p.display,
                }
            }
        });
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
                token_address: d.tokenAddress.toLowerCase(),
                token_alias: d.tokenAlias,
                display: d.display,
                metadata: JSON.stringify(d.metadata),
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