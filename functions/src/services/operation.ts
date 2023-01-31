"use strict";

import axios from "axios";
import type {Chain} from "../../common/lib";

const LOCAL_URL = "http://localhost:9000/submit/";
const PROD_URL = "https://api.hexlink.io/submit/";

function txServiceUrl() {
  if (process.env.FUNCTIONS_EMULATOR === "true") {
    return LOCAL_URL;
  } else {
    return PROD_URL;
  }
}

export async function submit(chain: Chain, data: any) {
  const url = txServiceUrl() + chain.name;
  try {
    const response = await axios.post(url, data);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(`Error in 'axiosGetJsonData(${url})': ${err.message}`);
  }
}

