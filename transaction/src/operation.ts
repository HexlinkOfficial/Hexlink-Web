import {
  ethers,
  BigNumber as EthBigNumber,
  PopulatedTransaction,
} from "ethers";
import {resolveProperties} from "@ethersproject/properties";
import {serialize, UnsignedTransaction} from "@ethersproject/transactions";
import {insertRedPacketClaim, insertRedPacket} from "./graphql/redpacket";

import type {Chain} from "../../functions/common";
import {hexlContract, parseDeposit, PriceConfigs} from "../../functions/common";
import {parseClaimed, parseCreated, redPacketAddress} from "../../functions/redpacket";
import type {Action, Operation} from "./types";

async function buildTx(
  provider: ethers.providers.Provider,
  chain: Chain,
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
    EthBigNumber.from(PriceConfigs[chain.name]);
  return unsignedTx;
}

export async function buildTxFromOps(
  provider: ethers.providers.Provider,
  chain: Chain,
  ops: Operation[],
  signer: ethers.Wallet,
) : Promise<string> {
  const contract = await hexlContract(provider);
  let unsignedTx = await contract.populateTransaction.process(
    ops.map(op => op.input)
  );
  unsignedTx = await buildTx(provider, chain, unsignedTx, signer.address);
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
    if (claimed !== undefined) {
      await insertRedPacketClaim({
        ...params,
        claimed,
        opId: op.id,
      });
    }
  }

  if (action.type === "insert_redpacket") {
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

    if (created !== undefined) {
      await insertRedPacket(
        params.userId,
        [{
          id: params.redPacketId,
          creator: params.creator,
          userId: op.userId,
          metadata: {
            token: created.packet.token,
            balance: created.packet.balance.toString(),
            split: created.packet.split,
            salt: created.packet.salt,
            validator: created.packet.validator,
            mode: created.packet.mode,
            creator: created.creator,
            contract: redPacketAddress(chain),
          },
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