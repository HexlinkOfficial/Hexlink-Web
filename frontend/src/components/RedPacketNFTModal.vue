<template>
  <div class="send-token-card transition">
    <router-link to="/airdrop">
      <img class="redpacket_close transition" src="@/assets/svg/closeButton.svg" alt="close button" />
    </router-link>
    <div style="display: block; padding: 1rem 0 1rem 0;">
      <div style="padding: 0 1rem; margin-top: 2rem;">
        <AirdropNFTSend></AirdropNFTSend>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AirdropNFTSend from '@/components/AirdropNFTSend.vue';
</script>

<style lang="less" scoped>
.send-token-card {
  background-color: #fff;
  height: 600px;
  width: 600px;
  max-width: 90vw;
  position: fixed;
  margin: auto;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 10px 20px rgb(0 0 0 / 10%);
  border-radius: 15px;
  overflow-y: scroll;
  overflow-x: hidden;
  z-index: 55;
  @media (max-width: 990px) {
    top: 50vh;
    left: 50%; } }
.transition {
  transition: .3s cubic-bezier(.3, 0, 0, 1.3) }
.redpacket_close {
  position: absolute;
  z-index: 50;
  margin: 0.5rem 0;
  right: 0.5rem; }
.people-title {
  color: #0c0c0d;
  font-size: 1.75rem;
  line-height: 2.25rem;
  font-weight: 500;
  margin-top: 0px;
  margin-left: 20px;
  margin-top: 10px; }
</style>