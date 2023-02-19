import {createClient} from "@urql/core";
import fetch from "cross-fetch";

export const client = createClient({
  url: process.env.VITE_HASURA_URL!,
  fetch,
  fetchOptions: () => {
    return {
      headers: {"x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET!},
    };
  },
});