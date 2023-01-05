import type { Network } from '@ethersproject/networks';
import type { BigNumber } from "ethers";

export interface Connection {
    connected: boolean;
    network?: Network;
    address?: string;
    balance?: BigNumber;
    wallet?: string;
    walletIcon?: string;
}