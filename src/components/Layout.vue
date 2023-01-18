<template>
  <RedPacketClaim v-if="showClaim()"></RedPacketClaim>
  <RedpacketConform v-if="useRedPacketStore().packetStatus"></RedpacketConform>
  <div v-if="showClaim() || showConfirm" class="hidden-layer"></div>
  <div id="main-wrapper" class="show" :class="(showClaim() || showConfirm) && 'mobile-modal'">
    <Header />
    <SideBar :active="active" />
    <div class="content-body">
      <div class="container">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import Header from './Header.vue';
import SideBar from './Sidebar.vue';
import RedPacketClaim from "@/components/RedPacketClaim.vue";
import RedpacketConform from "@/components/RedPacketConfirm.vue";
import { useRedPacketStore } from '@/stores/redpacket';
import { useNetworkStore } from '@/stores/network';
import { useRoute } from "vue-router";

const props = defineProps({
  active: Number
});

const showConfirm = ref<boolean>(false);

const showClaim = () => {
  if (useRoute().params.action?.toString() == 'claim' && useRoute().query.id != undefined) return true;
}

// const showConform = () => {
//   showConfirm.value = true;
// }

// const showConfirm = () => {
//   if (useRoute().params.action?.toString() == 'send' && useRoute().query.id == "confirm") return true;
// }
// onMounted(() => {
//   console.log(useRedPacketStore().redpacket);
// })
// watch(() => useRedPacketStore()[useNetworkStore().network!.name].status, showConform);
</script>

<style lang="less" scoped>
#main-wrapper {
  opacity: 0;
  transition: all 0.25s ease-in;
  overflow: hidden;
  position: relative;
  z-index: 1;
  padding-top: 100px; }
#main-wrapper.show {
  opacity: 1; }
.content-body {
  margin-left: 9.5rem; }
@media only screen and (max-width: 990px) {
  .content-body {
    margin-left: 0px;
    margin-bottom: 50px; } }
.hidden-layer {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 50; }
.mobile-modal {
  @media (max-width: 768px) {
    position: fixed; } }
</style>