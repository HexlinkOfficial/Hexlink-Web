import { isContract } from "../../../functions/common";
import type { Account } from "../../../functions/common";
import type { Chain } from "../../../functions/common";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers, ethers } from "ethers";
import { useChainStore } from "@/stores/chain";
import { useWalletStore } from "@/stores/wallet";
import { useAccountStore } from "@/stores/account";
import { createToaster } from "@meforma/vue-toaster";

async function buildAccount(account: string): Promise<Account> {
  return {
    address: account,
    isContract: await isContract(useChainStore().provider, account),
  };
}

export const provider = new WalletConnectProvider({
  rpc: {
    5: 'https://goerli.infura.io/v3/' + import.meta.env.VITE_INFURA_API_KEY,
    137: 'https://polygon-mainnet.infura.io/v3/' + import.meta.env.VITE_INFURA_API_KEY,
    80001: 'https://polygon-mumbai.infura.io/v3/' + import.meta.env.VITE_INFURA_API_KEY,
    421613: 'https://arbitrum-goerli.infura.io/v3/' + import.meta.env.VITE_INFURA_API_KEY,
    42170: 'https://nova.arbitrum.io/rpc' + import.meta.env.VITE_INFURA_API_KEY,
  },
  infuraId: "e4ea80f8c3764a1ea0a582a4846d708c"
});

export const connectWallet = async () => {
  let wallet, walletIcon, address, chainId;
  const toaster = createToaster({ position: "top", duration: 4000 });
  const store = useWalletStore();
  try {
    await provider.enable();
    const web3Provider = new providers.Web3Provider(provider);
    const accounts = await web3Provider.listAccounts();
    if (accounts.length == 0) {
      throw new Error("Account not found");
    }
    address = accounts[0];
    if (web3Provider.connection.url == "metamask") {
      wallet = "metamask";
      walletIcon = "https://i.postimg.cc/7PMD1BN4/metamask-icon.png";
    } else if (web3Provider.connection.url == "eip-1193:") {
      console.log(web3Provider);
      wallet = web3Provider.provider.wc._peerMeta.name;
      if (web3Provider.provider.wc._peerMeta.icons.length > 0) {
        walletIcon = web3Provider.provider.wc._peerMeta.icons[0];
      } else {
        walletIcon = "https://i.postimg.cc/j29hn62F/9035092-wallet-icon.png";
      }
    }
    chainId = await provider.request({ method: "eth_chainId" });
    // provider.on("disconnect", (code: any, reason: any) => {
    //   console.log(code, reason);
    //   console.log("disconnected");
    //   store.disconnectWallet();
    // });
    provider.on("accountsChanged", (accounts: any) => {
      if (accounts.length > 0) {
        address = accounts[0];
      }
    });
    provider.on("chainChanged", (chainId: any) => {
      console.log(chainId);
      chainId = chainId
      //window.location.reload();
    });

    const ownerAccountAddress = useAccountStore().account?.owner;
    if (ownerAccountAddress != null && accounts.map((acc: any) => acc.toLowerCase()).includes(ownerAccountAddress.toLowerCase())) {
      store.connectWallet(
        wallet,
        walletIcon,
        await buildAccount(ownerAccountAddress),
        provider
      );
    } else if (ownerAccountAddress == null) {
      store.connectWallet(
        wallet,
        walletIcon,
        await buildAccount(accounts[0]),
        provider
      );
    } else {
      try {
        const result = await provider.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        })
        if (result[0].caveats[0].value.includes(ownerAccountAddress.toLowerCase())) {
          store.connectWallet(
            wallet,
            walletIcon,
            await buildAccount(ownerAccountAddress),
            provider
          );
        } else {
          toaster.error(`Wrong owner account! Please connect to ${ownerAccountAddress}!`);
        }
      } catch (error: any) {
        console.log(error.message);
        toaster.error(error.message);
      }
    }
  } catch (e) {
    console.log(e);
  }
}

export async function disconnectWallet() {
  const store = useWalletStore();
  store.disconnectWallet();
  await provider.disconnect();
}

export async function trySwitchNetwork(chain: Chain): Promise<void> {
  const store = useWalletStore();
  const hexifyChainId = ethers.utils.hexValue(Number(chain.chainId));
  const netVersion = await store.provider!.request({
    method: 'net_version'
  });
  if (netVersion === chain.chainId) {
    return;
  }
  try {
    await store.provider!.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexifyChainId }]
    });
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      try {
        await store.provider!.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: hexifyChainId,
            chainName: chain.fullName,
            blockExplorerUrls: [...chain.blockExplorerUrls],
            nativeCurrency: { ...chain.nativeCurrency },
            rpcUrls: [...chain.rpcUrls],
          }]
        });
        await store.provider!.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: hexifyChainId }],
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
  console.log("switch to network: ", chain.fullName);
};

export async function signMessage(account: string, message: string): Promise<string> {
  let signature: Promise<string>;
  const store = useWalletStore();
  if (!store.provider) throw new Error("Can't sign");
  try {
    signature = await store.provider!.request({
      method: "personal_sign",
      params: [message, account]
    });
    return signature;
  } catch (error) {
    console.log(error);
  }
  return "";
}

export async function estimateGas(chain: Chain, txParams: any): Promise<string> {
  const store = useWalletStore();
  await trySwitchNetwork(chain);
  return await store.provider!.request({
    method: 'eth_estimateGas',
    params: [txParams],
  });
}

export async function sendTransaction(chain: Chain, txParams: any): Promise<string> {
  const store = useWalletStore();
  console.log("provider2: ", store.provider);
  await trySwitchNetwork(chain);
  return await store.provider!.request({
    method: 'eth_sendTransaction',
    params: [txParams],
  });
}