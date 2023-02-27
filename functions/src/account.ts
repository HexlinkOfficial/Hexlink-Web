import {getAuth} from "firebase-admin/auth";
import {ethers} from "ethers";
import {hexlContract, nameHash} from "../common";
import type {Chain} from "../common";
import {getUserById} from "./graphql/user";
import * as functions from "firebase-functions";
import {getUserById as getTwitterUserById} from "./twitter/twitter";

const ALCHEMY_KEYS : {[key: string]: string} = {
  "5": "U4LBbkMIAKCf4GpjXn7nB7H1_P9GiU4b",
  "80001": "Fj__UEjuIj0Xym6ofwZfJbehuuXGpDxe",
};

const secrets = functions.config().doppler || {};

const TWITTER_PROVIDER_ID = "twitter.com";
const EMAIL_PROVIDER_ID = "mailto";

export const TWITTER_IDENTITY_TYPE = "twitter.com";
export const EMAIL_IDENTITY_TYPE = "email";

export interface GenNameHashSuccess {
  code: 200;
  nameHash: string;
}

export interface GenAddressSuccess extends GenNameHashSuccess {
  address: string;
}

export interface Error {
  code: number;
  message: string;
}

async function getTwitterHandle(uid: string) : Promise<string> {
  const user = await getTwitterUserById(uid);
  return user.username;
}

export async function genNameHash(
    uid: string,
    version?: number,
    identity?: string,
) : Promise<GenNameHashSuccess | Error> {
  const user = await getAuth().getUser(uid);
  if (!user) {
    return {code: 400, message: "Invalid uid: failed to get the user."};
  }

  // custom token will not have provider data stored with it
  const userInfoList = user.providerData;
  if (!userInfoList || userInfoList.length < 1) {
    if (identity && identity !== EMAIL_IDENTITY_TYPE) {
      return {code: 400, message: "identity type not match"};
    }
    const user = await getUserById(uid);
    if (!user || !user.email) {
      return {code: 400, message: "Invalid uid: no provider data nor valid record in user table."};
    }

    const name = calcNameHash(EMAIL_PROVIDER_ID, user.email, version);
    return {code: 200, nameHash: name};
  }

  for (const userInfo of (userInfoList || [])) {
    if (userInfo.providerId.toLowerCase() === TWITTER_PROVIDER_ID) {
      if (identity && identity !== TWITTER_IDENTITY_TYPE) {
        return {code: 400, message: "identity type not match"};
      }
      const handle = await getTwitterHandle(userInfo.uid);
      const name = calcNameHash(TWITTER_PROVIDER_ID, handle, version);
      return {code: 200, nameHash: name};
    }
  }

  return {code: 400, message: "Invalid uid: not provided with valid provider"};
}

const calcNameHash = (providerId: string, id: string, version?: number) => {
  let name = nameHash(providerId, id);
  if (process.env.FUNCTIONS_EMULATOR && version) {
    name = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(name + "@" + version)
    );
  }

  return name;
};

export const getAlchemyProvider = (
    chainId: string
) : ethers.providers.Provider => {
  return new ethers.providers.AlchemyProvider(
      Number(chainId), ALCHEMY_KEYS[chainId]
  );
};

export const getInfuraProvider = (
    chain: Chain
) : ethers.providers.Provider => {
  return new ethers.providers.InfuraProvider(
      Number(chain.chainId!),
      secrets.VITE_INFURA_API_KEY,
  );
};

export const accountAddress = async function(
    chain: Chain,
    uid: string,
    version?: number,
) : Promise<GenAddressSuccess | Error> {
  const result = await genNameHash(uid, version);
  if ((result as GenAddressSuccess).nameHash == undefined) {
    return result as Error;
  }
  const {nameHash} = result as GenAddressSuccess;
  const hexlink = await hexlContract(getInfuraProvider(chain));
  try {
    const address = await hexlink.addressOfName(nameHash);
    return {code: 200, address, nameHash};
  } catch (e : unknown) {
    const data = {uid, nameHash, chain: chain.name};
    console.log("Failed to get address of name for " + JSON.stringify(data));
    console.log("Error is " + JSON.stringify(e));
    return {code: 500, message: "Internal Error"};
  }
};

export const toEthSignedMessageHash = function(messageHex: string) {
  return ethers.utils.keccak256(
      ethers.utils.solidityPack(["string", "bytes32"],
          ["\x19Ethereum Signed Message:\n32", messageHex]));
};
