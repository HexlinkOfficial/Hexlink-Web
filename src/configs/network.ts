import type { Network } from "@/types";
import { BigNumber as EthBigNumber } from "ethers";

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
        decimals: 18,
        priceInUsd: "1500.0"
    },
    blockExplorerUrls: ["https://goerli.etherscan.io"],
    logoUrl: "https://token.metaswap.codefi.network/assets/networkLogos/ethereum.svg",
    defaultGasPrice: EthBigNumber.from("10000000000"),
    addresses: {
        "hexlink": "0xbad6a7948a1d3031ee7236d0180b6271fa569148",
        "nativeCoin": "0x0000000000000000000000000000000000000000",
        "redPacket": "0x36e21785316978491f6a0CF420af3d37848cE2dF",
        "wrappedCoin": "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
        "refund": "0xa4b368e3a9D49Ff15b58f70Fb976724A98B6D149",
        "stableCoins": [
            "0x2f3a40a3db8a7e3d09b0adfefbce4f6f81927557", // usdc
            "0x07865c6E87B9F70255377e024ace6630C1Eaa37F", // usdc2
            "0x11fe4b6ae13d2a6055c8d9cf65c55bac32b5d844", // dai
        ],
        "validator": "0xEF2e3F91209F88A3143e36Be10D52502162426B3"
    }
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
        decimals: 18,
        priceInUsd: "1.0"
    },
    blockExplorerUrls: ["https://polygonscan.com"],
    logoUrl: "https://token.metaswap.codefi.network/assets/networkLogos/polygon.svg",
    defaultGasPrice: EthBigNumber.from("100000000000"),
    addresses: {
        "nativeCoin": "0x0000000000000000000000000000000000001010",
        "wrappedCoin": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "stableCoins": [
            "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // usdt
            "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // usdc
            "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", // dai
        ],
        "validator": "0x030ffbc193c3f9f4c6378beb506eecb0933fd457",
    }
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
        decimals: 18,
        priceInUsd: "1.0"
    },
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    logoUrl: "https://token.metaswap.codefi.network/assets/networkLogos/polygon.svg",
    defaultGasPrice: EthBigNumber.from("2000000000"),
    addresses: {
        "hexlink": "0x78317ef8b020Fe10e845ab8723403cF1e58Ef1Cc",
        "redPacket": "0xAAf0Bc5Ef7634b78F2d4f176a1f34493802e9d5C",
        "nativeCoin": "0x0000000000000000000000000000000000000000",
        "wrappedCoin": "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
        "refund": "0xa4b368e3a9D49Ff15b58f70Fb976724A98B6D149",
        "stableCoins": [
            "0xE097d6B3100777DC31B34dC2c58fB524C2e76921", // usdc
        ],
        "validator": "0xEF2e3F91209F88A3143e36Be10D52502162426B3"
    }
};

export const getNetwork = (chain: string) => {
    if (chain == "goerli") {
        return GOERLI;
    } else if (chain == "polygon") {
        return POLYGON;
    } else if (chain == "mumbai") {
        return MUMBAI;
    }
}