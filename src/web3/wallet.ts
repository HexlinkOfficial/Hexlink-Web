import Web3Model from "web3modal";
import { ethers } from "ethers";
import { useWalletStore } from "@/stores/wallet"
import WalletConnect from "@walletconnect/web3-provider";
import { isContract } from "../../functions/common";
import type { Account } from "../../functions/common";
import { useChainStore } from "@/stores/chain";
import { useAccountStore } from "@/stores/account";
import { createToaster } from "@meforma/vue-toaster";

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

  const ownerAccountAddress = useAccountStore().account?.owner;
  const store = useWalletStore();
  if (ownerAccountAddress != null && accounts.map(acc => acc.toLowerCase()).includes(ownerAccountAddress.toLowerCase())) {
    store.connectWallet(
      wallet,
      walletIcon,
      await buildAccount(ownerAccountAddress)
    );
  } else if (ownerAccountAddress == null) {
    store.connectWallet(
      wallet,
      walletIcon,
      await buildAccount(accounts[0])
    );
  } else {
    try {
      const result = await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {}}]
      })
      if (result[0].caveats[0].value.includes(ownerAccountAddress.toLowerCase())) {
        store.connectWallet(
          wallet,
          walletIcon,
          await buildAccount(ownerAccountAddress)
        );
      } else {
        const toaster = createToaster({ position: "top", duration: 5000 });
        toaster.error(`Wrong account! Please connect your owners account!`);
      }
    } catch (error: any) {
      console.log(error.message);
      const toaster = createToaster({ position: "top", duration: 5000 });
      toaster.error(error.message);
    }
  }

  window.ethereum.on('accountsChanged', async function (accounts: string[]) {
    const ownerAccountAddress = useAccountStore().account?.owner;
    if (ownerAccountAddress != null && accounts.includes(ownerAccountAddress)) {
      // pass
    } else if (ownerAccountAddress != null) {
      // pop out error and disconnect
    } else if (accounts.length > 0) {
      store.switchAccount(await buildAccount(accounts[0]));
    } else {
      // pop out error and disconnect
    }
  });
}

export async function signMessage(account: string, message: string) : Promise<string> {
  return await window.ethereum.request({
      method: 'personal_sign',
      params: [message, account],
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