import {getAuth} from "firebase-admin/auth";
import * as functions from "firebase-functions";
import * as ethers from "ethers";
import * as HEXLINK from "./data/HEXLINK.json";
import * as ERC20 from "./data/ERC20.json";
import * as ERC721Abi from "./data/ERC721.json";
import BigNumber from "bignumber.js";

const secrets = functions.config().doppler || {};

import sgMail = require("@sendgrid/mail");
sgMail.setApiKey(secrets.SENDGRID_API_KEY);

const getProvider = function() {
  return new ethers.providers.AlchemyProvider(
      secrets.VITE_HARDHAT_NETWORK,
      secrets.VITE_GOERLI_ALCHEMY_KEY
  );
};

const getSigner = function() {
  return new ethers.Wallet(
      secrets.HARDHAT_ACCOUNT_PRIVATE_KEY || "",
      getProvider()
  );
};

const adminContract = function() {
  return new ethers.Contract(
      HEXLINK.adminAddr,
      HEXLINK.adminAbi,
      getSigner()
  );
};

const walletContract = function(contractAddress: string) {
  const signer = getSigner();
  return new ethers.Contract(
      contractAddress,
      HEXLINK.walletImplAbi,
      signer
  );
};

const genSalt = function(email: string) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(`mailto:${email}`));
};

const walletImplAddress = function() {
  return ethers.utils.getCreate2Address(
      HEXLINK.adminAddr,
      ethers.constants.HashZero,
      ethers.utils.keccak256(HEXLINK.walletImplBytecode)
  );
};

const walletAddress = async function(email: string) {
  const contract = new ethers.Contract(
      HEXLINK.adminAddr,
      HEXLINK.adminAbi,
      getSigner()
  );
  return await contract.predictWalletAddress(
      walletImplAddress(),
      genSalt(email)
  );
};

const genAddressIfNecessary = async (receiver: string) => {
  if (ethers.utils.isAddress(receiver)) {
    return receiver;
  } else {
    return await walletAddress(receiver);
  }
};

const genERC20SendTxData = (to: string, amount: ethers.BigNumber) => {
  const iface = new ethers.utils.Interface(ERC20.abi);
  return iface.encodeFunctionData("transfer", [to, amount]);
};

const genERC721SendTxData = (from: string, to: string, tokenId: ethers.BigNumber) => {
  const iface = new ethers.utils.Interface(ERC721Abi);
  return iface.encodeFunctionData("transferFrom", [from, to, tokenId]);
};

const notify = async (dest: string, content: string) => {
  const msg = {
    to: dest,
    from: "info@hexlink.io",
    subject: "[Hexlink] You just received some tokens",
    text: content,
    html: `<p style="font-size: 16px;">${content}</p>`,
  };
  await sgMail.send(msg);
};

const validateUser = async function(uid: string | undefined) {
  if (!uid) {
    return {code: 401, message: "Unauthorized"};
  }
  const user = await getAuth().getUser(uid);
  if (user.email) {
    return {success: true, email: user.email, user: user};
  } else {
    return {code: 400, message: "Email not set"};
  }
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
      balance: 0,
    };
  } else {
    return {code: 400, message: "Email not set"};
  }
});

export const deployWallet = functions.https.onCall(async (_data, context) => {
  const result = await validateUser(context.auth?.uid);
  if (!result.success) {
    return {code: result.code, message: result.message};
  }
  const {email} = result;
  const yawAdmin = adminContract();
  const tx = await yawAdmin.clone(walletImplAddress(), genSalt(email));
  const receipt = await tx.wait();
  return {code: 200, txHash: tx.hash, receiptHash: receipt.hash};
});

export const sendETH = functions.https.onCall(async (data, context) => {
  const result = await validateUser(context.auth?.uid);
  if (!result.success) {
    return {code: result.code, message: result.message};
  }
  const {email, user} = result;
  const yawWallet = walletContract(await walletAddress(email));
  const receiver = await genAddressIfNecessary(data.receiver);
  const tx = await yawWallet.execute(
      receiver,
      ethers.BigNumber.from(data.amount),
      50000,
      [],
  );
  if (!ethers.utils.isAddress(data.receiver)) {
    const ethAmount = ethers.utils.formatEther(data.amount);
    await notify(
        data.receiver,
        `${user.displayName} just sent you ${ethAmount} ETH.`
    );
  }
  return {code: 200, txHash: tx.hash};
});

export const sendERC20 = functions.https.onCall(async (data, context) => {
  const result = await validateUser(context.auth?.uid);
  if (!result.success) {
    return {code: result.code, message: result.message};
  }
  const {email, user} = result;
  const yawWallet = walletContract(await walletAddress(email));
  const receiver = await genAddressIfNecessary(data.receiver);
  const tx = await yawWallet.execute(
      data.token.address,
      0, // value
      65000, // gas
      genERC20SendTxData(receiver, ethers.BigNumber.from(data.amount)),
  );
  if (!ethers.utils.isAddress(data.receiver)) {
    const normalizedAmount = new BigNumber(data.amount).div(
        new BigNumber(10).pow(data.token.metadata.decimals)
    );
    await notify(
        data.receiver,
        // eslint-disable-next-line max-len
        `${user.displayName} just sent you ${normalizedAmount} ${data.token.metadata.symbol}.`
    );
  }
  return {code: 200, txHash: tx.hash};
});

export const sendERC721 = functions.https.onCall(async (data, context) => {
  const result = await validateUser(context.auth?.uid);
  if (!result.success) {
    return {code: result.code, message: result.message};
  }
  const {email, user} = result;
  const yawWallet = walletContract(await walletAddress(email));
  const receiver = await genAddressIfNecessary(data.receiver);
  const tx = await yawWallet.execute(
      data.collection_address,
      0, // value
      65000, // gas
      genERC721SendTxData(data.sender, receiver, ethers.BigNumber.from(data.tokenId)),
  );
  if (!ethers.utils.isAddress(data.receiver)) {
    await notify(
        data.receiver,
        // eslint-disable-next-line max-len
        `${user.displayName} just sent you a new collectible.`
    );
  }
  return {code: 200, txHash: tx.hash};
});

export const executeTx = functions.https.onCall(async (data, context) => {
  const result = await validateUser(context.auth?.uid);
  if (!result.success) {
    return {code: result.code, message: result.message};
  }
  const {email} = result;
  const yawWallet = walletContract(await walletAddress(email));
  const tx = await yawWallet.execute(
      data.contractAddress,
      data.amount,
      data.txGas,
      data.txData,
  );
  return {code: 200, txHash: tx.hash};
});

export const estimateERC20Transfer = functions.https.onCall(
    async (data, context) => {
      const result = await validateUser(context.auth?.uid);
      if (!result.success) {
        return {code: result.code, message: result.message};
      }
      const {email} = result;

      const provider = getProvider();
      const feeData = await provider.getFeeData();

      const yawWallet = walletContract(await walletAddress(email));
      const receiver = await genAddressIfNecessary(data.receiver);
      const gasCost = await yawWallet.estimateGas.execute(
          data.tokenAddress,
          0, // value
          65000, // gas
          genERC20SendTxData(receiver, ethers.BigNumber.from(data.amount)),
      );
      const baseFeePerGas = feeData.maxFeePerGas?.sub(
          feeData.maxPriorityFeePerGas || 0
      ) || 0;
      return {
        baseCost: gasCost.mul(baseFeePerGas || 0),
        maxCost: gasCost.mul(feeData.maxFeePerGas || 0),
      };
    }
);

export const estimateETHTransfer = functions.https.onCall(
    async (_data, context) => {
      const result = await validateUser(context.auth?.uid);
      if (!result.success) {
        return {code: result.code, message: result.message};
      }
      const provider = getProvider();
      const feeData = await provider.getFeeData();
      const baseFeePerGas = feeData.maxFeePerGas?.sub(
          feeData.maxPriorityFeePerGas || 0
      ) || 0;
      const gasCost = ethers.BigNumber.from(23000);
      return {
        baseCost: gasCost.mul(baseFeePerGas || 0),
        maxCost: gasCost.mul(feeData.maxFeePerGas || 0),
      };
    }
);
