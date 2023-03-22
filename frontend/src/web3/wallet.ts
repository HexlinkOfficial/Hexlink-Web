import Web3Model from "web3modal";
import { ethers } from "ethers";
import { useWalletStore } from "@/stores/wallet"
import WalletConnectProvider from "@walletconnect/web3-provider";
import { isContract } from "../../../functions/common";
import type { Account } from "../../../functions/common";
import { useChainStore } from "@/stores/chain";
import { useAccountStore } from "@/stores/account";
import { createToaster } from "@meforma/vue-toaster";
import type { Chain } from "../../../functions/common";

async function buildAccount(account: string) : Promise<Account> {
  return {
    address: account,
    isContract: await isContract(useChainStore().provider, account),
  };
}

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: {
        5: 'https://goerli.infura.io/v3/' + import.meta.env.VITE_INFURA_API_KEY,
        137: 'https://polygon-mainnet.infura.io/v3/' + import.meta.env.VITE_INFURA_API_KEY,
        80001: 'https://polygon-mumbai.infura.io/v3/' + import.meta.env.VITE_INFURA_API_KEY,
        421613: 'https://arbitrum-goerli.infura.io/v3/' + import.meta.env.VITE_INFURA_API_KEY,
        42170: 'https://nova.arbitrum.io/rpc',
      },
      infuraId: import.meta.env.VITE_INFURA_API_KEY, //required
    },
  },
};

export const web3Modal = new Web3Model({
    cacheProvider: true,
    providerOptions
});

export async function disconnectWallet() {
  web3Modal.clearCachedProvider()
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

export const getProvider = async() => await web3Modal.connect();

export async function connectWallet() {
  const provider = await getProvider();
  const toaster = createToaster({ position: "top", duration: 4000 });

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
    const library = new ethers.providers.Web3Provider(provider);
    const accounts = await library.listAccounts();
    if (accounts.length == 0) {
      throw new Error("Account not found");
    }
    if (library.connection.url == "metamask") {
      wallet = "metamask";
      walletIcon = "https://i.postimg.cc/7PMD1BN4/metamask-icon.png";
    } else if (library.connection.url == "eip-1193:") {
      wallet = library.provider.wc._peerMeta.name;
      if (library.provider.wc._peerMeta.icons.length > 0) {
        walletIcon = library.provider.wc._peerMeta.icons[0];
      } else {
        walletIcon = "https://i.postimg.cc/j29hn62F/9035092-wallet-icon.png";
      }
    }
    const ownerAccountAddress = useAccountStore().account?.owner;
    if (ownerAccountAddress != null && accounts.map((acc: any) => acc.toLowerCase()).includes(ownerAccountAddress.toLowerCase())) {
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
        let result;
        if (window.ethereum) {
          result = await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
          })
        } else {
          result = provider.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
          })
        }
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
  } catch (error) {
    console.log("Error: ", error);
  }
}

export async function trySwitchNetwork(chain: Chain) : Promise<void> {
  const provider = window.ethereum || await getProvider();
  const hexifyChainId = ethers.utils.hexValue(Number(chain.chainId));
  const netVersion = await provider.request({
    method: 'net_version'
  });
  
  if (netVersion === chain.chainId) {
    return;
  }

  try {
    await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexifyChainId }]
    });
  } catch (switchError: any) {
    if (switchError.message.includes("Unrecognized chain ID")) {
      console.log("hello")
      const result1 = await provider.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: hexifyChainId,
          chainName: chain.fullName,
          blockExplorerUrls: [...chain.blockExplorerUrls],
          nativeCurrency: { ...chain.nativeCurrency },
          rpcUrls: [...chain.rpcUrls],
        }]
      });
      console.log("hello2")
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexifyChainId }],
      });
      console.log("hello3")
    } else {
      throw switchError;
    }
    console.log("switch to network: ", chain.fullName);
  }
};

export async function signMessage(account: string, message: string) : Promise<string> {
  const provider = window.ethereum || await getProvider();
  let signature: Promise<string>;
  if (!provider) throw new Error("Can't sign");
  try {
    signature = await provider.request({
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
  const provider = window.ethereum || await getProvider();
  await trySwitchNetwork(chain);
  return await provider.request({
    method: 'eth_estimateGas',
    params: [txParams],
  });
}

export async function sendTransaction(chain: Chain, txParams: any) : Promise<string> {
  const provider = window.ethereum || await getProvider();
  await trySwitchNetwork(chain);
  return await provider.request({
    method: 'eth_sendTransaction',
    params: [txParams],
  });
}