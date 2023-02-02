export const GOERLI = {
    chainId: "5",
    name: "goerli",
    fullName: "Goerli Test Network",
    rpcUrls: ["https://goerli.infura.io/v3/"],
    nativeCurrency: {
        name: "Goerli ETH",
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
export const SUPPORTED_CHAINS = [GOERLI, MUMBAI];
export async function getChainFromProvider(provider) {
    const network = await provider.getNetwork();
    return getChain(network.chainId);
}
export function getChain(chain) {
    chain = chain.toString();
    if (chain == "goerli" || chain == "5") {
        return GOERLI;
    }
    else if (chain == "polygon" || chain == "137") {
        return POLYGON;
    }
    else if (chain == "mumbai" || chain == "80001") {
        return MUMBAI;
    }
    throw new Error("Unsupported chain");
}
export const PriceConfigs = {
    "goerli": {
        nativeCurrencyInUsd: "1500.0",
        gasPrice: "10000000000", // 10 gwei
    },
    "polygon": {
        nativeCurrencyInUsd: "1.0",
        gasPrice: "100000000000", // 100 gwei
    },
    "mumbai": {
        nativeCurrencyInUsd: "1.0",
        gasPrice: "2000000000", // 2 gwei
    },
};
