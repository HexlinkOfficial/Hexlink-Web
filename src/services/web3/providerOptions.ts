import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
// import Torus from "@toruslabs/torus-embed";

export const providerOptions = {
  walletlink: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "Hexlink Red Pocket", // Required
      infuraId: import.meta.env.VITE_INFURA_GORLI // Required unless you provide a JSON RPC url; see `rpc` below
    }
  },
  walletconnect: {
    package: WalletConnect, // required
    options: {
      infuraId: import.meta.env.VITE_INFURA_GORLI // required
    }
  },
  torus: {
    package: true, // required
  }
};
