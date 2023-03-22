<template>
  <div v-if="!loading && !hasContent">
    <EmptyContent 
      title="Start by receiving the first token"
      message="Unlocking the potential of Hexlink by depositing your first token or claim your first airdrop"
    >
    </EmptyContent>
  </div>
  <div v-if="!loading && hasContent" v-for="(token, i) in useTokenStore().visiableTokens" :key="i" class="token-detail">
    <div style="padding: 0.75rem; display: flex; align-items: center; justify-content: space-between; width: 100%;">
      <div class="token-description">
        <div class="token-logo">
          <div class="network-logo">
            <img :src="useChainStore().chain.logoUrl" alt={{token.address}} />
          </div>
          <img class="logo" :src="token.logoURI || logo" alt={{token.address}} />
        </div>
        <div class="token-name">
          <div class="name">
            <div class="symbol">
              <div class="symbol-text">{{token.symbol}}</div>
            </div>
            <div class="fullname">{{token.name}}</div>
          </div>
        </div>
      </div>
      <div class="detail">
        <div class="balance">$ {{ usdValue(token) }}</div>
        <p class="crypto-balance">{{balance(token)}} {{token.symbol}}</p>
      </div>
    </div>
  </div>
  <!-- loading -->
  <Loading v-if="loading" class="loading-state"/>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import type { Token } from "../../../functions/common";
import logo from "../assets/network-icons/hexlink.svg";
import { useChainStore } from "@/stores/chain";
import { getBalances, updatePreferences } from "@/web3/tokens";
import type { BalanceMap } from "@/web3/tokens";
import Loading from "@/components/Loading.vue";
import { useAccountStore } from '@/stores/account';
import { useTokenStore } from '@/stores/token';
import EmptyContent from '@/components/EmptyContent.vue';
import { getTokenPrices } from "@/services/price";
import { BigNumber } from "bignumber.js";

const loading = ref<boolean>(true);
const balances = ref<BalanceMap>({});
const hasContent = ref<boolean>(false);
const prices = ref<{[token: string]: string}>({});

const balance = (token: Token) : string => {
  return balances.value[token.address]?.normalized || "0";
}

const price = (token: Token) : string => {
  return prices.value[token.address] || "0";
}

const loadTokens = async () => {
  loading.value = true;
  const account = useAccountStore().account?.address
  if (account) {
    balances.value = await getBalances(account, balances.value);
    await updatePreferences(balances.value);
  }
  useTokenStore().visiableTokens.length > 0 ? hasContent.value = true : hasContent.value = false;
  const tokensToCheckPrice = useTokenStore().visiableTokens.filter(
    t => Number(balance(t)) > 0
  ).map(t => t.address);
  prices.value = await getTokenPrices(useChainStore().chain, tokensToCheckPrice);
  loading.value = false;
}
onMounted(loadTokens);
watch(() => useChainStore().current, loadTokens);

const usdValue = (token: Token) : string => {
  const value = new BigNumber(
    price(token)
  ).times(balance(token));
  if (value.gt("0.0001")) {
    return value.dp(4).toString()
  }
  return "0";
};
</script>

<style lang="less" scoped>
.loading-state {
  display: flex;
  padding: 0.5rem;
  align-items: center;
  justify-content: center;
  height: 425px;
  @media (max-width: 990px) {
    height: 150px; } }
img {
  height: auto;
  max-width: 100%;
}
.token-detail {
  width: 100%;
  padding: 0 1rem;
  border-radius: 1rem; }
.token-detail:hover {
  box-shadow: rgb(39 44 49 / 7%) 8px 28px 50px, rgb(39 44 49 / 4%) 1px 6px 12px;
  transform: translate3d(0px, -1px, 0px) scale(1.01);
  transition: all 0.2s ease 0s; }
.token-description {
  display: flex;
  position: relative;
  align-items: center;
  @media (min-width: 640px) {
    width: auto; } }
.token-logo {
  position: relative;
  margin-right: 1rem; }
.network-logo {
  display: flex;
  object-fit: cover;
  position: absolute;
  top: -0.25rem;
  left: -0.25rem;
  justify-content: center;
  align-items: center;
  width: 1rem;
  height: 1rem;
  border-radius: 50px;
  box-shadow: 0 0 0 1px rgb(241 245 249); }
.logo {
  object-fit: cover;
  width: 2rem;
  height: 2rem;
  min-width: 2rem;
  border-radius: 50px; }
.token-name {
  display: flex;
  align-items: center;

  @media (min-width: 640px) {
    max-width: none; } }
.name {
  display: flex;
  margin-right: 0.5rem;
  flex-direction: column;

  @media (min-width: 640px) {
    margin-right: 0.75rem; } }
.symbol {
  display: flex;
  font-weight: 600;
  align-items: center; }
.symbol-text {
  margin-right: 0.5rem; }
.fullname {
  font-size: 0.8rem;
  line-height: 1.25rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgb(100,116,139);

  @media (min-width: 640px) {
    max-width: none; } }
.detail {
  font-weight: 600;
  white-space: nowrap;
  align-items: center; }
.balance {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right; }
.crypto-balance {
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-bottom: 0;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right; }
</style>
