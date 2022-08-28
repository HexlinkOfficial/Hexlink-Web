import { createClient, provideClient } from '@urql/vue';
import type { Client } from '@urql/vue';

let urqlClient: Client | null;
let urqlClientIdToken: string;

function createUrqlClient(idToken: string) {
    return createClient({
        url: import.meta.env.VITE_HASURA_URL,
        fetchOptions: () => {
            return {
                headers: { authorization: `Bearer ${idToken}`},
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
    return urqlClient
}

export function getUrqlClient() {
    return urqlClient
}
