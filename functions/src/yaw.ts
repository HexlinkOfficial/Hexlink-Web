import {getAuth} from "firebase-admin/auth";
import * as functions from "firebase-functions";
import * as ethers from "ethers";
import * as YawAdmin from "./YawAdmin.json";
import * as YawWallet from "./YawWallet.json";
import * as YawToken from "./YawToken.json";
import * as ERC20 from "./ERC20.json";
import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: import.meta.env.SENDER_EMAIL,
    pass: import.meta.env.SENDER_EMAIL_PASSWORD,
  },
});

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
      balance: 0,
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

const genAddressIfNecessary = (receiver: string) => {
  if (ethers.utils.getAddress(receiver)) {
    return receiver;
  } else {
    return walletAddress(receiver);
  }
};

const genERC20SendTxData = (to: string, amount: ethers.BigNumber) => {
  const iface = new ethers.utils.Interface(ERC20.abi);
  return iface.encodeFunctionData("transfer", [to, amount]);
};

const normalizeAmountToSend = (amount: number, decimals: number) => {
  const factor = ethers.BigNumber.from(10).pow(decimals);
  return factor.mul(amount);
};

const notify = async (dest: string, subject: string, content: string) => {
  const mailOptions = {
    from: `Yaw <${import.meta.env.SENDER_EMAIL}>`,
    to: dest,
    subject, // email subject
    html: `<p style="font-size: 16px;">${content}</p>`,
  };
  await transporter.sendMail(mailOptions);
};

export const sendETH = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) {
    return {code: 401, message: "Unauthorized"};
  }
  const user = await getAuth().getUser(uid);
  if (user.email) {
    const yawWallet = walletContract(walletAddress(user.email));
    const receiver = genAddressIfNecessary(data.receiver);
    const amount = normalizeAmountToSend(data.amount, data.token.decimals);
    const tx = await yawWallet.execute(
        receiver,
        amount,
        50000,
        "",
    );
    if (!ethers.utils.getAddress(receiver)) {
      await notify(
          receiver,
          "Token Received",
          `${user.displayName} just sent you ${data.amount} ETH.`
      );
    }
    return {code: 200, txHash: tx.hash};
  } else {
    return {code: 400, message: "Email not set"};
  }
});

export const sendERC20 = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) {
    return {code: 401, message: "Unauthorized"};
  }
  const user = await getAuth().getUser(uid);
  if (user.email) {
    const yawWallet = walletContract(walletAddress(user.email));
    const receiver = genAddressIfNecessary(data.receiver);
    const amount = normalizeAmountToSend(data.amount, data.token.decimals);
    const tx = await yawWallet.execute(
        data.token.contract,
        0, // value
        65000, // gas
        genERC20SendTxData(receiver, amount),
    );
    if (!ethers.utils.getAddress(receiver)) {
      await notify(
          receiver,
          "Token Received",
          // eslint-disable-next-line max-len
          `${user.displayName} just sent you ${data.amount} ${data.token.symbol}.`
      );
    }
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
        const yawWallet = walletContract(walletAddress(user.email));
        const tx = await yawWallet.execute(
            data.contract,
            data.amount,
            data.txGas,
            data.txData,
        );
        return {code: 200, txHash: tx.hash};
      } else {
        return {code: 400, message: "Email not set"};
      }
    }
);

