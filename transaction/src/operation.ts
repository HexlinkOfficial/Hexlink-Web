import {
  ethers,
  BigNumber as EthBigNumber,
  PopulatedTransaction,
} from "ethers";
import {resolveProperties} from "@ethersproject/properties";
import {serialize, UnsignedTransaction} from "@ethersproject/transactions";
import {insertRedPacketClaim, insertRedPacket} from "./graphql/redpacket";

import type {Chain, OpInput} from "../../functions/common";
import {hexlContract, PriceConfigs, parseDeposit} from "../../functions/common";
import {parseClaimed, parseCreated} from "../../functions/redpacket";
import type {Action, Operation} from "./types";

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
    EthBigNumber.from(PriceConfigs[chainId.toString()].gasPrice);
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
    ethers.utils.keccak256(serialize(tx as UnsignedTransaction))
  );
  return serialize(tx as UnsignedTransaction, signature);
}

async function processAction(
  op: Operation,
  chain: Chain,
  action: Action,
  receipt: ethers.providers.TransactionReceipt
) {
  const params = action.params;
  if (action.type === "insert_redpacket_claim") {
    const claimed = parseClaimed(
      chain,
      receipt,
      params.redPacketId,
      op.account,
    );
    await insertRedPacketClaim({
      ...params,
      claimed,
      opId: op.id,
    });
  }

  if (action.type == "insert_redpacket") {
    const deposit = parseDeposit(
      receipt,
      params.redPacketId,
      op.account,
      params.refunder,
    );
    const created = parseCreated(
      chain,
      receipt,
      params.redPacketId,
    );
    console.log(created.packet);
    await insertRedPacket(
      params.userId,
      [{
        id: params.redPacketId,
        creator: params.creator,
        userId: op.userId,
        metadata: created.packet,
        opId: op.id,
        deposit: {
          receipt: deposit?.receipt,
          token: deposit?.token,
          amount: deposit?.amount.toString(),
        }
      }]
    );
  }
}

export async function processActions(
  chain: Chain,
  op: Operation,
  receipt: ethers.providers.TransactionReceipt
) {
  await Promise.all(
    op.actions.map(
      action => processAction(op, chain, action, receipt)
    )
  );
}