<template>
  <Layout :active="1">
    <h1 style="margin-bottom: 1rem;">Red Packet</h1>
    <div class="row">
      <div className="row invoice-card-row">
        <div class="col-xxl-6">
          <div class="card">
            <div v-if="useRoute().params.action.toString() == 'claim' && useRoute().query.id != undefined" class="hidden-layer"></div>
            <div class="card-body">
              <div class="token-list">
                <div class="title">
                  <div class="title-col">
                    <div class="content">
                      <div class="text">Share your love</div>
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
                    <router-link to="/redpacket/claim">
                      <button class="listView-button" @click="luckHistory = true; sendLuck = false" :class="luckHistory && 'show'">Luck
                      History</button>
                    </router-link>
                    <router-link to="/redpacket/send">
                      <button class="listView-button" @click="sendLuck = true; luckHistory = false" :class="sendLuck && 'show'">Send
                        Luck</button>
                    </router-link>
                  </div>
                </div>
              </div>
              <RedPacektHistoryList v-if="useRoute().params.action.toString() != 'send'" :luckHistory="luckHistory" :redPackets="redPackets"></RedPacektHistoryList>
              <RedPacketSend v-if="useRoute().params.action.toString() == 'send'" :sendLuck="sendLuck" @createPacket="createPacket"></RedPacketSend>
            </div>
          </div>
        </div>
      </div>
      <RedPacketClaim v-if="useRoute().params.action.toString() == 'claim' && useRoute().query.id != undefined"></RedPacketClaim>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Layout from "@/components/Layout.vue";
import RedPacektHistoryList from "@/components/RedPacketHistoryList.vue";
import RedPacketSend from "@/components/RedPacketSend.vue";
import RedPacketClaim from "@/components/RedPacketClaim.vue";
import type { RedPacketDB } from '@/graphql/redpacket';
import { useNetworkStore } from '@/stores/network';
import { getRedPacketsByUser } from '@/graphql/redpacket';
import { useRoute } from "vue-router";
import { useProfileStore } from "@/stores/profile";

const sendLuck = ref<boolean>(false);
const luckHistory = ref<boolean>(true);
const redPackets = ref<RedPacketDB[]>([]);
const userId = ref<string>("ming");

const refresh = async function() {
  if (useProfileStore().profile?.initiated) {
    redPackets.value = await loadRedPackets(userId.value);
  }
}

const loadRedPackets = async (userId: string): Promise<RedPacketDB[]> => {
  return await getRedPacketsByUser(userId);
}

onMounted(refresh);
onMounted(() => {
  if(useRoute().params.action.toString() == "send") {
    sendLuck.value = true;
    luckHistory.value = false;
  }
  if (useRoute().params.action.toString() == "claim") {
    sendLuck.value = false;
    luckHistory.value = true;
  }
});

watch(() => useNetworkStore().network, refresh);

const createPacket = () => {
  console.log("hello world!");
}
</script>

<style lang="less" scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  height: calc(100% - 30px);
  min-height: 55vh;
  margin-bottom: 1.875rem;
  transition: all .5s ease-in-out;
  border: 0px solid transparent;
  border-radius: 1rem;
  box-shadow: 0px 5px 5px 0px rgba(82, 63, 105, 0.05); }
.card-body {
  flex: 1 1 auto;
  padding: 20px;
  background: transparent;
  border-radius: 15px; }

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
  align-items: center; }
.token-list .title .title-col .content .text {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  @media (max-width: 768px) {
    width: 9rem; } }
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
    width: 150px; } }
.token-list .views .detail-view .listView-button {
  opacity: 1;
  background-color: rgba(7, 106, 224, 0);
  color: rgb(71, 85, 105); }
.token-list .views .detail-view .listView-button.show {
  opacity: 1;
  background-color: rgb(7, 106, 224);
  color: white; }
</style>