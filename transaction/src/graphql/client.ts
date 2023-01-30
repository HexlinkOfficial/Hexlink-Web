import {createClient} from "@urql/core";

export const client = createClient({
  url: process.env.VITE_HASURA_URL!,
  fetchOptions: () => {
    return {
      headers: {"x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET!},
    };
  },
});