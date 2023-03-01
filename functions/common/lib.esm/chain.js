export const GOERLI = {
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
export const POLYGON = {
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
export const MUMBAI = {
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
export const GALILEO = {
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

export const ARBITRUM_NOVA_TESTNET = {
  chainId: "421613",
  rpcUrls: ["https://goerli-rollup.arbitrum.io/rpc"],
  name: "arbitrum_nova_testnet",
  fullName: "Arbitrum Nova Test Network",
  nativeCurrency: {
    name: "Goerli Ethereum",
    symbol: "WETH",
    decimals: 18,
  },
  blockExplorerUrls: ["https://goerli-rollup-explorer.arbitrum.io"],
  logoUrl: "https://global-uploads.webflow.com/62ed6a1f52cca7f115c61d3b/62f0266f58ad156a291a8324_AN_mark_orange.svg",
};

export const ARBITRUM_NOVA = {
  chainId: "42170",
  rpcUrls: ["https://nova.arbitrum.io/rpc"],
  name: "arbitrum_nova",
  fullName: "Arbitrum Nova",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "WETH",
    decimals: 18,
  },
  blockExplorerUrls: ["https://nova-explorer.arbitrum.io/"],
  logoUrl: "https://global-uploads.webflow.com/62ed6a1f52cca7f115c61d3b/62f0266f58ad156a291a8324_AN_mark_orange.svg",
};
export const SUPPORTED_CHAINS = [GOERLI, MUMBAI, ARBITRUM_NOVA, ARBITRUM_NOVA_TESTNET];
export async function getChainFromProvider(provider) {
    const network = await provider.getNetwork();
    return getChain(network.chainId);
}
export function getChain(chain) {
    chain = chain.toString();
    if (chain === "goerli" || chain === "5") {
        return GOERLI;
    }
    else if (chain === "polygon" || chain === "137") {
        return POLYGON;
    }
    else if (chain === "mumbai" || chain == "80001") {
        return MUMBAI;
    }
    else if (chain === "mumbai" || chain == "80001") {
        return MUMBAI;
    }
    else if (chain === "galileo" || chain == "3334") {
        return GALILEO;
    }
    throw new Error("Unsupported chain");
}
export function refunder(_chain) {
    return "0x1A811678eEEDF16a1D0dF4b12e290F78a61A28F9";
}
