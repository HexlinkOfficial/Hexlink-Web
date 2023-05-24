import { HttpRpcClient } from "@account-abstraction/sdk/dist/src/HttpRpcClient";
import { Provider } from "@ethersproject/providers";

export async function getHttpRpcClient(
  provider: Provider,
  bundlerUrl: string,
  entryPointAddress: string
) {
  const chainId = await provider.getNetwork().then((net) => net.chainId);
  return new HttpRpcClient(bundlerUrl, entryPointAddress, chainId);
}