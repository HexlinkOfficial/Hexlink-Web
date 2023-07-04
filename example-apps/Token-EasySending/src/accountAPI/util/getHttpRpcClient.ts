import { ENTRYPOINT, STACKUP_BUNDLER_URL_PREFIX } from "@/web3/constants";
import { HttpRpcClient } from "@account-abstraction/sdk/dist/src/HttpRpcClient";
import { Chain } from "../../../../../functions/common/lib";

function bundlerUrl(chain: Chain) : string {
  if (chain.name ===  "goerli") {
    return STACKUP_BUNDLER_URL_PREFIX + import.meta.env.VITE_STACKUP_API_KEY_GOERLI;
  } else if (chain.name ===  "sepolia") {
    return STACKUP_BUNDLER_URL_PREFIX + import.meta.env.VITE_STACKUP_API_KEY_SEPOLIA;
  } else if (chain.name === "mumbai") {
    return STACKUP_BUNDLER_URL_PREFIX + import.meta.env.VITE_STACKUP_API_KEY_MUMBAI;
  } else if (chain.name === "arbitrum_testnet") {
    return STACKUP_BUNDLER_URL_PREFIX + import.meta.env.VITE_STACKUP_API_KEY_ARBITRUM_GOERLI;
  } else {
    throw new Error("unsupported chain");
  }
}

export async function getHttpRpcClient(chain: Chain) {
  return new HttpRpcClient(
    bundlerUrl(chain),
    ENTRYPOINT,
    Number(chain.chainId)
  );
}