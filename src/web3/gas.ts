import { ethers } from "ethers";
import type { BigNumber } from "ethers";
import { getProvider } from "@/web3/network";
import type { Token } from "@/types";
import { useTokenStore } from "@/stores/token";

export async function EstimateGas(gasAmount: BigNumber, token: Token, facter: number) {
  const feeData = await getProvider().getFeeData();
  const gasprice = feeData.gasPrice;

  if (token.address == useTokenStore().nativeCoin.address) {
    return ethers.utils.formatUnits(gasprice?.mul(gasAmount)!, 18);
  } else {
    return ethers.utils.formatUnits(gasprice?.mul(gasAmount).div(facter)!, 18);
  }
}