
import type {Chain} from "../../functions/common";
import type { Provider } from "@ethersproject/providers";
import { InfuraProvider } from "@ethersproject/providers";

export function getInfuraProvider(chain: Chain) : Provider {
    return new InfuraProvider(
        Number(chain.chainId),
        process.env.VITE_INFURA_API_KEY,
    );
};