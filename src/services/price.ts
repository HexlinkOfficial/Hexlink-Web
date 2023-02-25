import axios from "axios";
import { ethers } from "ethers";

const BASE_COIN_URL = "https://api.coingecko.com/api/v3/simple/price";
const BASE_TOKEN_URL = "https://api.coingecko.com/api/v3/simple/token_price/";

const SUPPORTED_CHAINS = ["arbitrum_nova", "polygon", "ethereum"];

export async function getCoinPrice(chain: Chain) : Promise<{[token: string]: number}> {
    const coin = chain.nativeCurrency.name;
    const params = {ids: coin, vs_currencies: "usd"};
    try {
      const response = await axios.get(BASE_COIN_URL, { params });
      return response.data[coin.toLowerCase()]["usd"];
    } catch (err: any) {
      console.log(err);
      throw new Error(`Error in 'axiosGetJsonData(${BASE_COIN_URL})': ${err.message}`);
    }
}

export async function getTokenPrices(
    chain: Chain,
    tokens: string[]
) : Promise<{[token: string]: number}> {
    const tokensToSearch = tokens.filter(t => t != ethers.constants.AddressZero);
    let prices = {};
    if (tokensToSearch.length !== tokens.length) {
        prices[ethers.constants.AddressZero] = await getCoinPrice(chain);
    }
    if (!SUPPORTED_CHAINS.includes(chain.name)) {
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