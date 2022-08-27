import { ApolloClient, InMemoryCache, } from '@apollo/client'
import type { NormalizedCacheObject } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'

let apolloClient: ApolloClient<NormalizedCacheObject> | null;
let apolloClientIdToken: string;

function createApolloClient(idToken: string) {
    return new ApolloClient<NormalizedCacheObject>({
        link: new WebSocketLink({
            uri: `wss://${import.meta.env.VUE_APP_HASURA_URL}`,
            options: {
                reconnect: true,
                connectionParams: {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                },
            },
        }),
        cache: new InMemoryCache(),
    })
}

export function clearApolloClient() {
    apolloClient = null
}

export function setApolloClientIfNecessary(idToken: string) {
    if (!apolloClient || (idToken != apolloClientIdToken && idToken)) {
        apolloClient = createApolloClient(idToken)
        apolloClientIdToken = idToken
        return apolloClient
    }

    return apolloClient
}

export function getApolloClient() {
    return apolloClient
}
