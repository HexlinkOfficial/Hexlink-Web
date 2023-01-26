import Web3Model from "web3modal";
import { ethers } from "ethers";
import { useWalletStore } from "@/stores/wallet"
import WalletConnect from "@walletconnect/web3-provider";
import { isContract } from "../../functions/common";
import type { Account } from "../../functions/common";
import { useChainStore } from "@/stores/chain";

async function buildAccount(account: string) : Promise<Account> {
  return {
    address: account,
    isContract: await isContract(useChainStore().provider, account),
  };
}

export const providerOptions = {
  walletconnect: {
    package: WalletConnect, // required
    options: {
      infuraId: import.meta.env.VITE_INFURA_GORLI // required
    }
  },
};

export const web3Modal = new Web3Model({
    cacheProvider: true,
    providerOptions
});

export async function disconnectWallet() {
  web3Modal.clearCachedProvider();
  const store = useWalletStore();
  store.disconnectWallet();
}

export async function connectWallet() {
  if (typeof window.ethereum == 'undefined') {
    console.log('MetaMask is not installed!');
  }

  const provider = await web3Modal.connect();
  const library = new ethers.providers.Web3Provider(provider);
  const accounts = await library.listAccounts();
  if (accounts.length == 0) {
    throw new Error("Account not found");
  }

  let wallet, walletIcon;
  if (library.connection.url == "metamask") {
    wallet = "metamask";
    walletIcon = "https://i.postimg.cc/7PMD1BN4/metamask-icon.png";
  } else if (library.connection.url == "eip-1193:") {
    wallet = library.provider.wc._peerMeta.name;
    if (library.provider.wc._peerMeta.icons != null) {
      walletIcon = library.provider.wc._peerMeta.icons[0];
    } else {
      walletIcon = "https://i.postimg.cc/j29hn62F/9035092-wallet-icon.png";
    }
  }
  const store = useWalletStore();
  store.connectWallet(
    wallet,
    walletIcon,
    await buildAccount(accounts[0])
  );

  window.ethereum.on('accountsChanged', async function (accounts: string[]) {
    store.switchAccount(await buildAccount(accounts[0]));
  });
}

export async function signMessage(account: string, message: string) {
  await window.ethereum.request({
      method: 'eth_signTypedData_v4',
      params: [{ account, message }],
      from: account
  });
}

export async function estimateGas(txParams: any) : Promise<string> {
  return await window.ethereum.request({
    method: 'eth_estimateGas',
    params: [txParams],
  });
}

export async function sendTransaction(txParams: any) : Promise<string> {
  return await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [txParams],
  });
}