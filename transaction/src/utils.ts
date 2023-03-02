
import type {Chain} from "../../functions/common";
import { ethers } from "ethers";

export function getProvider(chain: Chain) {
    if (chain.name === "arbitrum_nova") {
        return new ethers.providers.JsonRpcProvider(
            {url: chain.rpcUrls[0]}
        );
    } else {
        return new ethers.providers.InfuraProvider(
            Number(chain.chainId),
            process.env.VITE_INFURA_API_KEY
        );
    }
}
