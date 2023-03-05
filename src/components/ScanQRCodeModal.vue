<template>
    <div class="modal-mask">
        <div class="scan-qr-code-card">
            <router-link to="/">
                <img class="scan-qr-code-close" src="@/assets/svg/closeButton.svg" alt="close button"/>
            </router-link>
            <div class="content-box">
                <h2 class="title">Setup Hexlink Auth App</h2>
                <div class="qrcode">
                    <canvas id="canvas" style="height: 200px; width: 200px;"></canvas>
                </div>
                <p class="sending-reminder">1. Download Hexlink Auth App from App Store<br>2. Scan the QR code from Auth App</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAccountStore } from "@/stores/account";
import QRCode from "qrcode";

onMounted(() => {
    genQrCode();
})

const genQrCode = async () => {
    let walletAddress = useAccountStore().account?.address;
    let canvas = document.getElementById('canvas')
    await QRCode.toCanvas(canvas, walletAddress, { margin: '2', scale: '8', width: '400px' });
}
</script>

<style lang="less" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.scan-qr-code-card {
background-color: #fff;
height: auto;
width: auto;
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
.scan-qr-code-close {
position: absolute;
z-index: 50;
margin: 0.5rem 0;
right: 0.5rem; }
.content-box {
display: flex;
align-items: center;
justify-content: center;
padding: 1rem 0 1rem 0;
flex-direction: column;
padding-left: 30px;
padding-right: 30px;
width: auto;
height: auto;
margin-top: 20px; }
.title {
font-size: 1.5rem;
font-weight: 600; }
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
width: auto;
height: auto;}
.sending-reminder {
padding: 0 10px;
margin-bottom: 0rem;
font-size: 12px;
text-align: left;
margin-top: 10px;
color: rgba(0, 0, 0, 0.6);
font-weight: 500; }
</style>