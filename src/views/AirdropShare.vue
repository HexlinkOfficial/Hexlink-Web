<template>
    <div style="width: 100vw; height: 100vh; background-color: white;" @wheel.prevent @touchmove.prevent @scroll.prevent>
        <div class="header" style="width: 100%; height: 70px;">
            <router-link to="/">
                <img src="../assets/logo/blue2-logo.svg" alt="" style="height: 40px; margin: 40px; overflow: visible;" />
            </router-link>
        </div>
        <div class="body" style="width: 100%; height: calc(100% - 70px); display: flex; align-items: center; justify-content: center; flex-direction: column;">
            <div style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; border: 1px solid rgba(0,0,0,0.1); border-radius: 8px;">
                <svg style="width: 12px;" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12H22" stroke="black" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M2 8V5C2 3.34315 3.34315 2 5 2H8" stroke="black" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M22 16L22 19C22 20.6569 20.6569 22 19 22L16 22" stroke="black" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M16 2L19 2C20.6569 2 22 3.34315 22 5L22 8" stroke="black" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M8 22L5 22C3.34315 22 2 20.6569 2 19L2 16" stroke="black" stroke-width="1.5" stroke-linecap="round" />
                </svg>
            </div>
            <h2 style="font-size: 24px; font-weight: 600;">Scan QR Code</h2>
            <p style="color: rgba(0,0,0,0.6); font-weight: 500;">Scan this QR code to claim your airdrop</p>
            <div style="width: 170px; height: 170px; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(0,0,0,0.1); border-radius: 15px; overflow: hidden; margin: 20px; margin-bottom: calc(1rem + 20px);">
                <canvas id="canvas"></canvas>
            </div>
            <p class="or"><span>or copy the claim link</span></p>
            <button class="cta-btn" @click="copy(claimUrl, 'Claim URL Copied')" style="margin-bottom: 50px;">Copy</button>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { getRedPacketPrivate } from "@/graphql/redpacket";
import type { RedPacketDB } from "@/types";
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router';
import totp from "totp-generator";
import QRCode from "qrcode";
import qrcode from "@/assets/scan.png";
import { copy } from "@/web3/utils";

const secret = ref<string | undefined>();
const redPacket = ref<RedPacketDB | undefined>();
const claimUrl = ref<string>("");
onMounted(async () => {
    const route = useRoute();
    const redPacketId = route.params.id;
    redPacket.value = await getRedPacketPrivate(redPacketId as string);
    const validationRules = redPacket.value?.metadata.validationRules || [];
    const validationData = redPacket.value?.validationData || [];
    for (const index in validationRules) {
        const rule = validationRules[index];
        const data = validationData[index];
        if (rule.type === "dynamic_secrets") {
            secret.value = data.secret;
            await genQrCode();
        }
    }
});

async function delay(ms: number) {
  return new Promise((resolve, _reject) => {
    window.setTimeout(() => resolve(null), ms);
  });
}

const genQrCode = async() => {
    let url = window.location.origin + `/redpackets?claim=${redPacket.value?.id}`;
    if (secret.value) {
        url += `&otp=${totpCode(secret.value)}`;
    }
    console.log(url);
    claimUrl.value = url;
    var canvas = document.getElementById('canvas')
    await QRCode.toCanvas(canvas, url);
}

const refreshQrCode = async () => {
    await genQrCode();
    await delay(5000);
    await refreshQrCode();
}

onMounted(refreshQrCode);

const totpCode = (secret: string) => {
    return totp(secret);
};
</script>

<style lang="less" scoped>
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