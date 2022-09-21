import * as ethers from "ethers";
import type { Provider } from "@ethersproject/providers"

let provider: Provider | null = null;
export function getProvider() {
    if (!provider) {
        provider = new ethers.providers.AlchemyProvider(
            import.meta.env.VITE_HARDHAT_NETWORK,
            import.meta.env.VITE_GOERLI_ALCHEMY_KEY
        );
    }
    return provider;
}