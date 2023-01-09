import type { Network, AuthProof } from "@/types";
import { useWalletStore } from "@/stores/wallet";
import ACCOUNT_ABI from "@/configs/abi/AccountSimple.json";
import HEXLINK_ABI from "@/configs/abi/AccountSimple.json";
import { hexlink } from "@/services/web3/hexlink";
import { ethers } from "ethers";
import { getFunctions, httpsCallable } from 'firebase/functions'

const functions = getFunctions()

const genRequestId = async function(
    network: Network,
    func: string,
    data: string | [],
) {
    const hexlinkContract = hexlink(network);
    return ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["bytes4", "bytes", "address", "uint256", "uint256"],
        [
            func,
            data,
            hexlinkContract.address,
            network.chainId,
            await hexlinkContract.nonce()
        ]
      )
    );
};

export async function genDeployAuthProof(
    network: Network
) {
    const wallet = useWalletStore();
    if (!wallet.connected) {
        throw new Error("Not connected");
    }

    const accountIface = new ethers.utils.Interface(ACCOUNT_ABI);
    const data = accountIface.encodeFunctionData(
        "init", [wallet.wallet!.account.address]
    );
    const hexlinkIface = new ethers.utils.Interface(HEXLINK_ABI);
    const requestId = await genRequestId(
        network,
        hexlinkIface.getSighash("deploy"),
        data
    );
    const genAuthProof = httpsCallable(functions, 'genAuthProof')
    //return await genAuthProof(requestId);
}