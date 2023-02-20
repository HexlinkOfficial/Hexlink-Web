import {createClient} from "@urql/core";
import * as functions from "firebase-functions";
import fetch from "cross-fetch";

const secrets = functions.config().doppler || {};
export const client = () => createClient({
  url: secrets.VITE_HASURA_URL,
  fetch,
  fetchOptions: () => {
    return {
      headers: {"x-hasura-admin-secret": secrets.HASURA_GRAPHQL_ADMIN_SECRET},
    };
  },
});
