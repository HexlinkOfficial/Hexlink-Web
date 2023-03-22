<template>
    <div class="share-card" @wheel.prevent @touchmove.prevent @scroll.prevent>
        <div class="header">
            <RouterLink to="/">
                <img src="@/assets/svg/logo-beta2.svg" alt="" class="logo" />
            </RouterLink>
        </div>
        <div class="body">
            <div v-if="redPacket == undefined">
                <h2>Invalid airdrop link</h2>
                <p>Please double check the airdrop link</p>
            </div>
            <div v-if="redPacket != undefined" class="qr-section">
                <div class="title">
                    <img class="owner-logo" :src="redPacket.creator?.logoURI">  
                    <div class="owner"> 
                        <span class="owner-name-title">{{ redPacketOwnerName }}</span>
                        <span class="owner-handle">@{{redPacketOwnerHandle}}</span>
                    </div>
                </div>
                <h2>🔥 Claim Your Airdrop 🔥</h2>
                <h2 style="color: #076ae0;">WITHOUT CONNECTING WALLET</h2>
                <div class="qrcode">
                    <canvas id="canvas"></canvas>
                </div>
                <p class="or"><span>or copy the claim link</span></p>
                <button class="cta-btn" @click="copy(claimUrl, 'C laim URL Copied')" style="margin-bottom: 50px;">Copy</button>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { getRedPacketPrivate } from "@/graphql/redpacket";
import type { RedPacketDB } from "@/types";
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router';
import { genTotpCode } from "../../../functions/common";
import QRCode from "qrcode";
import { copy } from "@/web3/utils";

const secret = ref<string | undefined>();
const redPacket = ref<RedPacketDB | undefined>();
const redPacketOwnerName = ref<string | undefined>();
const redPacketOwnerHandle = ref<string | undefined>();
const claimUrl = ref<string>("");
let countDown = ref<number>(5);
let canvasRendered = false;

onMounted(async () => {
    const route = useRoute();
    const redPacketId = route.params.id;
    redPacket.value = await getRedPacketPrivate(redPacketId as string);
    redPacketOwnerName.value = redPacket.value?.creator?.displayName;
    redPacketOwnerHandle.value = redPacket.value?.creator?.handle;
    const validationRules = redPacket.value?.metadata.validationRules || [];
    const validationData = redPacket.value?.validationData || [];
    for (const index in validationRules) {
        const rule = validationRules[index];
        const data = validationData[index];
        if (rule.type === "dynamic_secrets") {
            secret.value = data.secret;
        }
    }
    await genQrCode();
});

async function delay(ms: number) {
  return new Promise((resolve, _reject) => {
    window.setTimeout(() => resolve(null), ms);
  });
}

const genQrCode = async() => {
    let url = window.location.origin + `/airdrop?claim=${redPacket.value?.id}`;
    if (secret.value) {
        url += `&otp=${genTotpCode(secret.value)}`;
    }
    claimUrl.value = url;
    var canvas = document.getElementById('canvas');
    if (canvas == null) {
        return;
    } else {
        canvasRendered = true;
    }
    await QRCode.toCanvas(canvas, url);

    let context = canvas.getContext("2d");  
    const image = new Image();

    image.src = redPacket.value?.creator?.logoURI;
    image.crossOrigin = 'anonymous';
    image.onload = () => {
        const coverage = 0.15;
        const width = Math.round(canvas.width * coverage);
        const x = (canvas.width - width) / 2;
        let y = x;
        let height = width;
        let radius = 4; 
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 2;
        context.shadowBlur = 4;
        context.shadowColor = '#00000040';
        context.lineWidth = 8;
        context.beginPath();
        context.moveTo(x + radius, y);
        context.arcTo(x + width, y, x + width, y + height, radius);
        context.arcTo(x + width, y + height, x, y + height, radius);
        context.arcTo(x, y + height, x, y, radius);
        context.arcTo(x, y, x + width, y, radius);
        context.closePath();
        context.strokeStyle = '#fff';
        context.stroke();
        context.clip();
        context.fillStyle = '#fff';
        context.fillRect(x, x, width, height);
        context.drawImage(image, x, x, width, height);
    };
}

const refreshQrCode = async () => {
    await genQrCode();
    await countDownTimer(canvasRendered ? 30 : 0.1);
    await refreshQrCode();
}

async function countDownTimer(total: number) {
    countDown.value = total;
    while(countDown.value > 0) {
        await delay(1000);
        countDown.value -= 1;
    }
}

onMounted(refreshQrCode);
</script>

<style lang="less" scoped>
.logo {
    height: 40px;
    margin: 30px;
    overflow: visible;
    @media (max-width: 640px) {
    margin: 20px;
    height: 30px; } }
.qrcode {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    overflow: hidden;
    margin: 20px;
    margin-bottom: calc(1rem + 10px);
    width: 200px;
    height: 200px; }
.airdrop-logo {
    width: auto;
    height: 1.3rem;
    margin-left: 5px;
    margin-top: 5px;
}
.owner-logo {
    width: auto;
    height: 3rem;
    border-radius: 50px;
}
.owner {
    margin-left: 10px;}
.owner-name-title {
    display: flex;
    color: rgba(0, 0, 0, 0.8);
    font-weight: 700;
    font-size: 16px;
    line-height: 1.25rem;  }
.owner-handle {
    margin-bottom: 0rem;
    color: rgba(0, 0, 0, 0.6);
    font-weight: 700;
    font-size: 16px;
    line-height: 1.25rem; }
.subtitle {
    width: 100%;
    color: rgba(0, 0, 0, 0.6);
    font-size: 18px;
    font-weight: 500; }
.body h2 {
    text-align: center;
    font-size: 20px;
    font-weight: 800; }
.scan-icon {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px; }
.body {
    width: 100%;
    height: calc(100% - 70px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column; }
.header {
    width: 100%;
    height: 70px; }
.title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: auto;
    margin-bottom: 30px; }
.qr-section {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column; }
.share-card {
    width: 100vw;
    height: 100vh;
    background-color: white; }
.countdown {
    color: rgba(0, 0, 0, 0.6);
    font-weight: 500;  
    font-size: 14px;}
.or {
    text-align: center;
    font-weight: bold;
    width: 300px;
    border-bottom: 2px solid #f5efef;
    line-height: 0.1em;
    margin: 25px 0; }
.or span {
    background: #fff;
    padding: 0 10px;
    color: rgba(0, 0, 0, 0.6);
    font-weight: 500;
    font-size: 14px; }
.cta-btn {
    background-color: rgb(7, 106, 224);
    width: 300px;
    padding: 8px;
    border-radius: 10px;
    border: none;
    font-size: 12px; }
.cta-btn:hover {
    background-color: rgba(7, 106, 224, 0.8); }
</style>