import { BigNumber } from "ethers";
import type { Network } from "@/types";

export const GOERLI : Network = {
    chainId: BigNumber.from(5),
    chainName: "Goerli Test Network",
    rpcUrls: ["https://eth-goerli.g.alchemy.com/v2/U4LBbkMIAKCf4GpjXn7nB7H1_P9GiU4b"],
    nativeCurrency: {
        name: "Goerli ETH",
        symbol: "Goerli ETH",
        decimals: 18
    },
    blockExplorerUrls: ["https://goerli.etherscan.io/"]
};

export const POLYGON : Network = {
    chainId: BigNumber.from("0x89"),
    rpcUrls: ["https://rpc-mainnet.matic.network/"],
    chainName: "Matic Mainnet",
    nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18
    },
    blockExplorerUrls: ["https://polygonscan.com/"]
};