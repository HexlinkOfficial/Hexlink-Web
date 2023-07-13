import { useChainStore } from "@/stores/chain"
import { StaticJsonRpcProvider } from "@ethersproject/providers"
import { Chain } from "../../../../functions/common/lib"
import { ENTRYPOINT, STACKUP_BUNDLER_URL_PREFIX, STACKUP_PAYMASTER_URL_PREFIX } from "@/web3/constants";

const pimlicoEndpoint = (chain: Chain) => {
  return `https://api.pimlico.io/v1/${useChainStore().chain.name
    }/rpc?apikey=${import.meta.env.VITE_PIMLICO_API_KEY}`
}

const stackupEndpoint = (chain: Chain) => {
  if (chain.name === "goerli") {
    return STACKUP_BUNDLER_URL_PREFIX + import.meta.env.VITE_STACKUP_API_KEY_GOERLI;
  } else if (chain.name === "sepolia") {
    return STACKUP_BUNDLER_URL_PREFIX + import.meta.env.VITE_STACKUP_API_KEY_SEPOLIA;
  } else if (chain.name === "mumbai") {
    return STACKUP_BUNDLER_URL_PREFIX + import.meta.env.VITE_STACKUP_API_KEY_MUMBAI;
  } else if (chain.name === "arbitrum_testnet") {
    return STACKUP_BUNDLER_URL_PREFIX + import.meta.env.VITE_STACKUP_API_KEY_ARBITRUM_GOERLI;
  } else {
    throw new Error("unsupported chain");
  }
}

export const getPimlicoProvider = (chain: Chain) => {
  console.log(pimlicoEndpoint(chain));
  return new StaticJsonRpcProvider(pimlicoEndpoint(chain));
}

export const getStackupPaymaster = (chain: Chain) => {
  if (chain.name === "goerli") {
    return STACKUP_PAYMASTER_URL_PREFIX + import.meta.env.VITE_STACKUP_API_KEY_GOERLI;
  } else if (chain.name === "sepolia") {
    return STACKUP_PAYMASTER_URL_PREFIX + import.meta.env.VITE_STACKUP_API_KEY_SEPOLIA;
  } else if (chain.name === "mumbai") {
    return STACKUP_PAYMASTER_URL_PREFIX + import.meta.env.VITE_STACKUP_API_KEY_MUMBAI;
  } else if (chain.name === "arbitrum_testnet") {
    return STACKUP_PAYMASTER_URL_PREFIX + import.meta.env.VITE_STACKUP_API_KEY_ARBITRUM_GOERLI;
  } else {
    throw new Error("unsupported chain");
  }
}

// export const getStackupPaymaster = () => {
//   return new StaticJsonRpcProvider('https://api.stackup.sh/v1/paymaster/21fb220e2606b06acc1149fdf78d4176da167e89880f8dc83893b2dbb237babc');
// }
