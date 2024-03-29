"use strict";

import {ethers, BigNumber as EthBigNumber} from "ethers";
import type {Provider} from "@ethersproject/providers";
import {BigNumber} from "bignumber.js";
import totp from "totp-generator";

export function hash(value: string) {
  return ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(value)
  );
}

export function prettyPrintAddress(
    address: string,
    start: number,
    stop: number
) {
  const len = address.length;
  return address.substring(0, start) +
        "..." + address.substring(len - stop, len);
}

export function prettyPrintTxHash(txHash: string) {
  if (txHash) {
    const len = txHash.length;
    return txHash.substring(0, 6) + "..." + txHash.substring(len - 6, len);
  }
  return "N/A";
}

export function prettyPrintTimestamp(ts: string) {
  const now = new Date().valueOf();
  const epoch = new Date(ts).valueOf();
  const diff = now - epoch;
  if (diff < 60) {
    return now - epoch + " seconds ago";
  } else if (diff < 3600) {
    return Math.floor(diff/60) + " minutes ago";
  } else if (diff < 3600 * 24) {
    return Math.floor(diff/3600) + " hours ago";
  } else {
    return new Date(ts).toLocaleString();
  }
}

export function truncateAddress(address: string) {
  const match = address.match(
      /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
}

export function toHex(num: any) {
  const val = Number(num);
  return "0x" + val.toString(16);
}

export interface NormalizedTokenBalance {
    value: string;
    normalized: string;
    updatedAt?: Date;
}

export function normalizeBalance(
    balance: string,
    decimals: number
) : NormalizedTokenBalance {
  const normalized = new BigNumber(balance).div(
      new BigNumber(10).pow(decimals)
  );
  if (normalized.gt(1)) {
    return {
      value: balance,
      normalized: normalized.dp(4).toString(10),
      updatedAt: new Date(),
    };
  } else {
    return {
      value: balance,
      normalized: normalized.dp(5).toString(10),
      updatedAt: new Date(),
    };
  }
}

export async function isContract(
    provider: Provider,
    address: string
): Promise<boolean> {
  try {
    const code = await provider.getCode(address);
    if (code !== "0x") return true;
  // eslint-disable-next-line no-empty
  } catch (error) { }
  return false;
}

export function toEthBigNumber(value: BigNumber | string | number) : EthBigNumber {
  if (value instanceof BigNumber) {
    return EthBigNumber.from(value.toString(10));
  }
  return EthBigNumber.from(value);
}

export function genTotpCode(secret: string, timestamp?: number) : string {
    return totp(secret, {period: 60, timestamp});
}

export function matchTotpCode(secret: string, code: string) : boolean {
  return code === genTotpCode(secret) ||
    code === genTotpCode(secret, new Date().getTime() - 60000);
}