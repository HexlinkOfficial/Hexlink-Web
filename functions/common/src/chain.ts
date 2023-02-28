/* eslint-disable require-jsdoc */
import type {ethers} from "ethers";

export interface Chain {
    name: string,
    chainId?: string,
    rpcUrls: string[],
    fullName: string,
    nativeCurrency: {
        name: string,
        symbol: string,
        decimals: number,
    },
    blockExplorerUrls: string[],
    logoUrl: string,
}

export const GOERLI : Chain = {
  chainId: "5",
  name: "goerli",
  fullName: "Goerli Test Network",
  rpcUrls: ["https://goerli.infura.io/v3/"],
  nativeCurrency: {
    name: "Goerli Ethereum",
    symbol: "gETH",
    decimals: 18,
  },
  blockExplorerUrls: ["https://goerli.etherscan.io"],
  logoUrl: "https://token.metaswap.codefi.network/assets/networkLogos/ethereum.svg",
};

export const POLYGON : Chain = {
  chainId: "137",
  rpcUrls: ["https://polygon-rpc.com"],
  name: "polygon",
  fullName: "Polygon Network",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  blockExplorerUrls: ["https://polygonscan.com"],
  logoUrl: "https://token.metaswap.codefi.network/assets/networkLogos/polygon.svg",
};

export const MUMBAI : Chain = {
  chainId: "80001",
  rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
  name: "mumbai",
  fullName: "Polygon Test Network",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  logoUrl: "https://token.metaswap.codefi.network/assets/networkLogos/polygon.svg",
};

export const GALILEO : Chain = {
  chainId: "3334",
  rpcUrls: ["https://galileo.web3q.io:8545"],
  name: "galileo",
  fullName: "Web3Q Galileo Test Network",
  nativeCurrency: {
    name: "W3Q",
    symbol: "W3Q",
    decimals: 18,
  },
  blockExplorerUrls: ["https://explorer.galileo.web3q.io/"],
  logoUrl: "",
};

export const SUPPORTED_CHAINS = [GOERLI, MUMBAI];

export async function getChainFromProvider(
    provider: ethers.providers.Provider
) : Promise<Chain> {
  const network = await provider.getNetwork();
  return getChain(network.chainId);
}

export function getChain(chain: string | number) : Chain {
  chain = chain.toString();
  if (chain === "goerli" || chain === "5") {
    return GOERLI;
  } else if (chain === "polygon" || chain === "137") {
    return POLYGON;
  } else if (chain === "mumbai" || chain == "80001") {
    return MUMBAI;
  } else if (chain === "mumbai" || chain == "80001") {
    return MUMBAI;
  } else if (chain === "galileo" || chain == "3334") {
    return GALILEO;
  }
  throw new Error("Unsupported chain");
}

export function refunder(_chain: Chain) : string {
  return "0x1A811678eEEDF16a1D0dF4b12e290F78a61A28F9";
}