import type { User } from 'firebase/auth'
import { gql } from '@urql/core'
import { setUrqlClientIfNecessary } from './urql'

export const GET_SUBSCRIPTIONS = gql`
    query GetSubscriptions(
        $userId: String!
        $protocol: String!
    ) {
        subscriptions (
            user_id: $userId
            protocol: $protocol
        ) {
            id,
            chain_id
            address
            created_at
        }
    }
`

export const SUBSCRIBE = gql`
    mutation (
        $userId: String!
        $chainId: Int!
        $address: String!
        $protocol: String!
    ) {
        subscribe (
            objects: {
                user_id: $userId
                chain_id: $chainId
                address: $address
                protocol: $protocol
            }
        ) {
            affected_rows
            returning {
                user_id
                chain_id
                address
                created_at
            }
        }
    }
`

export const UNSUBSCRIBE = gql`
    mutation ($id: Int!) {
        unsubscribe (where: {id: {_eq: $id}}) {
            affected_rows
            returning {
                id,
                chain_id,
                address,
                protocol
            }
        }
    }
`

export type Protocol = 'ERC20' | 'ERC721';

export interface Token {
    chainId: string,
    address: String,
    protocol: Protocol,
}

export interface Subscription {
    chainId: string,
    address: String,
    protocol: Protocol,
    created_at: string,
}

export async function getSubscriptions(user: User, protocol: Protocol, idToken: string) : Promise<Subscription[]> {
    const client = setUrqlClientIfNecessary(idToken)
    const result = await client.query(
        GET_SUBSCRIPTIONS,
        {userId: user.uid, protocol}
    ).toPromise();
    if (result?.data == undefined) {
        return [];
    }
    return result.data.subscriptions;
}

export async function subscribe(user: User, idToken: string, token: Token) : Promise<Subscription | null> {
    const client = setUrqlClientIfNecessary(idToken)
    const result = await client.mutation(
        SUBSCRIBE,
        {
            userId: user.uid,
            chainId: token.chainId,
            address: token.address,
            protocol: token.protocol,
        }
    ).toPromise();
    if (result?.data == undefined) {
        return null;
    }
    return result.data.subscribe;
}

export async function unsubscribeERC20(idToken: string, id: number) : Promise<Token | null> {
    const client = setUrqlClientIfNecessary(idToken)
    const result = await client.query(UNSUBSCRIBE, {id}).toPromise();
    if (result?.data == undefined) {
        return null;
    }
    return result.data.unsubscribe;
}