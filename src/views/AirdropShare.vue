<template>
    <canvas id="canvas"></canvas>
</template>
  
<script setup lang="ts">
import { getRedPacketValidation, getRedPacket } from "@/graphql/redpacket";
import type { RedPacketDB } from "@/types";
import { ref, onMounted, computed } from "vue";
import { useRoute } from 'vue-router';
import {totp} from "otplib";
import QRCode from "qrcode";

const secret = ref<string | undefined>();
const redPacket = ref<RedPacketDB | undefined>();
onMounted(async () => {
    const route = useRoute();
    const redPacketId = route.params.id;
    redPacket.value = await getRedPacket(redPacketId as string);
    const validationRules = redPacket.value?.metadata.validationRules || [];
    const validationData = redPacket.value?.validationData || [];
    for (const index in validationRules) {
        const rule = validationRules[index];
        const data = validationData[index];
        if (rule.type == "dynamic_secrets") {
            secret.value = data.secret;
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
    return totp.generate(secret);
};
</script>