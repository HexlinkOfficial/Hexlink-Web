import type { Network } from "@/types";
import { getProvider } from "@/web3/network";
import HEXLINK_ABI from "@/configs/abi/Hexlink.json";
import { ethers } from "ethers";
import { useNetworkStore } from "@/stores/network";

export function hexlinkAddress(network?: Network) : string {
    network = network || useNetworkStore().network;
    return network.addresses.hexlink as string;
}

export function refunder(network?: Network) : string {
    network = network || useNetworkStore().network;
    return network.addresses.refunder as string;
}

export function hexlinkContract(network?: Network) {
    return new ethers.Contract(
        hexlinkAddress(network),
        HEXLINK_ABI,
        getProvider(network)
    );
}