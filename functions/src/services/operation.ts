"use strict";

import axios from "axios";
import type {Chain} from "../../common/lib";
import * as functions from "firebase-functions";

const LOCAL_URL = "http://localhost:9999/submit/";
const PROD_URL = process.env.TRANSACTION_SERVICE_URL;

function txServiceUrl() {
  if (process.env.FUNCTIONS_EMULATOR === "true") {
    return LOCAL_URL;
  } else {
    return PROD_URL;
  }
}

export async function submit(chain: Chain, data: any) {
  const secrets = functions.config().doppler || {};
  const url = txServiceUrl() + chain.name;
  try {
    const response = await axios.post(url, data, {
      headers: {
        authorization: secrets.TRANSACTION_SERVICE_SECRET!,
      },
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(data);
    throw new Error(`Error in 'axiosGetJsonData(${url})': ${err.message}`);
  }
}

