import { ethers } from "ethers";
import type { BigNumber } from "ethers";
import { getProvider } from "@/web3/network";
import type { Token } from "@/types";
import { useNetworkStore } from "@/stores/network";

export async function EstimateGas(gasAmount: BigNumber, token: Token, facter: number) {
  const feeData = await getProvider().getFeeData();
  const gasprice = feeData.gasPrice;
  const lastBaseFeePerGas = feeData.lastBaseFeePerGas;
  const maxFeePerGas = feeData.maxFeePerGas;
  const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;

  if (token.metadata.address == useNetworkStore().nativeCoinAddress) {
    return ethers.utils.formatUnits(gasprice?.mul(gasAmount)!, 18);
  } else {
    return ethers.utils.formatUnits(gasprice?.mul(gasAmount).div(facter)!, 18);
  }
}