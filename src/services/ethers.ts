import * as ethers from "ethers";
import type { Provider } from "@ethersproject/providers"
import { getFunctions, httpsCallable } from 'firebase/functions'
import * as HEXLINK from "@/services/HEXLINK.json";

const functions = getFunctions();

const BALANCE_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
];

export interface IMetadata {
    admin: {
        address: string,
        abi: any,
    },
    walletImpl: {
        address: string,
        abi: any,
    },
    token: string,
    wallet: string,
    balance: number,
}

export interface IToken {
    symbol: string;
    contract?: string;
    decimals: number;
    name?: string;
    price?: number,
}

export interface Transaction {
    hash: string,
    from: string,
    to: string,
    amount: number,
    state: "Executing" | "Success" | "Error",
}

export interface Token extends IToken {
    balance: number;
}

export interface GasEstimation {
    baseCost: ethers.BigNumber,
    maxCost: ethers.BigNumber
}

let provider: Provider | null = null;
export function getProvider() {
    if (!provider) {
        provider = new ethers.providers.AlchemyProvider(
            import.meta.env.VITE_HARDHAT_NETWORK,
            import.meta.env.VITE_GOERLI_ALCHEMY_KEY
        );
    }
    return provider;
}

const walletImplAddress = function() {
    return ethers.utils.getCreate2Address(
        HEXLINK.adminAddr,
        ethers.constants.HashZero,
        ethers.utils.keccak256(HEXLINK.walletImplBytecode)
    );
};

const genSalt = function(email: string) {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(`mailto:${email}`));
};
  
export async function genWalletAddress(email: string | null | undefined) {
    if (!email) return "";
    const contract = new ethers.Contract(
        HEXLINK.adminAddr,
        HEXLINK.adminAbi,
        getProvider()
    );
    return await contract.predictWalletAddress(
        HEXLINK.walletImplAddr,
        genSalt(email)
    );
};

export async function getHexlinkMetadata(email: string | null | undefined) : Promise<IMetadata> {
    const getMetadata = httpsCallable(functions, 'metadata');
    const {data} = await getMetadata();
    const {balance} = data as {balance: number};
    return {
        balance,
        admin: {
            address: HEXLINK.adminAddr,
            abi: HEXLINK.adminAbi,
        },
        walletImpl: {
            address: walletImplAddress(),
            abi: HEXLINK.walletImplAbi,
        },
        token: HEXLINK.tokenAddr,
        wallet: await genWalletAddress(email),
    }
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

export async function getERC20Metadata(contract: string, ERC20: any) : Promise<IToken> {
    const erc20 = new ethers.Contract(contract, ERC20.abi, getProvider());
    return {
        contract,
        name: await erc20.name(),
        symbol: await erc20.symbol(),
        decimals: await erc20.decimals(),
    }
}

export async function getTokenBalance(contract: string, wallet: string) : Promise<ethers.BigNumber> {
    const token = new ethers.Contract(contract, BALANCE_ABI, getProvider());
    return await token.balanceOf(wallet);
}

export async function getBalance(t: IToken, address: string) : Promise<Token> {
    const provider = getProvider();
    if (t.contract) {
        const abi = [
            "function balanceOf(address owner) view returns (uint256)",
        ];
        const token = new ethers.Contract(t.contract, abi, provider);
        const balance = await token.balanceOf(address);
        const normalized = normalizeBalance(balance, t.decimals);
        return {...t, balance: normalized};
    } else {
        const balance = await getProvider().getBalance(address);
        const normalized = Number(ethers.utils.formatEther(balance));
        return {...t, balance: normalized};
    }
}

export async function getBalances(tokens: IToken[], wallet: string) : Promise<Token[]> {
    return await Promise.all(tokens.map(token => getBalance(token, wallet)));
}

export function normalizeBalance(balance: ethers.BigNumber, decimals: number) : number {
    const factor = ethers.BigNumber.from(10).pow(decimals);
    return Math.round(balance.div(factor).toNumber() * 100) / 100;
}

export function prettyPrintAddress(address: string) {
    if (address) {
        const len = address.length;
        return address.substring(0, 4) + "..." + address.substring(len - 4, len)
    }
    return "N/A";
}

export function prettyPrintTxHash(txHash: string) {
    if (txHash) {
        const len = txHash.length;
        return txHash.substring(0, 6) + "..." + txHash.substring(len - 6, len)
    }
    return "N/A";
}

export async function send(
    token: Token,
    receiver: string,
    amount: number
) : Promise<{txHash: string}> {
    if (token.contract) {
        const sendERC20 = httpsCallable(functions, 'sendERC20');
        const result = await sendERC20({token, receiver, amount});
        return result.data as {txHash: string};
    } else {
        const sendETH = httpsCallable(functions, 'sendETH')
        const result = await sendETH({receiver, amount});
        return result.data as {txHash: string};
    }
}

export async function deployWallet() : Promise<{txHash: string, receiptHash: string}> {
    const deployWallet = httpsCallable(functions, 'deployWallet');
    const result = await deployWallet();
    return result.data as {txHash: string, receiptHash: string};
}

export async function estimateERC20Transfer(
    token: Token,
    recevier: string,
    amount: number
) : Promise<GasEstimation> {
    const estimateFunc = httpsCallable(functions, 'estimateERC20Transfer')
    const result = await estimateFunc({token, recevier, amount});
    return result.data as GasEstimation;
}

export async function estimateETHTransfer() : Promise<GasEstimation> {
    const estimateFunc = httpsCallable(functions, 'estimateETHTransfer')
    const result = await estimateFunc();
    return result.data as GasEstimation;
}

export async function getETHPrice() : Promise<number> {
    const provider = getProvider();
    // This constant describes the ABI interface of the contract, which will provide the price of ETH
    // It looks like a lot, and it is, but this information is generated when we compile the contract
    // We need to let ethers know how to interact with this contract.
    const aggregatorV3InterfaceABI = [
      {
        inputs: [],
        name: "decimals",
        outputs: [{internalType: "uint8", name: "", type: "uint8"}],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "description",
        outputs: [{internalType: "string", name: "", type: "string"}],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{internalType: "uint80", name: "_roundId", type: "uint80"}],
        name: "getRoundData",
        outputs: [
          {internalType: "uint80", name: "roundId", type: "uint80"},
          {internalType: "int256", name: "answer", type: "int256"},
          {internalType: "uint256", name: "startedAt", type: "uint256"},
          {internalType: "uint256", name: "updatedAt", type: "uint256"},
          {internalType: "uint80", name: "answeredInRound", type: "uint80"},
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "latestRoundData",
        outputs: [
          {internalType: "uint80", name: "roundId", type: "uint80"},
          {internalType: "int256", name: "answer", type: "int256"},
          {internalType: "uint256", name: "startedAt", type: "uint256"},
          {internalType: "uint256", name: "updatedAt", type: "uint256"},
          {internalType: "uint80", name: "answeredInRound", type: "uint80"},
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "version",
        outputs: [{internalType: "uint256", name: "", type: "uint256"}],
        stateMutability: "view",
        type: "function",
      },
    ];
    // The address of the contract which will provide the price of ETH
    const addr = import.meta.env.VITE_CHAINLINK_GOERLI_ADDRESS;
    // We create an instance of the contract which we can interact with
    const priceFeed = new ethers.Contract(addr, aggregatorV3InterfaceABI, getProvider());
    // We get the data from the last round of the contract
    const roundData = await priceFeed.latestRoundData();
    // Determine how many decimals the price feed has (10**decimals)
    const decimals = await priceFeed.decimals();
    // We convert the price to a number and return it
    return Number((roundData.answer.toString() / Math.pow(10, decimals)).toFixed(2));
}