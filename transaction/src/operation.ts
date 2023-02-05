import {ethers, BigNumber as EthBigNumber, PopulatedTransaction } from "ethers";
import {insertRedPacketClaim, insertRedPacket} from "./graphql/redpacket";
import type {Chain} from "../../functions/common";
import {PriceConfigs, parseDeposit} from "../../functions/common";
import {parseClaimed, parseCreated, redPacketAddress} from "../../functions/redpacket";
import type {Action, Operation} from "./types";

export async function buildTx(
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
  const feeData = await provider.getFeeData();
  unsignedTx.maxPriorityFeePerGas =
    feeData.maxPriorityFeePerGas || EthBigNumber.from(0);
  unsignedTx.maxFeePerGas = feeData.maxFeePerGas ||
    EthBigNumber.from(PriceConfigs[chain.name]);
  return unsignedTx;
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
      await insertRedPacketClaim([{
        ...params,
        claimed,
        opId: op.id,
      }]);
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
            priceInfo: params.priceInfo,
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