import type { Client } from '@urql/vue';
import { createClient, defaultExchanges, subscriptionExchange } from '@urql/vue';
import { createClient as createWSClient } from 'graphql-ws';
import { refreshToken } from '../services/auth';

let urqlClient: Client | null;
let urqlClientIdToken: string;

function createUrqlWsClient(idToken: string) {
    return createWSClient({
        url: import.meta.env.VITE_HASURA_WS_URL,
        options: {
            reconnect: true,
            connectionParams: {
                headers: { authorization: `Bearer ${idToken}` }
            }
        }
    });
};

export function createUrqlClient(idToken: string, policy: string = 'cache-and-network') {
    const wsClient = createUrqlWsClient(idToken);
    return createClient({
        url: import.meta.env.VITE_HASURA_URL,
        requestPolicy: policy,
        fetchOptions: () => {
            return {
                headers: { authorization: `Bearer ${idToken}`},
            };
        },
        exchanges: [
            ...defaultExchanges,
            subscriptionExchange({
                forwardSubscription: (operation) => ({
                    subscribe: (sink) => ({
                        unsubscribe: wsClient.subscribe(operation, sink),
                    }),
                }),
            }),
        ],
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
