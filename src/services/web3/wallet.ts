import Web3Model from "web3modal";
import { ethers } from "ethers";
import { useWalletStore } from "@/stores/wallet"
import { buildAccountFromAddress } from "./account";
import WalletConnect from "@walletconnect/web3-provider";
import type { Wallet } from "@/types";
import { updateWalletBalances } from "@/services/web3/tokens";

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
  await web3Modal.clearCachedProvider();
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
  store.connectWallet({
    account: await buildAccountFromAddress(accounts[0]),
    wallet,
    walletIcon,
  } as Wallet);
  await updateWalletBalances();
}