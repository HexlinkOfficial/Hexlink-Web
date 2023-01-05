import Web3Model from "web3modal";
import { providerOptions } from "./providerOptions";
import { ethers, BigNumber } from "ethers";
import { useAuthStore } from "@/stores/auth"
import type { Connection } from "@/interfaces/connection";

const web3Modal = new Web3Model({
    cacheProvider: true,
    providerOptions
});

export async function disconnectWallet() : Promise<Connection> {
  await web3Modal.clearCachedProvider();
  const store = useAuthStore();
  store.disconnectOwallet();
  return { connected: false };
}

export async function connectWallet() : Promise<Connection> {
    let connection : Connection = { connected: false, };

    const provider = await web3Modal.connect();
    const library = new ethers.providers.Web3Provider(provider);
    connection.network = await library.getNetwork();

    const accounts = await library.listAccounts();
    if (accounts.length == 0) {
      throw new Error("Account not found");
    }
    connection.address = accounts[0];

    if (library.connection.url == "metamask") {
      connection.wallet = "metamask";
      connection.walletIcon = "https://i.postimg.cc/7PMD1BN4/metamask-icon.png";
    } else if (library.connection.url == "eip-1193:") {
      connection.wallet = library.provider.wc._peerMeta.name;
      if (library.provider.wc._peerMeta.icons != null) {
        connection.walletIcon = library.provider.wc._peerMeta.icons[0];
      } else {
        connection.walletIcon = "https://i.postimg.cc/j29hn62F/9035092-wallet-icon.png";
      }
    }
    const store = useAuthStore();
    store.connectOwallet(connection);
    connection.connected = true;
  
    const etherProvider = ethers.getDefaultProvider(connection.network);
    etherProvider.getBalance(connection.address).then((balance) => {
      // convert a currency unit from wei to ether
      connection.balance = balance;
    })
    return connection;
  }