/* eslint-disable require-jsdoc */
import * as functions from "firebase-functions";
import {insertRedPacketClaim, getRedPacket} from "./graphql/redpacket";
import {signWithKmsKey} from "./kms";
import {ethers, BigNumber as EthBigNumber, Signer} from "ethers";
import RED_PACKET_ABI from "./abi/HappyRedPacket.json";
import {provider, accountAddress} from "./account";

const secrets = functions.config().doppler || {};

const RED_PACKET_CONTRACT : {[key: string]: string} = {
  "5": "0x36e21785316978491f6a0CF420af3d37848cE2dF",
  "137": "0xAAf0Bc5Ef7634b78F2d4f176a1f34493802e9d5C",
};

const redPacketContract = (chainId: string, signer: Signer) => {
  return new ethers.Contract(
      RED_PACKET_CONTRACT[chainId],
      RED_PACKET_ABI,
      signer
  );
};

async function sendClaimTx(
    redPacket: {metadata: string},
    data: {chainId: string, claimer: string, creator?: string},
    signature: string,
) : Promise<string> {
  const parsed = JSON.parse(redPacket.metadata);
  const creator = parsed.creator || data.creator;

  const signer = new ethers.Wallet(
      secrets.HARDHAT_DEPLOYER,
      provider(data.chainId)
  );
  const tx = await redPacketContract(data.chainId, signer).claim(
      creator, {
        token: parsed.token,
        salt: parsed.salt,
        balance: EthBigNumber.from(parsed.balance),
        validator: parsed.validator,
        split: parsed.split,
        mode: parsed.mode,
      }, data.claimer, signature
  );
  return tx.hash;
}

export const claimRedPacket = functions.https.onCall(
    async (data, context) => {
      const uid = context.auth?.uid;
      if (!uid) {
        return {code: 401, message: "Unauthorized"};
      }
      data.claimer = await accountAddress(data.chainId, uid);
      const redPacket = await getRedPacket(data.redPacketId);
      const message = ethers.utils.keccak256(
          ethers.utils.defaultAbiCoder.encode(
              ["bytes32", "address"],
              [redPacket.id, data.claimer]
          )
      );
      const signature = await signWithKmsKey("validator", message);
      if (data.signOnly) {
        await insertRedPacketClaim(uid, [{
          redPacketId: redPacket.id,
          creatorId: redPacket.user_id,
        }]);
        return {code: 200, data: {signature}};
      } else {
        const tx = await sendClaimTx(
            redPacket,
            data,
            signature
        );
        await insertRedPacketClaim(uid, [{
          redPacketId: redPacket.id,
          creatorId: redPacket.user_id,
          tx: "",
        }]);
        return {code: 200, data: {tx}};
      }
    }
);
