/* eslint-disable require-jsdoc */
import {getAuth} from "firebase-admin/auth";
import {ethers} from "ethers";
import HEXLINK_ABI from "./abi/Hexlink.json";

const ALCHEMY_KEYS : {[key: string]: string} = {
  "5": "U4LBbkMIAKCf4GpjXn7nB7H1_P9GiU4b",
  "137": "Fj__UEjuIj0Xym6ofwZfJbehuuXGpDxe",
};

const HEXLINK_CONTRACT : {[key: string]: string} = {
  "5": "0xbad6a7948a1d3031ee7236d0180b6271fa569148",
  "137": "0x78317ef8b020Fe10e845ab8723403cF1e58Ef1Cc",
};

const hexlinkContract = (
    chainId: string,
    provider: ethers.providers.AlchemyProvider
) => {
  return new ethers.Contract(
      HEXLINK_CONTRACT[chainId],
      HEXLINK_ABI,
      provider
  );
};

const TWITTER_PROVIDER_ID = "twitter.com";

const nameHash = function(prefix: string, uid: string) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(`${prefix}:${uid}`));
};

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

export const getProvider = (chainId: string) => {
  return new ethers.providers.AlchemyProvider(
      Number(chainId), ALCHEMY_KEYS[chainId]
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
  const hexlink = hexlinkContract(chainId, getProvider(chainId));
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
