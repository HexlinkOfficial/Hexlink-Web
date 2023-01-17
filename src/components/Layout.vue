<template>
  <RedPacketClaim v-if="showClaim()"></RedPacketClaim>
  <RedpacketConform v-if="showConform()"></RedpacketConform>
  <div v-if="showClaim() || showConform()" class="hidden-layer"></div>
  <div id="main-wrapper" class="show">
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
import Header from './Header.vue';
import SideBar from './Sidebar.vue';
import RedPacketClaim from "@/components/RedPacketClaim.vue";
import RedpacketConform from "@/components/RedPacketConfirm.vue";
import { useRoute } from "vue-router";

const props = defineProps({
  active: Number
});

const showClaim = () => {
  if (useRoute().params.action?.toString() == 'claim' && useRoute().query.id != undefined) return true;
}

const showConform = () => {
  if (useRoute().params.action?.toString() == 'send' && useRoute().query.id == 'confirm') return true;
}
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
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  z-index: 50; }
</style>