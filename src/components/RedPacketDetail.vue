<template>
  <div class="claim-card transition">
    <router-link to="/airdrop">
      <img class="redpacket_close transition" src="@/assets/svg/closeButton.svg"/> 
    </router-link>
    <!-- <button class="withdraw-button">
      <span style="padding: 5px;">Withdraw</span>
    </button> -->
    <!-- <div class="card_circle transition"></div> -->
    <div style="display: flex; align-items: center; justify-content: center; padding: 20px; margin-top: 20px;">
      <img src="@/assets/svg/gift.svg"/>
    </div>
    <h2 class="transition">
      <span>
        Sent by @{{ redPacket?.creator?.handle }}
        <a class="twitter-link" :href="'https://twitter.com/' + redPacket?.creator?.handle">
          <i className="fa fa-twitter"></i>
        </a>
      </span>
      <div style="padding: 5px;">
        <img src="https://i.postimg.cc/RhXfgJR1/gas-pump.png" data-v-c8c9ceac="" style="width: 20px; height: 20px;">
        <span style="font-size: 15px;">Gas left: </span>
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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { normalizeBalance } from "../../functions/common";
import type { Token } from "../../functions/common";
import type { RedPacketDB, RedPacketClaim } from "@/types";
import { getRedPacket, getRedPacketPrivate } from '@/graphql/redpacket';
import { getRedPacketClaims } from '@/graphql/redpacketClaim';
import Loading from "@/components/Loading.vue";
import { loadAndSetErc20Token } from '@/web3/tokens';
import type { RedPacket, RedPacketErc721 } from "../../functions/redpacket";
import { queryErc721TokenId } from "@/web3/redpacket";

const redPacket = ref<RedPacketDB | undefined>();
const claimers = ref<RedPacketClaim[]>();
const loading = ref<boolean>(true);
const claimItem = ref<string>("");

const loadData = async function() {
  loading.value = true;
  const id = useRoute().query.details!.toString();
  redPacket.value = await getRedPacket(id);
  console.log(redPacket.value);
  if (redPacket.value) {
    if (redPacket.value.type === 'erc20') {
      claimItem.value = 'erc20';
      redPacket.value.token = await loadAndSetErc20Token(
        (redPacket.value.metadata as RedPacket).token
      );
      console.log(redPacket.value.token.logoURI);
    } else if (redPacket.value.type === 'erc721') {
      claimItem.value = 'erc721';
    }
    claimers.value = await getRedPacketClaims(id);
    console.log(claimers.value);
  }
  loading.value = false;
};

onMounted(loadData);
</script>

<style lang="less" scoped>
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
  margin-top: 30px;
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