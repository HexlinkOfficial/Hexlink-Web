import {getAuth} from "firebase-admin/auth";
import {ethers} from "ethers";
import {hexlContract, nameHash} from "../common";
import type {Chain} from "../common";

import * as functions from "firebase-functions";

const ALCHEMY_KEYS : {[key: string]: string} = {
  "5": "U4LBbkMIAKCf4GpjXn7nB7H1_P9GiU4b",
  "80001": "Fj__UEjuIj0Xym6ofwZfJbehuuXGpDxe",
};

const secrets = functions.config().doppler || {};

const TWITTER_PROVIDER_ID = "twitter.com";

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

export async function genNameHash(
    uid: string,
    version?: number
) : Promise<GenNameHashSuccess | Error> {
  const user = await getAuth().getUser(uid);
  if (!user) {
    return {code: 400, message: "Invalid uid: failed to get the user."};
  }

  const userInfoList = user.providerData;
  for (const userInfo of userInfoList) {
    if (userInfo.providerId.toLowerCase() === TWITTER_PROVIDER_ID) {
      let name = nameHash(TWITTER_PROVIDER_ID, userInfo.uid);
      if (process.env.FUNCTIONS_EMULATOR && version) {
        name = ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes(name + "@" + version)
        );
      }
      return {code: 200, nameHash: name};
    }
  }

  return {code: 400, message: "Invalid uid: not provided with twitter"};
}

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
