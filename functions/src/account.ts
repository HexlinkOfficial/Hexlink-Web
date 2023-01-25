import {getAuth} from "firebase-admin/auth";
import {ethers} from "ethers";
import {hexlContract, nameHash} from "../common";

import * as functions from "firebase-functions";

const ALCHEMY_KEYS : {[key: string]: string} = {
  "5": "U4LBbkMIAKCf4GpjXn7nB7H1_P9GiU4b",
  "80001": "Fj__UEjuIj0Xym6ofwZfJbehuuXGpDxe",
};

const secrets = functions.config().doppler || {};

const TWITTER_PROVIDER_ID = "twitter.com";

export async function genNameHash(uid: string) : Promise<
    {code: number, message?: string, nameHash?: string}
> {
  const user = await getAuth().getUser(uid);
  if (!user) {
    return {code: 400, message: "Invalid uid: failed to get the user."};
  }

  const userInfoList = user.providerData;
  for (const userInfo of userInfoList) {
    if (userInfo.providerId.toLowerCase() === TWITTER_PROVIDER_ID) {
      return {
        code: 200,
        nameHash: nameHash(TWITTER_PROVIDER_ID, userInfo.uid),
      };
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
    chainId: string
) : ethers.providers.Provider => {
  return new ethers.providers.InfuraProvider(
      Number(chainId),
      secrets.VITE_INFURA_API_KEY,
  );
};

export const accountAddress = async function(
    chainId: string,
    uid: string
) : Promise<{code: number, message?: string, address?: string}> {
  const result = await genNameHash(uid);
  if (result.nameHash == undefined) {
    return result;
  }
  const hexlink = await hexlContract(getInfuraProvider(chainId));
  try {
    const address = await hexlink.addressOfName(result.nameHash);
    return {code: 200, address};
  } catch (e : unknown) {
    const data = {uid, nameHash: result.nameHash, chainId};
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
