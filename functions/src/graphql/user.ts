import {gql} from "@urql/core";
import {client} from "./client";

export const INSERT_USER = gql`
    mutation ($objects: [user_insert_input!]!) {
        insert_user (
            objects: $objects
        ) {
            affected_rows
            returning {
                id
            }
        }
    }
`;

export const GET_USER = gql`
  query GetUser($email: String!) {
    user(
        where: {
          email: { _eq: $email }
        }
    ) {
        id
        email
        otp
        updated_at
        is_active
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: uuid!) {
    user_by_pk(id: $id) {
        id
        email
        otp
        updated_at
        is_active
    }
  }
`;


export const UPDATE_OTP = gql`
    mutation (
        $id: uuid!
        $otp: String!
        $isActive: Boolean
    ) {
        update_user_by_pk (
            pk_columns: {id: $id},
            _set: {
              otp: $otp
              is_active: $isActive
            }
        ) {
            id
        }
    }
`;

export interface User {
  email: string,
  otp: string,
  id?: string,
  updatedAt?: string,
  isActive?: boolean
}

export async function insertUser(
    inputs: User[]
) : Promise<{id: number}[]> {
  const result = await client().mutation(
      INSERT_USER,
      {objects: inputs.map((i) => ({
        email: i.email,
        otp: i.otp,
        is_active: i.isActive,
      }))}
  ).toPromise();
  return result.data.insert_user.returning;
}

export async function getUser(
    email: string
) : Promise<User | undefined> {
  const result = await client().query(
      GET_USER,
      {email: email}
  ).toPromise();
  if (result.error) {
    console.log("Failed to get user", result.error);
    return undefined;
  }

  const user = result.data?.user;
  if (user === undefined || user.length < 1) {
    console.log("Empty user data", user);
    return undefined;
  }

  return {
    id: user[0].id,
    email: user[0].email,
    otp: user[0].otp,
    updatedAt: user[0].updated_at,
    isActive: user[0].is_active,
  };
}

export async function getUserById(
    id: string
) : Promise<User | undefined> {
  const result = await client().query(
      GET_USER_BY_ID,
      {id: id}
  ).toPromise();
  if (result.error) {
    console.log("Failed to get user", result.error);
    return undefined;
  }

  const user = result.data?.user_by_pk;
  if (user === undefined || user.length < 1) {
    console.log("Empty user data", user);
    return undefined;
  }

  return {
    id: user.id,
    email: user.email,
    otp: user.otp,
    updatedAt: user.updated_at,
    isActive: user.is_active,
  };
}

export async function updateOTP(
    data: {
      id: string,
      otp: string,
      isActive: boolean,
    },
) : Promise<void> {
  const result = await client().mutation(
      UPDATE_OTP,
      data
  ).toPromise();

  if (result?.error) {
    console.log(result);
    throw new Error(result?.error.toString());
  }
}
