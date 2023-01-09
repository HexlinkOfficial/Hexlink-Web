import type { Network } from "@/types";
import * as ethers from "ethers";
import HEXLINK_ABI from "@/configs/abi/Hexlink.json";
import HEXLINK_HELPER_ABI from "@/configs/abi/HexlinkHelper.json";
import CONTRACTS from "@/configs/contracts.json";
import { getProvider } from "@/services/web3/network";
import { useProfileStore } from "@/stores/profile";

export function hexlink(network: Network) {
    const address = (CONTRACTS as any)[network.name].hexlink;
    return new ethers.Contract(
        address,
        HEXLINK_ABI,
        getProvider(network)
    );
}

export function hexlinkHelper(network: Network) {
    const address = (CONTRACTS as any)[network.name].hexlinkHelper;
    return new ethers.Contract(
        address,
        HEXLINK_HELPER_ABI,
        getProvider(network)
    );
}

export function createRedPacket() {
    const account = useProfileStore().account!;
    if (account.isContract) {
        // contract already deployed
    } else {
        // contract not deployed yet, use HexlinkHelper

    }
}