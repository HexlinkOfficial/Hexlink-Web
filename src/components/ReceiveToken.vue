<template>
  <div class="receive-card transition">
    <router-link to="/">
      <img class="redpacket_close transition" src="@/assets/svg/closeButton.svg" alt="close button"/>
    </router-link>
    <div class="content-box">
      <h2 class="title">Receive tokens</h2>
      <div>
        <img :src="useTokenStore().nativeCoin.logoURI" style="width: 25px; height: 25px;" />
        <span style="margin-left: 0.5rem;">{{ useChainStore().chain.fullName }}</span>
      </div>
      <p class="or"></p>
      <div class="qrcode">
        <canvas id="canvas" style="height: 200px; width: 200px;"></canvas>
        <p class="qrcode-address">{{ useAccountStore().account?.address }}</p>
      </div>
      <p class="or"></p>
      <p class="sending-reminder">Send only token on {{ useChainStore().chain.name }} network(id: {{ useChainStore().chain.chainId }}) to this address.<br>Sending tokens from other chains may result in permanent loss.</p>
      <div style="display: flex; justify-content: center;">
        <button @click="copy(useAccountStore().account?.address!, 'Claim URL Copied')" class="cta-button">Copy</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTokenStore } from "@/stores/token";
import { useAccountStore } from "@/stores/account";
import { useChainStore } from "@/stores/chain";
import QRCode from "qrcode";
import { copy } from "@/web3/utils";

onMounted(() => {
  genQrCode();
})

const genQrCode = async () => {
  let walletAddress = useAccountStore().account?.address;
  let canvas = document.getElementById('canvas')
  await QRCode.toCanvas(canvas, walletAddress, { margin: '2', scale: '6', width: '200px' });
}
</script>

<style lang="less" scoped>
.sending-reminder {
  padding: 0 10px;
  margin-bottom: 0rem;
  font-size: 12px;
  text-align: center;
  margin-top: 10px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500; }
.qrcode-address {
  word-wrap: break-word;
  width: 200px;
  font-size: 12px;
  text-align: center;
  margin-bottom: 10px; }
.title {
  font-size: 1.5rem;
  font-weight: 600; }
.content-box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0 1rem 0;
  flex-direction: column;
  margin-top: 20px; }
.cta-button {
  background-color: rgb(7, 106, 224);
  color: white;
  padding: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 250px;
  border-radius: 50px;
  border: none; }
.qrcode {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  overflow: hidden;
  margin: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  width: 210px; }
.receive-card {
  background-color: #fff;
  height: auto;
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
    top: 47vh;
    left: 50%; } }
.transition {
  transition: .3s cubic-bezier(.3, 0, 0, 1.3) }
.redpacket_close {
  position: absolute;
  z-index: 50;
  margin: 0.5rem 0;
  right: 0.5rem; }
.or {
    text-align: center;
    font-weight: bold;
    width: 90%;
    border-bottom: 1px solid #f5efef;
    line-height: 0.1em;
    margin-top: 10px;
    margin-bottom: 10px; }
</style>