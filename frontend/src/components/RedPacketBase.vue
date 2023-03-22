<template>
    <div class="row">
        <div className="row invoice-card-row">
            <div class="col-xxl-6">
                <div class="airdrop-status">
                    <div>
                        <div class="status-box">
                            <div style="margin: 0 10px;">
                                <div class="title">
                                    <span v-if="!loading">{{ statusTitle }}</span>
                                </div>
                                <div class="price">
                                    <Loading v-if="loading" class="loading" />
                                    <span v-if="!loading">{{ statusData }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="cta-box">
                            <router-link :to="airdropToken">
                                <button class="cta-button" @click="openSend('token')">
                                    <img src="@/assets/svg/coin.svg" alt="token icon"/>
                                    Airdrop Token
                                </button>
                            </router-link>
                            <router-link :to="airdropToken">
                                <button class="cta-button" @click="openSend('nft')">
                                    <img src="@/assets/svg/picture.svg" alt="picture icon" />
                                    Airdrop NFT
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
                            <div class="text">Airdrop</div>
                            <img src="@/assets/svg/colon.svg"/>
                            </div>
                        </div>
                        </div>
                    </div>
                    <slot></slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
// import { send } from "process";
import { onMounted, ref, watch } from "vue";
import Loading from "@/components/Loading.vue";
import { useStatusStore } from '@/stores/airdropStatus';
import { useWalletStore } from '@/stores/wallet';
import { connectWallet } from "@/web3/wallet";
import { connectWalletConnect } from "@/web3/walletconnect"

const airdropToken = ref<string>("");
const statusTitle = ref<string>("Total Created");
const statusData = ref<string | undefined>("0");
const loading = ref<boolean>(true);

const openSend = async (to: string) => {
    // check if wallet is connected
    const walletStore = useWalletStore();
    // if connected, open send modal
    if (walletStore.connected) {
        if (to == 'token') airdropToken.value = "/airdrop?action=send";
        if (to == 'nft') airdropToken.value = "/airdrop?action=airdropNFT";
    } else {
        // if not connected, connect wallet then open send modal
        airdropToken.value = "";
        if (typeof window.ethereum == 'undefined') {
            console.log('MetaMask is not installed!');
        }
        await connectWallet();
        await openSend(to);
    }
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const loadData = async () => {
    loading.value = true;
    if (useStatusStore().airdropStatus[0]) {
        statusTitle.value = Object.keys(useStatusStore().airdropStatus[0])[0].toString();
        statusData.value = Object.values(useStatusStore().airdropStatus[0])[0]?.toString();
    } else {
        statusTitle.value = "Total Created";
        statusData.value = "0";
    }
    await delay(2000);
    loading.value = false;
}

onMounted(async () => {
    await loadData();
})

watch(() => useStatusStore().airdropStatus, async () => await loadData());
</script>
  
<style lang="less" scoped>
.status-box {
    display: flex;
    align-items: center;
    justify-content: center; }
.loading {
    margin-top: -20px;
    margin-bottom: 20px;
    padding: 0px; }
.cta-box {
    display: flex;
    margin-top: 1rem;
    margin-bottom: 1rem; }
.cta-button {
  display: flex;
  justify-content: center;
  width: 180px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  margin-right: 2.5px;
  margin-left: 2.5px;
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
.cta-button img {
    margin-right: 5px;
    width: 19px;
    height: 19px; }
.airdrop-status {
    display: flex;
  flex-direction: row;
  padding: 16px 16px 16px 16px;
  border-radius: 5px;
  width: 100%;
  min-height: 70px;
  justify-content: center;
  align-items: center;
  @media (min-width: 640px) {
    padding: 16px 16px 16px 25px; } }
.airdrop-status .title {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-direction: row;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.33;
    color: rgb(138, 147, 165);
    margin-bottom: 4px; }
.airdrop-status .price {
    font-family: "sfpro-heavy";
    display: flex;
    justify-content: center;
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.33;
    color: black;
    margin-right: auto;
    word-break: keep-all; }
.card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    height: calc(100% - 30px);
    min-height: 50vh;
    margin-bottom: 1.875rem;
    transition: all .5s ease-in-out;
    border: 0px solid transparent;
    border-radius: 1rem;
    box-shadow: 0px 5px 5px 0px rgba(82, 63, 105, 0.05); }
.card-body {
    flex: 1 1 auto;
    padding: 20px;
    background: transparent;
    border-radius: 15px;
}
  
  @media only screen and (max-width: 575px) {
.card {
      margin-bottom: 0.938rem;
      height: calc(100% - 0.938rem); }
.card-body {
      padding: 1rem; } }
.hidden-layer {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    position: absolute;
    border-radius: 15px;
    z-index: 55; }
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
    align-items: center;
    @media (max-width: 640px) {
        margin-left: 0rem;  }}
.token-list .title .title-col .content .text {
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 600; }
.token-list .title .title-col .content img {
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
    padding: 0.125rem;
    transition-property: background-color, border-color, color, fill, stroke;
    border-radius: 50px;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(71, 85, 105);
    @media (min-width: 640px) {
      margin-left: 0.75rem;
      margin-left: 0.875rem;
      max-width: 30rem; } }
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
      width: 150px; } }
    .token-list .views .detail-view .listView-button {
    opacity: 1;
    background-color: rgba(7, 106, 224, 0);
    color: rgb(71, 85, 105); }
    .token-list .views .detail-view .listView-button:hover {
    opacity: 1;
    color: rgb(7, 106, 224); }
.token-list .views .detail-view .listView-button.show {
    opacity: 1;
    background-color: rgb(7, 106, 224);
    color: white; }
</style>