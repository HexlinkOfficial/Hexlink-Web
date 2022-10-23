import type { User } from 'firebase/auth'
import { gql } from '@urql/core'
import { setUrqlClientIfNecessary } from './urql'

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
        $displayName: String
        $email: String
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
    const client = setUrqlClientIfNecessary(idToken)
    const result = await client.query(GET_USER, {id: user.uid}).toPromise();
    if (result?.data == undefined) {
        try {
            await createInitialUser(user, idToken)
        } catch (error) {
            console.log('Error trying to initialize user: ', error)
            return null;
        }
        return getUser(user, idToken)
    }
    return result.data.users_by_pk;
}

export async function createUserIfNecessary(user: User, idToken: string) {
    console.log("System log: Check if user was created")
    const client = setUrqlClientIfNecessary(idToken)
    const result = await client.query(GET_USER, {id: user.uid}).toPromise();
    if (result?.data == undefined || result?.data?.users_by_pk == null) {
        console.log("System log: Start to create user")
        try {
            await createInitialUser(user, idToken)
        } catch (error) {
            throw error
        }
    }
    return true;
}

export async function createInitialUser(user: User, idToken: string) {
    const userToWrite = {
        id: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
    }
    const client = setUrqlClientIfNecessary(idToken)
    try {
        await client.mutation(ADD_USER, userToWrite).toPromise()
    } catch (error) {
        console.log('"System log: Error trying to create user: ', error)
        console.log(error)
        throw error
    }
}