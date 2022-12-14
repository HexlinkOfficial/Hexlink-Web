import type { Network } from "@/types";

export const GOERLI : Network = {
    chainId: 5,
    name: "goerli",
    chainName: "Goerli Test Network",
    rpcUrls: ["https://goerli.infura.io/v3/"],
    alchemy: {
        rpcUrl: "https://eth-goerli.g.alchemy.com/v2/U4LBbkMIAKCf4GpjXn7nB7H1_P9GiU4b",
        key: "U4LBbkMIAKCf4GpjXn7nB7H1_P9GiU4b",
    },
    nativeCurrency: {
        name: "Goerli ETH",
        symbol: "gETH",
        decimals: 18
    },
    blockExplorerUrls: ["https://goerli.etherscan.io"],
    logoUrl: "https://token.metaswap.codefi.network/assets/networkLogos/ethereum.svg",
};

export const POLYGON : Network = {
    chainId: 137,
    rpcUrls: ["https://polygon-rpc.com"],
    alchemy: {
        rpcUrl: "https://polygon-mainnet.g.alchemy.com/v2/1GmfWOSlYIlUI0UcCu4Y2O-8DmFJrlqA",
        key: "1GmfWOSlYIlUI0UcCu4Y2O-8DmFJrlqA",
    },
    name: "polygon",
    chainName: "Polygon Network",
    nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18
    },
    blockExplorerUrls: ["https://polygonscan.com"],
    logoUrl: "https://token.metaswap.codefi.network/assets/networkLogos/polygon.svg",
};

export const MUMBAI : Network = {
    chainId: 80001,
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    alchemy: {
        rpcUrl: "https://polygon-mumbai.g.alchemy.com/v2/Fj__UEjuIj0Xym6ofwZfJbehuuXGpDxe",
        key: "Fj__UEjuIj0Xym6ofwZfJbehuuXGpDxe",
    },
    name: "mumbai",
    chainName: "Polygon Test Network",
    nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18
    },
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    logoUrl: "https://token.metaswap.codefi.network/assets/networkLogos/polygon.svg",
};