import axios from "axios";
import { ethers } from "ethers";
import type { Chain } from "../../../functions/common";

const BASE_COIN_URL = "https://api.coingecko.com/api/v3/simple/price";
const BASE_TOKEN_URL = "https://api.coingecko.com/api/v3/simple/token_price/";

const SUPPORTED_CHAINS = ["arbitrum_nova", "polygon", "ethereum", "arbitrum"];
const MATIC_CHAINS = ["mumbai", "polygon"];
const EHT_CHAINS = ["goerli", "ethereum", "sepolia", "arbitrum_nova", "arbitrum", "arbitrum_testnet"]

export async function getCoinPrice(chain: Chain) : Promise<string> {
    let coin: string;
    if (EHT_CHAINS.includes(chain.name)) {
        coin = "ethereum";
    }
    if (MATIC_CHAINS.includes(chain.name)) {
        coin = "matic-network";
    }
    const params = {ids: coin!, vs_currencies: "usd"};
    try {
      const response = await axios.get(BASE_COIN_URL, { params });
      return response.data[coin!.toLowerCase()]["usd"];
    } catch (err: any) {
      console.log(err);
      throw new Error(`Error in 'axiosGetJsonData(${BASE_COIN_URL})': ${err.message}`);
    }
}

export async function getTokenPrices(
    chain: Chain,
    tokens: string[]
) : Promise<{[token: string]: string}> {
    const tokensToSearch = tokens.filter(t => t != ethers.constants.AddressZero);
    let prices : {[key: string]: string} = {};
    if (tokensToSearch.length !== tokens.length) {
        prices[ethers.constants.AddressZero] = await getCoinPrice(chain);
    }
    if (tokensToSearch.length === 0 || !SUPPORTED_CHAINS.includes(chain.name)) {
      return prices;
    }
    const params = {
        contract_addresses: tokensToSearch.join(","),
        vs_currencies: "usd",
    }
    const url = BASE_TOKEN_URL + chain.name;
    try {
      const response = await axios.get(url, { params });
      if (response.error) {
        throw new Error("failed to query price");
      }
      tokensToSearch.forEach(token => {
        if (response.data[token]) {
            prices[token] = response.data[token]["usd"] || "0";
        }
      });
    } catch (err: any) {
      console.log(err);
    }
    return prices;
}