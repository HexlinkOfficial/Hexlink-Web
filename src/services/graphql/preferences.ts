import type { IUser } from '@/stores/auth'
import { gql } from '@urql/core'
import { setUrqlClientIfNecessary } from './urql'

export const GET_ERC20_PREFERENCES = gql`
    query GetPreferences (
        $userId: String!
        $chainId: Int!
    ) {
        erc20_preferences (
            where: {
                user_id: { _eq: $userId },
                chain_id: { _eq: $chainId }
            }
        ) {
            id
            address
            display_name
            display
        }
    }
`

export const INSERT_ERC20_PREFERENCES = gql`
    mutation ($objects: [erc20_preferences_insert_input!]!) {
        insert_erc20_preferences (
            objects: $objects
        ) {
            affected_rows
            returning {
                id
            }
        }
    }
`

export const UPDATE_ERC20_PREFERENCE = gql`
    mutation (
        $id: Int!
        $display: Boolean!
    ) {
        update_erc20_preferences_by_pk (
            pk_columns: {id: $id},
            _set: { display: $display }
        ) {
            id
            display
        }
    }
`

export interface Preference {
    id: number;
    displayName?: string;
    display: boolean;
}

export interface PreferenceOutput extends Preference {
    address: string,
}

export interface PreferenceInput {
    chainId: number,
    address: string,
    displayName?: string,
    display: boolean,
}

export async function getERC20Preferences(
    user: IUser,
    idToken: string,
    chainId: number
) : Promise<PreferenceOutput[]> {
    const client = setUrqlClientIfNecessary(idToken)
    const result = await client.query(
        GET_ERC20_PREFERENCES,
        {userId: user.uid, chainId}
    ).toPromise();
    if (result?.data == undefined) {
        console.log(result);
        throw new Error("Failed to get erc20 preferences");
    }
    return result.data.erc20_preferences;
}

export async function setERC20Preferences(
    user: IUser,
    idToken: string,
    data: PreferenceInput[],
) : Promise<{id: number}[]> {
    const client = setUrqlClientIfNecessary(idToken)
    const result = await client.mutation(
        INSERT_ERC20_PREFERENCES,
        {
            objects: data.map(d => ({
                user_id: user.uid,
                chain_id: d.chainId,
                address: d.address.toLowerCase(),
                display_name: d.displayName,
                display: d.display,
            }))
        }
    ).toPromise();
    if (result?.data == undefined) {
        console.log(result);
        throw new Error("Failed to set erc20 preference");
    }
    return result.data.insert_erc20_preferences.returning;
}

export async function updateERC20Preference(
    idToken: string,
    data: {
        id: number,
        display: boolean,
    },
) : Promise<{id: number, display: boolean}> {
    const client = setUrqlClientIfNecessary(idToken)
    const result = await client.mutation(
        UPDATE_ERC20_PREFERENCE,
        data
    ).toPromise();
    if (result?.data == undefined) {
        console.log(result);
        throw new Error("Failed to update erc20 preference");
    }
    return result.data.update_erc20_preferences_by_pk;
}