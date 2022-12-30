<style lang="less" scoped>
.content-body {
  margin-left: 9.5rem; }
@media only screen and (max-width: 990px) {
  .content-body {
    margin-left: 0px;
    margin-bottom: 50px; } }
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
</style>

<template>
  <layout :active="1">
    <div class="content-body">
      <div class="container">
        <h1 style="margin-bottom: 1rem;">Red Pocket</h1>
        <button class="connect-wallet-button">
          <svg style="margin-right: 10px;" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 2.50025V3.51125C16.5304 3.51125 17.0391 3.72196 17.4142 4.09703C17.7893 4.47211 18 4.98081 18 5.51125V15.5112C18 16.0416 17.7893 16.5504 17.4142 16.9254C17.0391 17.3005 16.5304 17.5112 16 17.5112H2C1.46957 17.5112 0.96086 17.3005 0.58579 16.9254C0.21071 16.5504 0 16.0416 0 15.5112V5.51125C0 4.46625 0.835 3.51825 1.813 3.23925L12.813 0.0962511C13.1851 -0.0100989 13.5768 -0.0286089 13.9573 0.0421711C14.3377 0.112951 14.6966 0.271091 15.0055 0.504141C15.3145 0.737191 15.5651 1.03878 15.7377 1.38516C15.9102 1.73154 16 2.11326 16 2.50025ZM12.5 9.01123C12.1022 9.01123 11.7206 9.16933 11.4393 9.45063C11.158 9.73193 11 10.1134 11 10.5112C11 10.909 11.158 11.2906 11.4393 11.5719C11.7206 11.8532 12.1022 12.0112 12.5 12.0112C12.8978 12.0112 13.2794 11.8532 13.5607 11.5719C13.842 11.2906 14 10.909 14 10.5112C14 10.1134 13.842 9.73193 13.5607 9.45063C13.2794 9.16933 12.8978 9.01123 12.5 9.01123ZM14 2.50025C14.0001 2.42966 13.9852 2.35986 13.9563 2.29544C13.9274 2.23102 13.8853 2.17345 13.8326 2.1265C13.7798 2.07955 13.7178 2.04429 13.6505 2.02305C13.5832 2.00181 13.5121 1.99506 13.442 2.00325L13.362 2.01925L8.14 3.51125H14V2.50025Z"
              fill="white" />
          </svg>
          Connect Wallet
        </button>
      </div>
    </div>
  </layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import type { Token } from "@/services/web3/tokens";
import { loadAll } from "@/services/web3/tokens";
import { getBalance, isContract } from "@/services/web3/account";
import Layout from "../components/Layout.vue";
import WalletTokenList from "../components/WalletTokenList.vue";
import WalletNFTGrid from "../components/WalletNFTGrid.vue";
import { useAuthStore } from '@/stores/auth';
import WalletSetup from "@/components/AccountSetup.vue";
import { BigNumber } from "bignumber.js";

const store = useAuthStore();
const user = store.currentUser;
const firstName = user?.displayName!.split(" ")[0];
const lastName = user?.displayName!.split(" ")[-1];
const goerliScan = `https://goerli.etherscan.io/address/${user!.walletAddress}`;
const active_ = ref<string>("");
const isDeployed = ref<boolean>(true);
const loading = ref<boolean>(true);
const tokens = ref<{ [key: string]: Token }>({});
const balance = ref<number>(0);
const chain = "GOERLI";
const nftView = ref<boolean>(false);
const tokenView = ref<boolean>(true);
const all = ref<boolean>(true);
const completed = ref<boolean>(false);
const pending = ref<boolean>(false);
const canceled = ref<boolean>(false);
// const progress = document.querySelector(".js-completed-bar");
// if (progress) {
//   progress.style.width = progress.getAttribute("data-complete") + "%";
//   progress.style.opacity = 1;
// }

onMounted(async () => {
  balance.value = await getBalance(user?.email);
  const accountAddress = store.currentUser!.walletAddress!;
  tokens.value = await loadAll(store, accountAddress, chain);
  isDeployed.value = await isContract(accountAddress);
  loading.value = false;
});

const visiableTokens = computed(() => {
  return Object.values(tokens.value).filter(t => t.preference?.display || false);
});

const totalAssets = computed(() => {
  let total: BigNumber = BigNumber(0);
  for (const token of visiableTokens.value) {
    if (token.balance && token.price) {
      total = total.plus(token.balance.normalized.times(token.price));
    }
  }
  // return total.plus(BigNumber(dynamicBalance.value));
  return total;
});

const dynamicBalance = computed(() => {
  return BigNumber(Math.floor(Math.random() * 100));
});
</script>