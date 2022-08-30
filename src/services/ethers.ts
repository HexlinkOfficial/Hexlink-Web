import * as ethers from "ethers";
import type { Provider } from "@ethersproject/providers"
import { getFunctions, httpsCallable } from 'firebase/functions'

const functions = getFunctions();

let provider: Provider | null = null;

export interface IMetadata {
    admin: {
        address: string,
        abi: any,
    },
    walletImpl: {
        address: string,
        abi: any,
    },
    token: {
        address: string,
        abi: any,
    },
    wallet: string,
}

export interface IToken {
    symbol: string;
    address: string;
    decimals: number;
    name?: string;
}

export interface Token extends IToken {
    balance: number;
}

export function getProvider() {
    if (!provider) {
        provider = new ethers.providers.AlchemyProvider(
            import.meta.env.VITE_HARDHAT_NETWORK,
            import.meta.env.VITE_GOERLI_ALCHEMY_KEY
        );
    }
    return provider;
}

export async function getBalance(metadata: IMetadata) : Promise<number> {
    const balance = await getProvider().getBalance(metadata.wallet);
    return normalizeBalance(balance, 18);
}

export async function getYawMetadata() : Promise<IMetadata> {
    const getMetadata = httpsCallable(functions, 'metadata')
    const result = await getMetadata();
    return result.data as IMetadata;
}

export async function isContract(address: string): Promise<boolean> {
    if (!ethers.utils.isAddress(address)) {
        return false;
    }
    try {
        const code = await getProvider().getCode(address);
        if (code !== '0x') return true;
    } catch (error) { }
    return false;
}

export async function getERC20Metadata(address: string, ERC20: any) : Promise<IToken> {
    const erc20 = new ethers.Contract(address, ERC20.abi, getProvider());
    return {
        address,
        symbol: await erc20.symbol(),
        decimals: await erc20.decimals(),
    }
}

export async function getERC20Balance(address: string, wallet: string, ERC20: any) : Promise<ethers.BigNumber> {
    const erc20 = new ethers.Contract(address, ERC20.abi, getProvider());
    return await erc20.balanceOf(wallet);
}

export async function getERC20Balances(tokens: IToken[], wallet: string, ERC20: any) : Promise<Token[]> {
    let result: Token[] = [];
    const provider = getProvider();
    for (let token of tokens) {
        const erc20 = new ethers.Contract(token.address, ERC20.abi, provider);
        const balance = await erc20.balanceOf(wallet);
        const normalized = normalizeBalance(balance, token.decimals);
        result.push({...token, balance: normalized});
    }
    return result;
}

export function normalizeBalance(balance: ethers.BigNumber, decimals: number) {
    const factor = ethers.BigNumber.from(10).pow(decimals);
    return Math.round(balance.div(factor).toNumber() * 100) / 100;
}