import {createClient} from "@urql/core";
import * as functions from "firebase-functions";

const secrets = functions.config().doppler || {};
export const client = () => createClient({
  url: secrets.VITE_HASURA_URL,
  fetchOptions: () => {
    return {
      headers: {"x-hasura-admin-secret": secrets.HASURA_GRAPHQL_ADMIN_SECRET},
    };
  },
});
