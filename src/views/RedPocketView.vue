<style lang="less" scoped>
.content-body {
  margin-left: 9.5rem; }
@media only screen and (max-width: 990px) {
  .content-body {
    margin-left: 0px;
    margin-bottom: 50px; } }
.wallet-bar {
  display: flex;
  align-items: center;
  justify-content: space-between; }
.connect-wallet-button {
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  color: #000;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 800;
  line-height: 1.25rem;
  width: 50%;
  border-radius: 50px;
  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    width: 200px; }
  @media (min-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    width: 200px; }
  opacity: 1;
  background-color: rgb(7, 106, 224);
  color: white; }
.connection-status {
  display: flex; 
  p {
    margin-right: 1rem;
    margin-bottom: 0rem; }}
.checkmark {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px #7ac142;
  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both; }
.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #7ac142;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
.checkmark__check .animateElement {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards; }
@keyframes stroke {
  100% {
    stroke-dashoffset: 0; } }
@keyframes scale {
  0%, 100% {
    transform: none; }
  50% {
    transform: scale3d(1.1, 1.1, 1); } }
@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 30px #7ac142; } }
.crossmark {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  stroke-width: 2;
  stroke: #ff0000;
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px #ff0000;
  animation: fillred .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both; }
.crossmark__circle.animateElement {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #ff0000;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
.cross__path {
  stroke: #ffffff;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  transform-origin: 50% 50% 0; }
.cross__path--right {
  animation: 0.3s ease 0.8s normal forwards 1 running stroke; }
.cross__path--left {
  animation: 1s ease 0.8s normal forwards 1 running stroke; }
@keyframes fillred {
  100% {
    box-shadow: inset 0px 0px 0px 30px #ff0000; } }
@keyframes stroke {
  100% {
    stroke-dashoffset: 0; } }
</style>

<template>
  <layout :active="1">
    <div class="content-body">
      <div class="container">
        <h1 style="margin-bottom: 1rem;">Red Pocket</h1>
        <div class="wallet-bar">
          <button v-if='account==""' class="connect-wallet-button" @click="connectWallet">
            <svg style="margin-right: 10px;" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16 2.50025V3.51125C16.5304 3.51125 17.0391 3.72196 17.4142 4.09703C17.7893 4.47211 18 4.98081 18 5.51125V15.5112C18 16.0416 17.7893 16.5504 17.4142 16.9254C17.0391 17.3005 16.5304 17.5112 16 17.5112H2C1.46957 17.5112 0.96086 17.3005 0.58579 16.9254C0.21071 16.5504 0 16.0416 0 15.5112V5.51125C0 4.46625 0.835 3.51825 1.813 3.23925L12.813 0.0962511C13.1851 -0.0100989 13.5768 -0.0286089 13.9573 0.0421711C14.3377 0.112951 14.6966 0.271091 15.0055 0.504141C15.3145 0.737191 15.5651 1.03878 15.7377 1.38516C15.9102 1.73154 16 2.11326 16 2.50025ZM12.5 9.01123C12.1022 9.01123 11.7206 9.16933 11.4393 9.45063C11.158 9.73193 11 10.1134 11 10.5112C11 10.909 11.158 11.2906 11.4393 11.5719C11.7206 11.8532 12.1022 12.0112 12.5 12.0112C12.8978 12.0112 13.2794 11.8532 13.5607 11.5719C13.842 11.2906 14 10.909 14 10.5112C14 10.1134 13.842 9.73193 13.5607 9.45063C13.2794 9.16933 12.8978 9.01123 12.5 9.01123ZM14 2.50025C14.0001 2.42966 13.9852 2.35986 13.9563 2.29544C13.9274 2.23102 13.8853 2.17345 13.8326 2.1265C13.7798 2.07955 13.7178 2.04429 13.6505 2.02305C13.5832 2.00181 13.5121 1.99506 13.442 2.00325L13.362 2.01925L8.14 3.51125H14V2.50025Z"
                fill="white" />
            </svg>
            Connect Wallet
          </button>
          <button v-if='account!=""' class="connect-wallet-button" @click="disconnect">
            <svg style="margin-right: 10px;" width="18" height="18" viewBox="0 0 18 18" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16 2.50025V3.51125C16.5304 3.51125 17.0391 3.72196 17.4142 4.09703C17.7893 4.47211 18 4.98081 18 5.51125V15.5112C18 16.0416 17.7893 16.5504 17.4142 16.9254C17.0391 17.3005 16.5304 17.5112 16 17.5112H2C1.46957 17.5112 0.96086 17.3005 0.58579 16.9254C0.21071 16.5504 0 16.0416 0 15.5112V5.51125C0 4.46625 0.835 3.51825 1.813 3.23925L12.813 0.0962511C13.1851 -0.0100989 13.5768 -0.0286089 13.9573 0.0421711C14.3377 0.112951 14.6966 0.271091 15.0055 0.504141C15.3145 0.737191 15.5651 1.03878 15.7377 1.38516C15.9102 1.73154 16 2.11326 16 2.50025ZM12.5 9.01123C12.1022 9.01123 11.7206 9.16933 11.4393 9.45063C11.158 9.73193 11 10.1134 11 10.5112C11 10.909 11.158 11.2906 11.4393 11.5719C11.7206 11.8532 12.1022 12.0112 12.5 12.0112C12.8978 12.0112 13.2794 11.8532 13.5607 11.5719C13.842 11.2906 14 10.909 14 10.5112C14 10.1134 13.842 9.73193 13.5607 9.45063C13.2794 9.16933 12.8978 9.01123 12.5 9.01123ZM14 2.50025C14.0001 2.42966 13.9852 2.35986 13.9563 2.29544C13.9274 2.23102 13.8853 2.17345 13.8326 2.1265C13.7798 2.07955 13.7178 2.04429 13.6505 2.02305C13.5832 2.00181 13.5121 1.99506 13.442 2.00325L13.362 2.01925L8.14 3.51125H14V2.50025Z"
                fill="white" />
            </svg>
            Disconnect
          </button>
          <p style="margin-bottom: 0rem;">Account: <b>{{ truncateAddress(account) }}</b></p>
          <p style="margin-bottom: 0rem;">Network ID: <b>{{ chainId>0 ? chainId : "No Network" }}</b></p>
          <div class="connection-status">
            <p>Connection Status:</p>
            <svg v-if='account!=""' class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
              <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
            <svg v-if='account==""' class="crossmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle class="crossmark__circle" cx="26" cy="26" r="25" fill="none" />
              <path class="cross__path cross__path--right" fill="none" d="M16,16 l20,20" />
              <path class="cross__path cross__path--left" fill="none" d="M16,36 l20,-20" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import Layout from "../components/Layout.vue";
import { useAuthStore } from '@/stores/auth';
import { BigNumber } from "bignumber.js";
import Web3Model from "web3modal";
import { ethers } from "ethers";
import { providerOptions } from "../services/web3/providerOptions";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { truncateAddress } from "@/services/web3/account";
// import { configureChains, createClient } from "@wagmi/core";

// import { arbitrum, mainnet, polygon } from "@wagmi/core/chains";

// import { Web3Modal } from "@web3modal/html";

// import {
//   EthereumClient,
//   modalConnectors,
//   walletConnectProvider,
// } from "@web3modal/ethereum";

const store = useAuthStore();
const user = store.currentUser;
const goerliScan = `https://goerli.etherscan.io/address/${user!.walletAddress}`;
const isDeployed = ref<boolean>(true);
const loading = ref<boolean>(true);
const balance = ref<number>(0);
const chain = "GOERLI";
const chainId = ref<number>(-1);
const account = ref<string>("");
const network = ref<any>();
// TODO: Implement Web3Model V2

const web3Modal = new Web3Model({
  cacheProvider: true,
  providerOptions
});

const connectWallet = async () => {
  // check if metamask is installed
  if (typeof window.ethereum == 'undefined') {
    console.log('MetaMask is not installed!');
    return;
  }
  try {
    const provider = await web3Modal.connect();
    const library = new ethers.providers.Web3Provider(provider);
    const accounts = await library.listAccounts();
    network.value = await library.getNetwork();
    if (accounts) account.value = accounts[0];
    chainId.value = network.value.chainId;
    console.log("Network: ", network.value);
    console.log("Account: ", account.value);
    console.log(library);
  } catch (error) {
    console.log(error);
  }
}

const refreshState = () => {
  account.value = "";
  chainId.value = -1;
  network.value = "";
  console.log("Logged out!")
};

const disconnect = async () => {
  await web3Modal.clearCachedProvider();
  refreshState();
}

onMounted(async () => {
  if (web3Modal.cachedProvider) {
    connectWallet();
  }
})
// const chains = [mainnet, polygon];
// // Wagmi Core Client
// const { provider } = configureChains(chains, [
//   walletConnectProvider({ projectId: "51b27c0586113c177a6b6f67db61294c" }),
// ]);
// const wagmiClient = createClient({
//   autoConnect: true,
//   connectors: modalConnectors({ appName: "web3Modal", chains }),
//   provider,
// });

// // Web3Modal and Ethereum Client
// const ethereumClient = new EthereumClient(wagmiClient, chains);
// const web3modal = new Web3Modal(
//   { projectId: "51b27c0586113c177a6b6f67db61294c" },
//   ethereumClient
// );


</script>