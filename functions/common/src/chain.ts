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
  rpcUrls: ["https://polygon-mainnet.infura.io/v3/"],
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
  rpcUrls: ["https://polygon-mumbai.infura.io/v3/"],
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

export const ARBITRUM_TESTNET : Chain = {
  chainId: "421613",
  rpcUrls: ["https://endpoints.omniatech.io/v1/arbitrum/goerli/public"],
  name: "arbitrum_testnet",
  fullName: "Arbitrum Test Network",
  nativeCurrency: {
    name: "Arbitrum Ethereum",
    symbol: "aETH",
    decimals: 18,
  },
  blockExplorerUrls: ["https://goerli-rollup-explorer.arbitrum.io"],
  logoUrl: "https://i.postimg.cc/020dzv9j/nova.png",
};

export const ARBITRUM_NOVA : Chain = {
  chainId: "42170",
  rpcUrls: ["https://nova.arbitrum.io/rpc"],
  name: "arbitrum_nova",
  fullName: "Arbitrum Nova",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  blockExplorerUrls: ["https://nova-explorer.arbitrum.io/"],
  logoUrl: "https://i.postimg.cc/020dzv9j/nova.png",
};

export const ARBITRUM : Chain = {
  chainId: "42161",
  rpcUrls: ["https://arb1.arbitrum.io/rpc"],
  name: "arbitrum",
  fullName: "Arbitrum One",
  nativeCurrency: {
    name: "Arbitrum Ethereum",
    symbol: "AETH",
    decimals: 18,
  },
  blockExplorerUrls: ["https://explorer.arbitrum.io/"],
  logoUrl: "https://i.postimg.cc/mkJcpr2T/arbilogo.png",
};

export const SUPPORTED_CHAINS = [GOERLI, MUMBAI, ARBITRUM, ARBITRUM_TESTNET];

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
  } else if (chain === "galileo" || chain == "3334") {
    return GALILEO;
  } else if (chain === "arbitrum_nova" || chain == "42170") {
    return ARBITRUM_NOVA;
  } else if (chain === "arbitrum_testnet" || chain == "421613") {
    return ARBITRUM_TESTNET;
  } else if (chain === "arbitrum" || chain == "42161") {
    return ARBITRUM;
  }
  throw new Error("Unsupported chain");
}

export function refunder(_chain: Chain) : string {
  return "0x1A811678eEEDF16a1D0dF4b12e290F78a61A28F9";
}
