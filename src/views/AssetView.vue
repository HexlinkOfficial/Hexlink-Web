<template>
  <div class="row">
    <div className="row invoice-card-row">
      <!-- account balance and title -->
      <div class="col-xxl-6">
        <div class="token-worth">
          <div>
            <div class="title">
              <span>Token Worth</span>
            </div>
            <div class="price">${{ price }}</div>
            <div style="display: flex; margin-top: 1rem; margin-bottom: 1rem;">
              <router-link 
                :to="sendTo">
                <button class="cta-button" @click="openSend">
                  <img src="@/assets/svg/send.svg" style="margin-right: 5px;" alt="send icon" />
                  Send
                </button>
              </router-link>
              <router-link to="/?action=receive">
                <button class="cta-button">
                  <img src="@/assets/svg/qrCode.svg" style="margin-right: 5px;" alt="qrcode icon" />
                  Receive
                </button>
              </router-link>
            </div>
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
                      <path
                        d="M2 9C2.55228 9 3 8.55228 3 8C3 7.44772 2.55228 7 2 7C1.44772 7 1 7.44772 1 8C1 8.55228 1.44772 9 2 9Z"
                        fill="black" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                      <path
                        d="M2 3C2.55228 3 3 2.55228 3 2C3 1.44772 2.55228 1 2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3Z"
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
                  <button class="listView-button" @click="tokenTransaction = false; tokenView = true"
                    :class="tokenView && 'show'">Tokens</button>
                  <button class="listView-button" @click="tokenView = false; tokenTransaction = true"
                    :class="tokenTransaction && 'show'">Transactions</button>
                </div>
              </div>
            </div>
            <div v-if="tokenView" class="token-listDetail">
              <div class="token-table">
                <div style="overflow: visible; border-radius: 0.75rem;">
                  <WalletTokenList></WalletTokenList>
                </div>
              </div>
            </div>
            <div v-if="tokenTransaction" class="transaction-detail">
              <AssetTransaction></AssetTransaction>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import WalletTokenList from "@/components/WalletTokenList.vue";
import AssetTransaction from "@/components/AssetTransaction.vue";
import { useChainStore } from '@/stores/chain';
import { useAccountStore } from "@/stores/account";
import { useWalletStore } from "@/stores/wallet";
import { BigNumber } from "bignumber.js";
import { connectWallet } from "@/web3/wallet";

const tokenTransaction = ref<boolean>(false);
const tokenView = ref<boolean>(true);
const sendTo = ref<string>("");

const blockExplorer = computed(() => {
  const account = useAccountStore().account?.address;
  return `${useChainStore().chain.blockExplorerUrls[0]}/address/${account}`;
});

const price = computed(() => {
  return BigNumber(0);
});

const openSend = async () => {
  // check if wallet is connected
  const walletStore = useWalletStore();
  // if connected, open send modal
  if (walletStore.connected) {
    sendTo.value = "/?action=send";
  } else {
    // if not connected, connect wallet then open send modal
    sendTo.value = "";
    if (typeof window.ethereum == 'undefined') {
      console.log('MetaMask is not installed!');
    }
    await connectWallet();
    await openSend();
  }
}
</script>

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
  padding: 16px 16px 16px 6px;
  border-radius: 5px;
  width: 100%;
  min-height: 70px;
  justify-content: center;
  align-items: center;
  @media (min-width: 640px) {
    padding: 16px 16px 16px 25px; } }
  .token-worth .title {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-direction: row;
    font-size: 1rem;
    line-height: 1.33;
    color: rgb(138, 147, 165);
    margin-bottom: 4px; }
  .token-worth .price {
    font-family: "sfpro-heavy";
    display: flex;
    justify-content: center;
    font-size: 2rem;
    font-weight: 800;
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
      .token-list .views .detail-view .listView-button:hover {
        opacity: 1;
        color: rgb(7, 106, 224); }
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
.transaction-detail {
  border-radius: 0.75rem;
  margin-top: 1.75rem; }
.invite-content .input-group-text {
  background: #556ee6;
  color: #fff; }
.invite-content .social-share-link {
  margin-top: 15px; }
  .invite-content .social-share-link a {
    display: inline-block;
    margin-right: 10px; }
    .invite-content .social-share-link a i {
      font-size: 20px; }
      .invite-content .social-share-link a i.icofont-facebook {
        color: #3b5998; }
      .invite-content .social-share-link a i.icofont-twitter {
        color: #1da1f2; }
      .invite-content .social-share-link a i.icofont-whatsapp {
        color: #25d366; }
      .invite-content .social-share-link a i.icofont-telegram {
        color: #0088cc; }
.info {
  display: none; }
.cta-button {
  display: flex;
  justify-content: center;
  width: 125px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  margin-right: 5px;
  margin-left: 5px;
  align-items: center;
  color: #000;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 800;
  line-height: 1.25rem;
  border-radius: 50px;
  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem; }
  @media (min-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem; }
  opacity: 1;
  background-color: rgb(7, 106, 224);
  color: white; }
.cta-button:hover {
  background-color: rgba(7, 106, 224, 0.9); }
</style>