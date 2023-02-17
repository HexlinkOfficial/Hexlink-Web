<template>
  <div class="claim-card transition">
    <router-link to="/">
      <img class="redpacket_close transition" src="@/assets/svg/closeButton.svg" alt="close button"/>
    </router-link>
    <div style="display: flex; align-items: center; justify-content: center; padding: 1rem 0 1rem 0;">
      <h2 style="font-size: 1.5rem; font-weight: 600;">Receive ETH</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="less" scoped>
.claim-card {
  background-color: #fff;
  height: 400px;
  width: 90vw;
  max-width: 400px;
  position: fixed;
  margin: auto;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 10px 20px rgb(0 0 0 / 10%);
  border-radius: 15px;
  overflow: visible;
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
</style>