import type { User } from 'firebase/auth'
import { gql } from '@apollo/client'
import { getAuth } from 'firebase/auth'
import { useAuthStore } from '@/stores/auth'
import { getIdTokenAndSetClaimsIfNecessary } from './auth'
import { app } from './firebase'
import { getApolloClient, setApolloClientIfNecessary } from './apolloClient'

const auth = getAuth(app)

export const GET_USERS = gql`
    query GetUsers(
        $orderBy: users_order_by!
        $limit: Int!
        $offset: Int!
        $where: users_bool_exp
    ) {
        users(
            limit: $limit
            offset: $offset
            order_by: [$orderBy]
            where: $where
        ) {
            id
            display_name
            created_at
            email
            photo_url
        }
    }
`

export const GET_USER = gql`
    query GetUser($id: String!) {
        users_by_pk(id: $id) {
            id
            display_name
            created_at
            email
            photo_url
        }
    }
`

export const ADD_USER = gql`
    mutation (
        $id: String!
        $displayName: String!
        $email: String!
        $photoURL: String
    ) {
        insert_users(
            objects: {
                id: $id
                display_name: $displayName
                email: $email
                photo_url: $photoURL,
            }
        ) {
            affected_rows
            returning {
                id
                email
                created_at
            }
        }
    }
`

export async function getUser(user: User, idToken: string) : Promise<User | null> {
    const client = setApolloClientIfNecessary(idToken)
    const { data, networkStatus } = await client.query({
        query: GET_USER,
        variables: {
            id: user.uid,
        },
    })
    if (networkStatus === 8) {
        console.error('You appear to be offline, check your internet connection!')
        return null;
    }

    if (!data?.users_by_pk) {
        try {
            await createInitialUser(user, idToken)
        } catch (error) {
            console.log('Error trying to initialize user: ', error)
            return null;
        }
        return getUser(user, idToken)
    }

    return data.users_by_pk
}

export async function createInitialUser(user: User, idToken: string) {
    const userToWrite = {
        id: user.uid,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        email: user.email,
        photoURL: user.photoURL,
    }
    const client = setApolloClientIfNecessary(idToken)
    await client.mutate({
        mutation: ADD_USER,
        variables: userToWrite,
    })
    await getApolloClient()!.refetchQueries({
        include: ['GetUser'],
    })
}