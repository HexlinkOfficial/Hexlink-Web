import {getAuth} from "firebase-admin/auth";
import * as functions from "firebase-functions";
import * as ethers from "ethers";
import * as YawAdmin from "./YawAdmin.json";
import * as YawWallet from "./YawWallet.json";
import * as YawToken from "./YawToken.json";

const adminContract = function() {
  const provider = new ethers.providers.JsonRpcProvider(
      process.env.HARDHAT_GOERLI_RPC_URL
  );
  const signer = new ethers.Wallet(
      process.env.HARDHAT_ACCOUNT_PRIVATE_KEY || "",
      provider
  );
  return new ethers.Contract(YawAdmin.address, YawAdmin.abi, signer);
};

const walletContract = function(contractAddress: string) {
  const provider = new ethers.providers.JsonRpcProvider(
      process.env.HARDHAT_GOERLI_RPC_URL
  );
  const signer = new ethers.Wallet(
      process.env.HARDHAT_ACCOUNT_PRIVATE_KEY || "",
      provider
  );
  return new ethers.Contract(contractAddress, YawWallet.abi, signer);
};

const genSalt = function(email: string) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(`mailto:${email}`));
};

const walletAddress = function(email: string | null = null) {
  const salt = email ? genSalt(email) : ethers.constants.HashZero;
  return ethers.utils.getCreate2Address(
      YawAdmin.address,
      salt,
      ethers.utils.keccak256(YawWallet.bytecode)
  );
};

export const metadata = functions.https.onCall(async (_data, context) => {
  const uid = context.auth?.uid;
  if (!uid) {
    return {code: 401, message: "Unauthorized"};
  }

  const user = await getAuth().getUser(uid);
  if (user.email) {
    return {
      code: 200,
      admin: YawAdmin.address,
      walletImpl: walletAddress(),
      token: YawToken.address,
      wallet: walletAddress(user.email),
      abi: {
        admin: YawAdmin.abi,
        wallet: YawWallet.abi,
        token: YawToken.abi,
      },
    };
  } else {
    return {code: 400, message: "Email not set"};
  }
});

export const deployWallet = functions.https.onCall(async (_data, context) => {
  const uid = context.auth?.uid;
  if (!uid) {
    return {code: 401, message: "Unauthorized"};
  }

  const user = await getAuth().getUser(uid);
  if (user.email) {
    const yawAdmin = adminContract();
    const tx = await yawAdmin.clone(walletAddress(), genSalt(user.email));
    return {code: 200, txHash: tx.hash};
  } else {
    return {code: 400, message: "Email not set"};
  }
});

export const executeTransaction = functions.https.onCall(
    async (data, context) => {
      const uid = context.auth?.uid;
      if (!uid) {
        return {code: 401, message: "Unauthorized"};
      }
      const user = await getAuth().getUser(uid);
      if (user.email) {
        const address = await walletAddress(user.email);
        const yawWallet = walletContract(address);
        const tx = await yawWallet.execute(
            data.destination,
            data.value,
            data.txGas,
            data.txData,
        );
        return {code: 200, txHash: tx.hash, wallet: address};
      } else {
        return {code: 400, message: "Email not set"};
      }
    }
);

