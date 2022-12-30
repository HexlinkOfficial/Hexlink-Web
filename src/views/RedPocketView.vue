<style lang="less" scoped>
.content-body {
  margin-left: 9.5rem;
}

@media only screen and (max-width: 990px) {
  .content-body {
    margin-left: 0px;
    margin-bottom: 50px;
  }
}
</style>

<template>
  <layout :active="1">
    <div class="content-body">
      <div class="container">
        <h1 style="margin-bottom: 1rem;">Red Pocket</h1>
        <button></button>
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