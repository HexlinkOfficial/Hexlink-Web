import type { IUser } from '@/stores/auth'
import { gql } from '@urql/core'
import { setUrqlClientIfNecessary } from './urql'

export const GET_ERC20_PREFERENCES = gql`
    query GetPreferences (
        $userId: String!
        $chainId: Integer!
    ) {
        erc20_preferences (
            user_id: $userId
            chain_id: $chainId
        ) {
            id
            address
            display_name
            display
        }
    }
`

export const INSERT_ERC20_PREFERENCES = gql`
    mutation ($objects: [erc20_preference_insert_input!]!) {
        insert_erc20_preferences (
            objects: $objects
        ) {
            id
        }
    }
`

export const UPDATE_ERC20_PREFERENCE = gql`
    mutation (
        $id: Int!
        $display: String!
    ) {
        update_erc20_preferences_by_pk (
            pk_columns: {id: $id},
            _set: { display: $display }
        ) {
            id
        }
    }
`

export interface Token {
    chainId: string,
    address: string,
    displayName: string,
}

export interface Preference {
    id: number;
    displayName?: string;
    display: boolean;
}

export interface PreferenceOutput extends Preference {
    address: string,
}

export interface PreferenceInput {
    chainId: string,
    address: String,
    displayName?: string,
    display: boolean,
}

export async function getERC20Preferences(
    user: IUser,
    idToken: string,
    chainId: string
) : Promise<Preference[]> {
    const client = setUrqlClientIfNecessary(idToken)
    const result = await client.query(
        GET_ERC20_PREFERENCES,
        {userId: user.uid, chainId}
    ).toPromise();
    if (result?.data == undefined) {
        return [];
    }
    return result.data.erc20_preferences;
}

export async function setERC20Preferences(
    user: IUser,
    idToken: string,
    data: PreferenceInput[],
) : Promise<{id: string}[]> {
    const client = setUrqlClientIfNecessary(idToken)
    const result = await client.mutation(
        INSERT_ERC20_PREFERENCES,
        data.map(d => ({
            userId: user.uid,
            chainId: d.chainId,
            address: d.address.toLowerCase(),
            displayName: d.displayName,
            display: d.display,
        }))
    ).toPromise();
    if (result?.data == undefined) {
        return [];
    }
    return result.data.insert_erc20_preferences;
}

export async function updateERC20Preference(
    idToken: string,
    data: {
        id: number,
        display: boolean,
    },
) : Promise<{id: string} | null> {
    const client = setUrqlClientIfNecessary(idToken)
    const result = await client.mutation(
        UPDATE_ERC20_PREFERENCE,
        data
    ).toPromise();
    if (result?.data == undefined) {
        return null;
    }
    return result.data.erc20_preferences;
}