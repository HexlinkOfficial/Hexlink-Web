import {
  ethers,
  BigNumber as EthBigNumber,
  PopulatedTransaction,
} from "ethers";
import {resolveProperties} from "@ethersproject/properties";
import {serialize, UnsignedTransaction} from "@ethersproject/transactions";
import {updateRedPacketClaim} from "./graphql/redpacket";

import type {OpInput} from "../../functions/common";
import {hexlContract, PriceConfig, getChain} from "../../functions/common";
import {parseClaimed} from "../../functions/redpacket";
import type {Action} from "./types";

async function buildTx(
  provider: ethers.providers.Provider,
  unsignedTx: PopulatedTransaction,
  from: string
) : Promise<ethers.PopulatedTransaction> {
  const {chainId} = await provider.getNetwork();
  unsignedTx.chainId = chainId;
  unsignedTx.from = from;
  unsignedTx.type = 2;
  unsignedTx.nonce = await provider.getTransactionCount(unsignedTx.from);
  unsignedTx.gasLimit = EthBigNumber.from(500000);
  const feeData = await provider.getFeeData();
  unsignedTx.maxPriorityFeePerGas =
    feeData.maxPriorityFeePerGas || EthBigNumber.from(0);
  unsignedTx.maxFeePerGas = feeData.maxFeePerGas || 
    EthBigNumber.from(PriceConfig[chainId.toString()].gasPrice);
  return unsignedTx;
}

export async function buildTxFromOps(
  provider: ethers.providers.Provider,
  ops: OpInput[],
  signer: ethers.Wallet,
) : Promise<string> {
  const contract = await hexlContract(provider);
  let unsignedTx = await contract.populateTransaction.process(ops);
  unsignedTx = await buildTx(provider, unsignedTx, signer.address);
  const tx = await resolveProperties(unsignedTx);
  const signature = signer._signingKey().signDigest(
    ethers.utils.keccak256(serialize(<UnsignedTransaction>tx))
  );
  return serialize(<UnsignedTransaction>tx, signature);
}

async function processAction(
  action: Action,
  receipt: ethers.providers.TransactionReceipt
) {
  if (action.type == "claim_redpacket") {
    const params = action.params;
    const chain = getChain(params.chain);
    const claimed = parseClaimed(chain, receipt, params.packetId, params.claimer);
    await updateRedPacketClaim(params.id, claimed || EthBigNumber.from(0));
  }
}

export async function processActions(
  actions: Action[],
  receipt: ethers.providers.TransactionReceipt
) {
  await Promise.all(
    actions.map(action => processAction(action, receipt))
  );
}