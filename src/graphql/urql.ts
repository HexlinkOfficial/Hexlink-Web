import { createClient } from '@urql/vue';
import type { Client } from '@urql/vue';
import { refreshToken } from '../services/auth';
import { jwt } from "jsonwebtoken";

let urqlClient: Client | null;
let urqlClientIdToken: string;

function getIdToken(token: string) {
    if (import.meta.env.VITE_USE_FUNCTIONS_EMULATOR === 'true') {
        return jwt.sign(jwt.decode(token), "DkMEqQV1ZtLnTCGQOdtce5TfhpHY74ob");
    }
    return token;
}

function createUrqlClient(idToken: string) {
    return createClient({
        url: import.meta.env.VITE_HASURA_URL,
        fetchOptions: () => {
            return {
                headers: { authorization: `Bearer ${getIdToken(idToken)}`},
            };
        },
    });
}

export function clearUrqlClient() {
    urqlClient = null
}

export function setUrqlClientIfNecessary(idToken: string) {
    if (!urqlClient || (idToken != urqlClientIdToken && idToken)) {
        urqlClient = createUrqlClient(idToken)
        urqlClientIdToken = idToken
    }
    return urqlClient;
}

export async function handleUrqlResponse(result: any) {
    if (result?.error) {
        let gerrors = result.error.graphQLErrors || [];
        for (const err of gerrors) {
            if (err.message == "Could not verify JWT: JWTExpired") {
                await refreshToken();
                return false;
            } else {
                console.log(result);
                throw new Error(result?.error);
            }
        }
    }
    if (!result?.data) {
        console.log(result);
        throw new Error("No data found")
    }
    return true;
}
