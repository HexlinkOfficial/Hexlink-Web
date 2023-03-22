<template>
  <div class="claim-card transition">
    <router-link to="/airdrop">
      <img class="redpacket_close transition" src="@/assets/svg/closeButton.svg"/> 
    </router-link>
    <!-- <button class="withdraw-button">
      <span style="padding: 5px;">Withdraw</span>
    </button> -->
    <!-- <div class="card_circle transition"></div> -->
    <div class="gift-icon">
      <img src="@/assets/svg/gift.svg"/>
    </div>
    <h2 class="transition">
      <span style="margin-top: -10px; font-size: 15px; font-weight: 600;">From</span>
      <span style="display: flex; margin: 5px 0px; align-items: center;">
        {{ checkIfEmail() ? "" : "@" }}
        <span class="sender" @click="copy(redPacket?.creator?.handle ? redPacket?.creator?.handle! : '', 'Copied!')">
          <b>{{ prettyPrint(redPacket?.creator?.handle ? redPacket?.creator?.handle! : "Anonymous", 30, 4, -10)}}</b>
        </span>
        <a v-if="!checkIfEmail()" class="twitter-link" :href="'https://twitter.com/' + redPacket?.creator?.handle" style="margin-left: 5px;">
          <i className="fa fa-twitter"></i>
        </a>
      </span>
      <div style="padding: 5px 5px 5px 5px; display: flex; align-items: center;">
        <img src="https://i.postimg.cc/RhXfgJR1/gas-pump.png" data-v-c8c9ceac="" style="width: 20px; height: 20px;">
        <span style="font-size: 15px;">
          Gas left: {{ gasLeftNormalized }}
        </span>
        <img src="https://token.metaswap.codefi.network/assets/networkLogos/ethereum.svg" height="20" style="margin-left:0.5rem;margin-right:0.5rem;" data-v-c970699f="">
      </div>
      <div>
        <button
          class="cta-button"
          style="background: #D9D9D9;"
          @mouseover="buttonText = 'Coming soon'"
          @mouseleave="buttonText = 'Refund'"
        >
          {{ buttonText }}
        </button>
      </div>
      <div v-if="loading" class="claimers-list">
        <Loading style="margin-top: 25%;"/>
      </div>
      <div v-if="!loading && claimers?.length == 0" class="claimers-list">
        <div style="text-align: center;margin-top: 25%;">You have no luck history yet! Go send some luck~</div>
      </div>
      <div v-if="!loading" class="claimers-list">
        <div class="claimer-card" v-for="(v, i) in claimers" :key="i">
          <div class="profile-pic">
            <div class="thumb">
              <img
                :src="v.claimer.logoURI ? v.claimer.logoURI : 'https://i.postimg.cc/15QJZwkN/profile.png'"
                :size="64" referrerpolicy="no-referrer" />
            </div>
          </div>
          <div class="profile-info">
            <div class="profile-username">
              <div>
                {{ v.claimer.displayName }}
                <a class="twitter-link" :href="'https://twitter.com/' + redPacket!.creator!.handle">
                  <i className="fa fa-twitter"></i>
                </a>
              </div>
              <div class="claimed-amount">
                <div v-if="claimItem == 'erc20'" style="display: flex; align-items: center;">
                  <a-tooltip placement="top">
                    <template #title>
                      <span>
                        Amount: {{ normalizeBalance(v.claimed!.toString(), redPacket!.token!.decimals).normalized }}
                      </span>
                    </template>
                    {{ normalizeBalance(v.claimed!.toString(), redPacket!.token!.decimals).normalized.substring(0, 7) }}
                  </a-tooltip>
                  <div class="token-icon" style="margin-right: 0.25rem; margin-left: 0.25rem;">
                    <img :src="redPacket?.token?.logoURI">
                  </div>
                </div>
                <div v-if="claimItem == 'erc721'">
                  <span>{{ v.claimed }}</span>
                </div>
              </div>
            </div>
            <div class="claim-date">@{{ v.claimer.handle }}</div>
          </div>
        </div>
      </div>
    </h2>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { normalizeBalance } from "../../../functions/common";
import type { RedPacketDB, RedPacketClaim } from "@/types";
import { getRedPacket } from '@/graphql/redpacket';
import { getRedPacketClaims } from '@/graphql/redpacketClaim';
import Loading from "@/components/Loading.vue";
import { loadAndSetErc20Token } from '@/web3/tokens';
import type { RedPacket } from "../../../functions/redpacket";
import { queryRedPacketInfo, queryErc721RedPacketInfo, refundRedPacket } from "@/web3/redpacket";
import { BigNumber } from "bignumber.js";
import { useChainStore } from "@/stores/chain";
import { checkIfEmail, prettyPrint } from '@/services/util';
import { copy } from "@/web3/utils";

const redPacket = ref<RedPacketDB | undefined>();
const claimers = ref<RedPacketClaim[]>();
const loading = ref<boolean>(true);
const claimItem = ref<string>("");
const gasLeft = ref<string>("");
const showRefund = ref<boolean>(false);
const timeLeft = ref<number>(0);
const buttonText = ref<string>("Refund");
const balanceLeft = ref<string>("");

const loadData = async function() {
  loading.value = true;
  const id = useRoute().query.details!.toString();
  redPacket.value = await getRedPacket(id);
  if (redPacket.value) {
    if (redPacket.value.type === 'erc20') {
      claimItem.value = 'erc20';
      balanceLeft.value = (await queryRedPacketInfo(redPacket.value)).balanceLeft;
      gasLeft.value = (await queryRedPacketInfo(redPacket.value)).sponsorship;
      redPacket.value.token = await loadAndSetErc20Token(
        (redPacket.value.metadata as RedPacket).token
      );
    } else if (redPacket.value.type === 'erc721') {
      claimItem.value = 'erc721';
      balanceLeft.value = (await queryErc721RedPacketInfo(redPacket.value.metadata.token)).balanceLeft;
      gasLeft.value = (await queryErc721RedPacketInfo(redPacket.value.metadata.token)).sponsorship;
    }
    claimers.value = await getRedPacketClaims(id);
  }
  // check if show refund button
  let dateTime = new Date().getTime();
  if ((dateTime - redPacket.value?.createdAt.getTime()!) > 86400000) {
    if (balanceLeft.value == "0" && gasLeft.value == "0") {
      showRefund.value = false;
    } else {
      showRefund.value = true;
    }
    timeLeft.value = 0;
  } else {
    showRefund.value = false;
    timeLeft.value = (dateTime - redPacket.value?.createdAt.getTime()!) / 24 / 60;
  }
  showRefund.value = false;
  loading.value = false;
};

const refund = async() => {
  await refundRedPacket(
    useChainStore().chain,
    redPacket.value!
  );
}

const gasLeftNormalized = computed(() => {
  return BigNumber(gasLeft.value).div(new BigNumber(10).pow(18)).dp(6).toString();
})

onMounted(loadData);
</script>

<style lang="less" scoped>
.sender {
  margin-bottom: 0;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  background-color: #F3F4F6;
  font-size: 1rem;
  line-height: 1.25rem;
  border-radius: 0.5rem; }
.cta-button {
  margin-top: 10px;
  padding: 8px;
  font-size: 0.75rem;
  font-weight: 800;
  line-height: 1rem;
  min-width: 100px;
  border-radius: 50px;
  opacity: 1;
  background-color: #076ae0;
  color: white; }
.gift-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-top: 20px; }
.withdraw-button {
  position: absolute;
  z-index: 50;
  margin: 0.5rem 0;
  left: 0.5rem;
  padding: 5px 5px;
  background: white;
  color: #FD4755;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 800; }
.thumb {
  display: flex;
  overflow: hidden;
  width: 40px;
  height: 40px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  &:hover {
    transform: translateY(-0.125rem); } }
.thumb img {
  border-radius: 50px;
  max-width: 30px; }
.claim-date {
  font-size: 12px;
  display: flex;
  justify-content: flex-start;
  color: rgba(7, 16, 27, 0.5); }
.claimed-amount {
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500; }
.profile-username {
  display: flex;
  justify-content: space-between;
  font-size: 15px; }
.profile-info {
  display: flex;
  width: 85%;
  flex-direction: column;
  justify-content: center;
  margin-right: 10px; }
.profile-pic {
  width: 15%;
  display: block;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center; }
.claimer-card {
  height: 60px;
  display: flex;
  border-top: 1px solid #e5e7eb; }
.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 55px;
  border-width: 1px;
  background-color: #FD4755; }
.claimers-list {
  width: 95%;
  height: 250px;
  margin-top: 20px;
  overflow: auto; }
.claim-card {
  background-color: #fff;
  height: 480px;
  width: 360px;
  position: fixed;
  margin: auto;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 10px 20px rgb(0 0 0 / 10%);
  border-radius: 15px;
  overflow: hidden;
  z-index: 55; 
  @media (max-width: 990px) {
    top: 50vh;
    left: 50%; }}
.claim-card h2 {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  position: fixed;
  z-index: 55;
  font-size: 18px;
  color: #000;
  width: 100%; }
.transition {
  transition: .3s cubic-bezier(.3, 0, 0, 1.3) }
.redpacket_close {
  position: absolute;
  z-index: 50;
  margin: 0.5rem 0;
  right: 0.5rem; }
.card_circle {
  height: 480px;
  width: 540px;
  background-color: #FD4755;
  position: absolute;
  border-radius: 50%;
  margin-left: -25%;
  margin-top: -370px; }
</style>