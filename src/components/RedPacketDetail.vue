<template>
  <div class="claim-card transition">
    <router-link to="/airdrop">
      <svg class="redpacket_close transition" width="30" height="30" viewBox="0 0 30 30" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4.3949 4.39481C6.84957 1.94033 10.0794 0.412944 13.534 0.0729118C16.9886 -0.267121 20.4542 0.601242 23.3403 2.53003C26.2264 4.45882 28.3544 7.32869 29.3617 10.6506C30.3691 13.9725 30.1933 17.541 28.8645 20.7479C27.5357 23.9547 25.136 26.6016 22.0743 28.2375C19.0127 29.8734 15.4785 30.3971 12.074 29.7193C8.66957 29.0415 5.60545 27.2041 3.40381 24.5204C1.20218 21.8366 -0.000751884 18.4724 6.47942e-06 15.0011C-0.001827 13.0309 0.38547 11.0798 1.13966 9.25966C1.89386 7.43954 3.0001 5.78629 4.3949 4.39481ZM18.8931 9.52218L20.4875 11.119C20.6687 11.3019 20.7703 11.5489 20.7703 11.8063C20.7703 12.0637 20.6687 12.3107 20.4875 12.4936L17.9702 15.0011L20.4875 17.5184C20.6687 17.7013 20.7703 17.9483 20.7703 18.2057C20.7703 18.4632 20.6687 18.7102 20.4875 18.8931L18.8931 20.4874C18.7103 20.6686 18.4633 20.7702 18.2058 20.7702C17.9484 20.7702 17.7014 20.6686 17.5185 20.4874L15.0012 17.9701L12.4839 20.4874C12.3011 20.6686 12.054 20.7702 11.7966 20.7702C11.5392 20.7702 11.2922 20.6686 11.1093 20.4874L9.52227 18.8931C9.34111 18.7102 9.23948 18.4632 9.23948 18.2057C9.23948 17.9483 9.34111 17.7013 9.52227 17.5184L12.0322 15.0011L9.52227 12.4838C9.34111 12.301 9.23948 12.054 9.23948 11.7965C9.23948 11.5391 9.34111 11.2921 9.52227 11.1092L11.1093 9.52218C11.2922 9.34102 11.5392 9.23939 11.7966 9.23939C12.054 9.23939 12.3011 9.34102 12.4839 9.52218L15.0012 12.0321L17.5185 9.52218C17.7014 9.34102 17.9484 9.23939 18.2058 9.23939C18.4633 9.23939 18.7103 9.34102 18.8931 9.52218ZM15.0012 2.57337C12.1254 2.57351 9.33867 3.57077 7.11573 5.39526C4.8928 7.21974 3.37125 9.75854 2.81034 12.5791C2.24942 15.3997 2.68385 18.3274 4.03959 20.8636C5.39533 23.3998 7.58851 25.3874 10.2454 26.4878C12.9024 27.5882 15.8586 27.7333 18.6106 26.8984C21.3625 26.0635 23.7398 24.3002 25.3374 21.9091C26.935 19.5179 27.6541 16.6467 27.3721 13.7848C27.0901 10.9228 25.8246 8.24723 23.791 6.2138C22.6373 5.05871 21.2671 4.14257 19.7588 3.51788C18.2505 2.8932 16.6338 2.57223 15.0012 2.57337Z"
          fill="white" />
      </svg>
    </router-link>
    <!-- <button class="withdraw-button">
      <span style="padding: 5px;">Withdraw</span>
    </button> -->
    <div class="card_circle transition"></div>
    <h2 class="transition">
      <span>
        Sent by @{{ redPacket?.creator?.handle }}
        <a class="twitter-link" :href="'https://twitter.com/' + redPacket?.creator?.handle">
          <i className="fa fa-twitter"></i>
        </a>
      </span>
      <small style="margin-top: 0.5rem;">Best Wishes!</small>
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
                <a-tooltip placement="top">
                  <template #title>
                    <span>
                      Amount: {{ normalizeBalance(v.claimed!.toString(), redPacket!.token!.decimals).normalized }}
                    </span>
                  </template>
                  {{ normalizeBalance(v.claimed!.toString(), redPacket!.token!.decimals).normalized.substring(0, 5) }}
                </a-tooltip>
                <div class="token-icon" style="margin-right: 0.25rem; margin-left: 0.25rem;">
                  <img src="https://token.metaswap.codefi.network/assets/networkLogos/ethereum.svg">
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
import { getRedPacket } from '@/graphql/redpacket';
import { getRedPacketClaims } from '@/graphql/redpacketClaim';
import Loading from "@/components/Loading.vue";
import { loadAndSetErc20Token } from '@/web3/tokens';

const redPacket = ref<RedPacketDB | undefined>();
const claimers = ref<RedPacketClaim[]>();
const loading = ref<boolean>(true);

const loadData = async function() {
  loading.value = true;
  const id = useRoute().query.details!.toString();
  redPacket.value = await getRedPacket(id);
  if (redPacket.value) {
    redPacket.value.token = await loadAndSetErc20Token(
      redPacket.value.metadata.token
    );
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
  margin-top: 130px;
  position: fixed;
  z-index: 55;
  font-size: 18px;
  color: #000;
  width: 100%; }
.claim-card h2 small {
  font-weight: normal;
  font-size: 65%;
  color: rgba(0, 0, 0, 0.5); }
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