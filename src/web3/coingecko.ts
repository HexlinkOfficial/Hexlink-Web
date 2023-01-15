import CoinGecko  from "coingecko-api";

export async function getTokenPrice(token: string) {
  let data = await CoinGecko.fetchCoinContractInfo(token);
  return data;
}