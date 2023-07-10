import { useChainStore } from "@/stores/chain"
import { StaticJsonRpcProvider } from "@ethersproject/providers"
import { Chain } from "../../../../functions/common/lib"

const pimlicoEndpoint = (chain: Chain) => {
    return `https://api.pimlico.io/v1/${
        useChainStore().chain.name
    }/rpc?apikey=${import.meta.env.VITE_PIMLICO_API_KEY}`
}

export const getPimlicoProvider = (chain: Chain) => {
    console.log(pimlicoEndpoint(chain));
    return new StaticJsonRpcProvider(pimlicoEndpoint(chain));
}

export const getStackupPaymaster = () => {
    return new StaticJsonRpcProvider('https://api.stackup.sh/v1/paymaster/21fb220e2606b06acc1149fdf78d4176da167e89880f8dc83893b2dbb237babc');
}
