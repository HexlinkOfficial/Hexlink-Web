import type { Network } from "@/types";
import { getProvider } from "@/web3/network";
import HEXLINK_ABI from "@/configs/abi/Hexlink.json";
import { ethers } from "ethers";

export function hexlinkAddress(network: Network) : string {
    return network.addresses.hexlink as string;
}

export function refund(network: Network) : string {
    return network.addresses.refund as string;
}

export function hexlinkContract(network: Network) {
    return new ethers.Contract(
        hexlinkAddress(network),
        HEXLINK_ABI,
        getProvider(network)
    );
}