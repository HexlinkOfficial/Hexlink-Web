<style lang="less" scoped>
.content-body {
  margin-left: 9.5rem; }
@media only screen and (max-width: 990px) {
  .content-body {
    margin-left: 0px;
    margin-bottom: 50px; } }
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem; }
.card>hr {
  margin-right: 0;
  margin-left: 0; } 
.card>.list-group {
  border-top: inherit;
  border-bottom: inherit; }
.card>.list-group:first-child {
  border-top-width: 0;
  border-top-left-radius: calc(0.25rem - 1px);
  border-top-right-radius: calc(0.25rem - 1px); }
.card>.list-group:last-child {
  border-bottom-width: 0;
  border-bottom-right-radius: calc(0.25rem - 1px);
  border-bottom-left-radius: calc(0.25rem - 1px); }
.card>.card-header+.list-group,
.card>.list-group+.card-footer {
  border-top: 0; }
.card {
  margin-bottom: 30px;
  height: calc(100% - 30px);
  border: 0;
  box-shadow: 0px 0px 40px 0px rgba(82, 63, 105, 0.12); }
.card.h-unset {
  height: unset; }
.card.no-shadow {
  box-shadow: 0 0.75rem 1.5rem rgba(68, 63, 75, 0.1); }
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f1f1;
  background: transparent;
  padding: 20px; }
.card-title {
  font-size: 16px;
  margin-bottom: 0px;
  color: #495057;
  font-weight: 600; }
.card .card-body {
  padding: 20px;
  background: transparent;
  border-radius: 15px; }
.card .card-footer {
  padding: 20px;
  background: #fff; }
.card-body {
  flex: 1 1 auto;
  padding: 1rem 1rem; }
.invite-content .input-group-text {
  background: #556ee6;
  color: #fff; }
.card {
  margin-bottom: 1.875rem;
  background-color: #fff;
  transition: all .5s ease-in-out;
  position: relative;
  border: 0px solid transparent;
  border-radius: 1rem;
  box-shadow: 0px 5px 5px 0px rgba(82, 63, 105, 0.05);
  height: calc(100% - 30px); }
@media only screen and (max-width: 575px) {
  .card {
    margin-bottom: 0.938rem;
    height: calc(100% - 0.938rem); } }
.card-body {
  padding: 1.875rem; }
@media only screen and (max-width: 575px) {
  .card-body {
    padding: 1rem; } }

.dashboard-header {
  flex: 1;
  display: inline-block;
  width: 100%;
  background-color: var(--white);
  border-radius: var(--radius-large);
  border: 1px solid var(--fade-grey-dark-3);
  transition: all .3s;
  display: flex;
  align-items: center;
  padding: 20px; }
  .dashboard-header .profile-pic {
    position: relative;
    display: inline-block;
    vertical-align: bottom;
    max-width: 80px;
    min-width: 80px;
    max-height: 80px; }
    .dashboard-header .profile-pic img {
      border-radius: 50px;
      height: 80px;
      width: 80px;
    }
  .dashboard-header .welcome {
    padding: 0 2rem; }
    .dashboard-header .welcome .title {
      font-size: 1rem;
      margin-bottom: 0;
      font-weight: 500; }
    .dashboard-header .welcome .sub-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
      padding: 0;
      color: black; }
  .dashboard-header .user-balance {
    padding: 0 2rem; }
    .dashboard-header .user-balance .title {
      font-size: 1rem;
      margin-bottom: 0;
      font-weight: 500; }
    .dashboard-header .user-balance .sub-title {
      font-size: 2rem;
      font-weight: 600;
      margin: 0;
      padding: 0;
      color: black; }
.cta {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 23px;
  height: 23px;
  margin-left: 20px;
  background: white;
  border-radius: 6px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
  @media only screen and (max-width: 767px) {
    margin-left: 0;
  } }
  .cta .cta-title {
    display: flex; }
    .cta .cta-title svg {
      width: 15px;
      opacity: .8; }
    .cta .cta-title .white-text {
      color: #fff;
      line-height: 1.5;
      font-size: 1em;
      font-weight: 300;
      margin: 0;
      padding: 0; }
  .cta .cta-link {
    display: block;
    font-weight: 500;
    margin-top: 0.5rem;
    cursor: pointer;
    text-decoration: none;
    line-height: 1.5;
    font-size: 1em;
    color: hsl(0 0% 99%); }
.token-worth {
  display: flex;
  flex-direction: row;
  padding: 16px;
  border-radius: 5px;
  width: 100%;
  min-height: 70px;
  justify-content: space-between;
  align-items: center; }
  .token-worth .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    flex-direction: row;
    font-size: 1rem;
    line-height: 1.33;
    color: rgb(138, 147, 165);
    margin-bottom: 4px; }
  .token-worth .price {
    font-size: 2rem;
    font-weight: bold;
    line-height: 1.33;
    color: black;
    margin-right: auto;
    word-break: keep-all; }
.token-list {
  display: grid;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  @media (min-width: 640px) {
    display: flex; } }
  .token-list .title {
    display: grid;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.75rem;
  
    @media (min-width: 640px) {
      display: flex; } }
    .token-list .title .title-col {
      display: flex; 
      justify-content: space-between; 
      grid-column: span 4 / span 4; }
      .token-list .title .title-col .content {
        display: flex;
        margin-left: 0.75rem;
        margin-left: 0.875rem;
        align-items: center; }
        .token-list .title .title-col .content .text {
          font-size: 1.25rem;
          line-height: 1.75rem;
          font-weight: 600; }
        .token-list .title .title-col .content svg {
          display: inline-flex;
          transition-property: background-color, border-color, color, fill, stroke;
          justify-content: center;
          align-items: center;
          width: 1rem;
          height: 1rem;
          margin-left: 0.75rem; }
  .token-list .views {
    margin-top: 0.75rem;
    grid-column: span 4 / span 4;
  
    @media (min-width: 640px) {
      display: flex;
      margin-top: 0; } }
    .token-list .views .detail-view {
      display: flex;
      padding: 0.125rem;
      transition-property: background-color, border-color, color, fill, stroke;
      border-radius: 50px;
      border-style: solid;
      border-width: 1px;
      border-color: rgb(71, 85, 105);
    
      @media (min-width: 640px) {
        margin-left: 0.75rem;
        margin-left: 0.875rem;
        max-width: 28rem; } }
      .token-list .views .detail-view button {
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
          width: 150px; }
        @media (min-width: 768px) {
          padding-left: 1.5rem;
          padding-right: 1.5rem;
          width: 150px; } }
      .token-list .views .detail-view .listView-button {
        opacity: 1;
        background-color: rgba(7, 106, 224,0);
        color: rgb(71, 85, 105); }
      .token-list .views .detail-view .listView-button.show {
        opacity: 1;
        background-color: rgb(7, 106, 224);
        color: white; }
.token-listDetail {
  border-radius: 0.75rem;
  margin-top: 1.75rem; }
  .token-listDetail .token-table {
    display: flex;
    margin-left: -1rem;
    margin-right: -1rem;
    flex-direction: column;
  
    @media (min-width: 640px) {
      margin-left: 0;
      margin-right: 0; } }
    .token-listDetail .token-table table {
      min-width: 100%;
      table-layout: auto;
      border-color: inherit;
      text-indent: 0; }
      .token-listDetail .token-table .table-thread {
        display: none;
        border-bottom: 1px solid #e5e7eb;
        // border-bottom-width: 1px;
        @media (min-width: 640px) {
          display: table-header-group; } }
        .token-listDetail .token-table .table-thread .toke-header {
          font-weight: 400;
          cursor: pointer; }
          .token-listDetail .token-table .table-thread .toke-header .token-header-data {
            display: flex;
            align-items: center; }
        .token-listDetail .token-table .table-thread .portfolio-percentage-header {
          display: none;
          font-weight: 400;
          cursor: pointer;

          @media (min-width: 1024px) {
            display: table-cell; } }
          .token-listDetail .token-table .table-thread .portfolio-percentage-header .portfolio-percentage-header-data {
            display: flex;
            align-items: center; }
          .token-listDetail .token-table .table-thread .portfolio-percentage-header .portfolio-percentage-header-sign {
            display: flex;
            margin-left: 0.5rem;
            flex-direction: column;
            align-items: center; }
        .token-listDetail .token-table .table-thread .price-header {
          display: none;
          font-weight: 400;
          cursor: pointer;
        
          @media (min-width: 768px) {
            display: table-cell; } }
          .token-listDetail .token-table .table-thread .price-header .price-header-data {
            display: flex;
            align-items: center; }
        .token-listDetail .token-table .table-thread .balance-header {
          font-weight: 400;
          text-align: right;
          cursor: pointer;
        
          @media (min-width: 768px) {
            text-align: left; } }
          .token-listDetail .token-table .table-thread .balance-header .balance-header-data {
            display: flex;
            align-items: center; }
.account-setup {
  display: flex;
  flex-direction: row;
  justify-content: space-between; }
  .account-setup h4 {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    margin-left: 0.875rem; }
    .account-setup .icon-grey {
      color: #076AE0;
    }
  .account-setup .cta-button {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 800;
    line-height: 1.25rem;
    width: 100px;
    border-radius: 50px;
    opacity: 1;
    background-color: rgb(7, 106, 224);
    color: white; }
img,
svg {
  vertical-align: middle; }
</style>
<template>
  <layout :active="1">
    <div class="content-body">
      <div class="container">
        <h1 style="margin-bottom: 1rem;;">Tokens</h1>
        <div class="row">
          <div className="row invoice-card-row">
            <!-- account set up notification -->
            <!-- <div class="col-xxl-6">
              <div class="card">
                <div class="card-body" style="padding: 10px 20px;">
                  <div class="account-setup">
                    <h4><span class="icon-grey"><i class="fa-solid fa-circle-exclamation"></i></span>&nbsp;&nbsp;Your account is not setup yet, please setup your account first.</h4>
                    <button class="cta-button">Set Up</button>
                  </div>
                </div>
              </div>
            </div> -->
            <!-- <div class="col-xxl-6">
              <div class="card">
                <div class="card-body">
                  <a-row v-if="!isDeployed" justify="center" align="middle" style="margin: 20px;">
                    <WalletSetup></WalletSetup>
                  </a-row>
                  <div class="token-list">
                    <div class="title">Your account is not setup yet. To send or swap tokens, please setup your account first.</div>
                    <div class="views">
                      <button class="listView-button" @click="tokenView = false; nftView = !nftView" :class="nftView && 'show'">Tokens</button>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
            <!-- account balance and title -->
            <div class="col-xxl-6">
              <div class="token-worth">
                <div>
                  <div class="title">
                    <span>Token Worth</span>
                    <div class="cta">
                      <div class="cta-title">
                        <a :href="goerliScan" target="_blank">
                          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M10.3917 23.8059C10.3917 23.5267 10.4468 23.2502 10.5539 22.9923C10.6609 22.7344 10.8179 22.5003 11.0157 22.3033C11.2135 22.1063 11.4483 21.9503 11.7065 21.8444C11.9648 21.7384 12.2414 21.6845 12.5206 21.6858L16.05 21.6974C16.6127 21.6974 17.1524 21.921 17.5503 22.3191C17.9483 22.7172 18.1718 23.2571 18.1718 23.82V37.1707C18.5694 37.0528 19.0793 36.9272 19.6379 36.7961C20.0258 36.7048 20.3714 36.4851 20.6188 36.1727C20.8662 35.8602 21.0009 35.4734 21.001 35.0748V18.5144C21.001 18.2356 21.0559 17.9596 21.1625 17.702C21.2691 17.4444 21.4254 17.2104 21.6225 17.0132C21.8195 16.8161 22.0535 16.6597 22.3109 16.553C22.5684 16.4462 22.8444 16.3913 23.1231 16.3913H26.6594C27.2222 16.3914 27.7618 16.615 28.1597 17.0131C28.5576 17.4111 28.7812 17.951 28.7813 18.5139V33.8847C28.7813 33.8847 29.6663 33.5261 30.5291 33.1619C30.8494 33.0264 31.1228 32.7994 31.3151 32.5095C31.5074 32.2195 31.61 31.8793 31.6103 31.5314V13.2069C31.6103 12.9282 31.6652 12.6522 31.7718 12.3947C31.8784 12.1371 32.0347 11.9032 32.2317 11.706C32.4287 11.5089 32.6626 11.3526 32.92 11.2459C33.1775 11.1392 33.4534 11.0843 33.732 11.0843H37.2684C37.8312 11.0843 38.3709 11.308 38.7688 11.706C39.1668 12.1041 39.3904 12.644 39.3904 13.2069V28.2961C42.4564 26.0734 45.5637 23.3998 48.0295 20.1852C48.3873 19.7185 48.624 19.1706 48.7186 18.5902C48.8132 18.0098 48.7627 17.415 48.5716 16.8588C46.9032 11.9947 43.7736 7.7649 39.6108 4.74766C35.448 1.73042 30.4552 0.0730622 25.315 0.00220542C11.4543 -0.184057 -0.000936476 11.1346 0.000425111 25.002C-0.0131845 29.39 1.13169 33.7039 3.31929 37.5074C3.62098 38.0277 4.06481 38.451 4.59865 38.7276C5.13249 39.0043 5.73416 39.1228 6.33299 39.0692C7.00204 39.0103 7.83499 38.9271 8.82521 38.8108C9.2562 38.7617 9.65411 38.5558 9.94314 38.2322C10.2322 37.9086 10.3921 37.49 10.3926 37.0561V23.8059"
                              fill="#21325B" />
                            <path
                              d="M10.3146 45.2173C14.0422 47.93 18.4474 49.5583 23.0428 49.922C27.6381 50.2858 32.2444 49.3707 36.3522 47.2781C40.4599 45.1856 43.9089 41.997 46.3176 38.0653C48.7263 34.1336 50.0008 29.6119 50 25.0006C50 24.425 49.9733 23.8558 49.9348 23.2897C40.8051 36.9104 23.948 43.278 10.3144 45.2178"
                              fill="#979695" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="price">$ {{ totalAssets }}</div>
                </div>
              </div>
            </div>
            <div class="col-xxl-6">
              <div class="card">
                <div class="card-body">
                  <div class="token-list">
                    <div class="title">
                      <div class="title-col">
                        <div class="content">
                          <div class="text">Assets</div>
                          <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 9C2.55228 9 3 8.55228 3 8C3 7.44772 2.55228 7 2 7C1.44772 7 1 7.44772 1 8C1 8.55228 1.44772 9 2 9Z"
                              fill="black" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M2 3C2.55228 3 3 2.55228 3 2C3 1.44772 2.55228 1 2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3Z"
                              fill="black" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                              d="M2 15C2.55228 15 3 14.5523 3 14C3 13.4477 2.55228 13 2 13C1.44772 13 1 13.4477 1 14C1 14.5523 1.44772 15 2 15Z"
                              fill="black" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="views">
                      <div class="detail-view">
                        <button class="listView-button" @click="tokenView = false; nftView = !nftView" :class="nftView && 'show'">Tokens</button>
                        <button class="listView-button" @click="nftView = false; tokenView = !tokenView" :class="tokenView && 'show'">NFTs</button>
                      </div>
                    </div>
                  </div>
                  <div class="token-listDetail">
                    <div class="token-table">
                      <div style="overflow: visible; border-radius: 0.75rem;">
                        <WalletTokenList 
                          :tokens="visiableTokens" 
                          :balance="totalAssets.toNumber()"
                        ></WalletTokenList>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
import { useAuthStore } from '@/stores/auth';
import WalletSetup from "@/components/AccountSetup.vue";
import { BigNumber } from "bignumber.js";

const store = useAuthStore();
const user = store.currentUser;
const firstName = user?.displayName!.split(" ")[0];
const lastName = user?.displayName!.split(" ")[-1];
const goerliScan = `https://goerli.etherscan.io/address/${user!.walletAddress}`;
const nftView = ref<boolean>(true);
const tokenView = ref<boolean>(false);
const active_ = ref<string>("");
const isDeployed = ref<boolean>(true);
const loading = ref<boolean>(true);
const tokens = ref<{ [key: string]: Token }>({});
const balance = ref<number>(0);
const chain = "GOERLI";
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

// export default {
//   components: {
//     Layout,
//     WalletTokenList,
//   },
//   data() {
//     const store = useAuthStore();
//     const user = store.currentUser!;
//     const firstName = user?.displayName!.split(" ")[0];
//     const lastName = user?.displayName!.split(" ")[-1];
//     const goerliScan = `https://goerli.etherscan.io/address/${user.walletAddress}`
//     return {
//       user,
//       firstName,
//       lastName,
//       goerliScan,
//       nftView: true,
//       tokenView: false,
//       active_: ""
//     };
//   },
//   methods: {
//   },
// };
</script>