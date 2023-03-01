import Web3Model from "web3modal";
import { ethers } from "ethers";
import { useWalletStore } from "@/stores/wallet"
import WalletConnect from "@walletconnect/web3-provider";
import { isContract } from "../../functions/common";
import type { Account } from "../../functions/common";
import { useChainStore } from "@/stores/chain";
import { useAccountStore } from "@/stores/account";
import { createToaster } from "@meforma/vue-toaster";
import detectEthereumProvider from '@metamask/detect-provider';
import type { Chain } from "../../functions/common";

let provider, library: any;

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
      infuraId: import.meta.env.VITE_INFURA_GORLI, //required
      qrcodeModalOptions: {
        mobileLinks: [
          'metamask',
          'trust',
          'argent'
        ]
      }
    },
  },
};

export const web3Modal = new Web3Model({
    cacheProvider: true,
    providerOptions
});

export async function disconnectWallet() {
  await web3Modal.clearCachedProvider()
  const store = useWalletStore();
  store.disconnectWallet();
}

function handleEthereum() {
  const { ethereum } = window;
  if (ethereum && ethereum.isMetaMask) {
    console.log('Ethereum successfully detected!');
    // Access the decentralized web!
  } else {
    console.log('Please install MetaMask!');
  }
}

export async function connectWallet() {
  const toaster = createToaster({ position: "top", duration: 4000 });
  // const metamaskProvider = await detectEthereumProvider()
  // if (!metamaskProvider) {
  //   console.log('MetaMask is not installed!');
  // }

  if (window.ethereum) {
    handleEthereum();
  } else {
    window.addEventListener('ethereum#initialized', handleEthereum, {
      once: true,
    });
    setTimeout(handleEthereum, 3000); // 3 seconds
  }
  let wallet, walletIcon;
  const store = useWalletStore();
  try {
    provider = await web3Modal.connect();
    library = new ethers.providers.Web3Provider(provider);
    const accounts = await library.listAccounts();
    if (accounts.length == 0) {
      throw new Error("Account not found");
    }
    if (library.connection.url == "metamask") {
      wallet = "metamask";
      walletIcon = "https://i.postimg.cc/7PMD1BN4/metamask-icon.png";
    } else if (library.connection.url == "eip-1193:") {
      console.log(library);
      wallet = library.provider.wc._peerMeta.name;
      if (library.provider.wc._peerMeta.icons.length > 0) {
        walletIcon = library.provider.wc._peerMeta.icons[0];
      } else {
        walletIcon = "https://i.postimg.cc/j29hn62F/9035092-wallet-icon.png";
      }
    }

    const ownerAccountAddress = useAccountStore().account?.owner;
    if (ownerAccountAddress != null && accounts.map(acc => acc.toLowerCase()).includes(ownerAccountAddress.toLowerCase())) {
      store.connectWallet(
        wallet,
        walletIcon,
        await buildAccount(ownerAccountAddress),
      );
    } else if (ownerAccountAddress == null) {
      store.connectWallet(
        wallet,
        walletIcon,
        await buildAccount(accounts[0]),
      );
    } else {
      try {
        const result = await library.provider.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        })
        if (result[0].caveats[0].value.includes(ownerAccountAddress.toLowerCase())) {
          store.connectWallet(
            wallet,
            walletIcon,
            await buildAccount(ownerAccountAddress),
          );
        } else {
          toaster.error(`Wrong owner account! Please connect to ${ownerAccountAddress}!`);
        }
      } catch (error: any) {
        console.log(error.message);
        toaster.error(error.message);
      }
    }
    // window.ethereum.on('accountsChanged', async function (accounts: string[]) {
    //   const ownerAccountAddress = useAccountStore().account?.owner;
    //   if (ownerAccountAddress != null && accounts.includes(ownerAccountAddress)) {
    //     // pass
    //   } else if (ownerAccountAddress != null) {
    //     // pop out error and disconnect
    //   } else if (accounts.length > 0) {
    //     store.switchAccount(await buildAccount(accounts[0]));
    //   } else {
    //     // pop out error and disconnect
    //   }
    // });
  } catch (error) {
    console.log(error)
  }
}

export async function trySwitchNetwork(chain: Chain) : Promise<void> {
  const store = useWalletStore();
  const hexifyChainId = ethers.utils.hexValue(Number(chain.chainId));
  const netVersion = await library.provider?.request({
    method: 'net_version'
  });
  if (netVersion === chain.chainId) {
    return;
  }
  try {
    await library.provider?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexifyChainId }]
    });
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      try {
        await library.provider?.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: hexifyChainId,
            chainName: chain.fullName,
            blockExplorerUrls: [...chain.blockExplorerUrls],
            nativeCurrency: { ...chain.nativeCurrency },
            rpcUrls: [...chain.rpcUrls],
          }]
        });
        await library.provider?.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: hexifyChainId }],
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
};

export async function signMessage(account: string, message: string) : Promise<string> {
  let signature: Promise<string>;
  const store = useWalletStore();
  if (!library) return "";
  try {
      signature = await library.provider?.request({
      method: "personal_sign",
      params: [message, account]
    });
    return signature;
  } catch (error) {
    console.log(error);
  }
  return "";
}

export async function estimateGas(chain: Chain, txParams: any) : Promise<string> {
  const store = useWalletStore();
  await trySwitchNetwork(chain);
  return await library.provider?.request({
    method: 'eth_estimateGas',
    params: [txParams],
  });
}

export async function sendTransaction(chain: Chain, txParams: any) : Promise<string> {
  const store = useWalletStore();
  await trySwitchNetwork(chain);
  return await library.provider?.request({
    method: 'eth_sendTransaction',
    params: [txParams],
  });
}