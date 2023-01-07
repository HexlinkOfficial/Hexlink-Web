<template>
  <!-- <a-list>
<template #renderItem="{ item }"> -->
  <table>
    <thead class="table-thread">
      <tr>
        <th class="token-header">
          <div class="token-header-data">Token</div>
        </th>
        <th class="portfolio-percentage-header">
          <div class="portfolio-percentage-header-data">Portfolio %</div>
        </th>
        <th class="price-header">
          <div class="price-header-data">Price</div>
        </th>
        <th class="balance-header">
          <div class="balance-header-data">Balance</div>
        </th>
        <!-- <th></th> -->
      </tr>
    </thead>
    <tbody v-if="!loading">
      <tr v-for="(token, i) in props.tokens" :key="i" class="token-detail">
        <td>
          <div class="token-description">
            <div class="token-logo">
              <div class="network-logo">
                <img :src="network.logoUrl" alt={{token.address}} />
              </div>
              <img class="logo" :src="token.metadata.logoURI || logo" alt={{token.address}} />
            </div>
            <div class="token-name">
              <div class="name">
                <div class="symbol">
                  <div class="symbol-text">{{token.metadata.symbol}}</div>
                </div>
                <div class="fullname">{{token.metadata.name}}</div>
              </div>
            </div>
          </div>
        </td>
        <td class="portfolio-percentage-detail">
          <div>{{ getPortfolioRatio(token) }} %</div>
        </td>
        <td class="price-detail">
          <div class="detail">
            <div class="token-market-price">$ {{token.price ? token.price : 0}}</div>
            <p v-if="token.price" :class='isGreen ? "token-price-change-positive" : "token-price-change-negative"'>+2.64%</p>
          </div>
        </td>
        <td class="balance-detail">
          <div class="detail">
            <div class="balance">$ {{token.balance?.normalized.times(token.price || 0).toString() || 0}}</div>
            <p class="crypto-balance">{{token.balance?.normalized || 0}} {{token.metadata.symbol}}</p>
            <!-- <button id="gettingStarted" @click="() => { $el.ownerDocument.defaultView.console.log(props.tokens) }">Getting started</button> -->
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <!-- loading -->
  <div class="loading-class" v-if="loading">
    <div class="load-3">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
  </div>
</template>
  <!-- </a-list>
</template> -->

<script lang="ts" setup>
import { ref } from 'vue'
import type { Token } from "@/types";
import type { BigNumber } from "bignumber.js";
import logo from "../assets/network-icons/hexlink.svg";
import { useProfileStore } from "@/stores/profile";

const isGreen = ref(true);

const network = useProfileStore().network;

const props = defineProps({
  tokens: {
    type: Object as () => Token[],
    required: true,
  },
  balance: {
    type: Object as () => BigNumber,
    required: false,
  },
  loading: {
    type: Object as () => Boolean,
    required: true,
  }
});

const getPortfolioRatio = (token: Token) => {
  if (props.balance?.gt(0)) {
    const tokeValue = token.balance?.normalized.times(token.price || 0);
    return tokeValue?.times(100).div(props.balance);
  }
  return 0;
};
</script>

<style lang="less" scoped>
img {
  height: auto;
  max-width: 100%;
}
table {
  min-width: 100%;
  table-layout: auto;
  border-color: inherit;
  border-collapse: collapse;
  text-indent: 0; }
.table-thread {
  display: none;
  border-bottom: 1px solid #e5e7eb;
  @media (min-width: 640px) {
    display: table-header-group; } }
  .table-thread .token-header {
    font-weight: 400;
    cursor: pointer; }
    .table-thread .token-header .token-header-data {
      display: flex;
      align-items: center; }
  .table-thread .portfolio-percentage-header {
    display: none;
    font-weight: 400;
    cursor: pointer;
  
    @media (min-width: 1024px) {
      display: table-cell; } }
    .table-thread .portfolio-percentage-header .table-thread .portfolio-percentage-header-data {
      display: flex;
      align-items: center; }
  .table-thread .price-header {
    display: none;
    font-weight: 400;
    cursor: pointer;
  
    @media (min-width: 768px) {
      display: table-cell; } }
    .table-thread .price-header .price-header-data {
      display: flex;
      align-items: center; }
  .table-thread .balance-header {
    font-weight: 400;
    text-align: right;
    cursor: pointer;
  
    @media (min-width: 768px) {
      text-align: left; } }
    .table-thread .balance-header .balance-header-data {
      display: flex;
      align-items: center; }
tbody {
  padding-bottom: 2.5rem;

  @media (min-width: 640px) {
    border-top-width: 1px; } }
tbody tr {
  border-top-width: 1px;
}
.token-detail {
  border: 0px solid transparent;
  border-radius: 1.75rem;
  cursor: pointer; }
  .token-detail:hover {
    background: #e5e7eb; }
  .token-detail .token-description {
    display: flex;
    position: relative;
    align-items: center;
  
    @media (min-width: 640px) {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      width: auto; } }
    .token-detail .token-description .token-logo {
      position: relative;
      margin-right: 1rem; }
      .token-detail .token-description .token-logo .network-logo {
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
      .token-detail .token-description .token-logo .logo {
        object-fit: cover;
        width: 2rem;
        height: 2rem;
        min-width: 2rem;
        border-radius: 50px; }
    .token-detail .token-description .token-name {
      display: flex;
      align-items: center;
    
      @media (min-width: 640px) {
        max-width: none; } }
      .token-detail .token-description .token-name .name {
        display: flex;
        margin-right: 0.5rem;
        flex-direction: column;
      
        @media (min-width: 640px) {
          margin-right: 0.75rem; } }
        .token-detail .token-description .token-name .name .symbol {
          display: flex;
          font-weight: 600;
          align-items: center; }
          .token-detail .token-description .token-name .name .symbol .symbol-text {
            margin-right: 0.5rem; }
        .token-detail .token-description .token-name .name .fullname {
          font-size: 0.8rem;
          line-height: 1.25rem;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: rgb(100,116,139);
        
          @media (min-width: 640px) {
            max-width: none; } }
  .token-detail .portfolio-percentage-detail {
    display: none;
    font-weight: 600;
    white-space: nowrap;

    @media (min-width: 1024px) {
      display: table-cell; } 
      }
  .token-detail .price-detail {
    display: none; 
    white-space: nowrap; 

    @media (min-width: 768px) { 
      display: table-cell; } }
    .token-detail .price-detail .detail {
      text-align: left;
      align-items: center; }
      .token-detail .price-detail .detail .token-market-price {
        font-weight: 600; }
      .token-detail .price-detail .detail .token-price-change-positive {
        font-size: 0.8rem;
        line-height: 1.25rem;
        margin-bottom: 0;
        color: #0d8838; }
      .token-detail .price-detail .detail .token-price-change-negative {
        font-size: 0.8rem;
        line-height: 1.25rem;
        margin-bottom: 0;
        color: #ea001e; }
  .token-detail .balance-detail {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    white-space: nowrap;
  
    @media (min-width: 640px) {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      width: auto; } }
    .token-detail .balance-detail .detail {
      font-weight: 600;
      white-space: nowrap;
      align-items: center; }
      .token-detail .balance-detail .detail .balance {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap; }
      .token-detail .balance-detail .detail .crypto-balance {
        font-size: 0.875rem;
        line-height: 1.25rem;
        margin-bottom: 0;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap; }
.load-3 .line:nth-last-child(1) {
  animation: loadingC 0.6s 0.1s linear infinite; }
.load-3 .line:nth-last-child(2) {
  animation: loadingC 0.6s 0.2s linear infinite; }
.load-3 .line:nth-last-child(3) {
  animation: loadingC 0.6s 0.3s linear infinite; }
@keyframes loadingC {
  0% { transform: translate(0, 0); }
  50% { transform: translate(0, 15px); }
  100% { transform: translate(0, 0); } }
.line {
  display: inline-block;
  width: 20px;
  height: 5px;
  border-radius: 15px;
  background-color: #076AE0; }
.loading-class {
  display: flex;
  justify-content: center;
  padding: 30px; }
</style>
