<template>
    <canvas id="canvas"></canvas>
</template>
  
<script setup lang="ts">
import { getRedPacketPrivate } from "@/graphql/redpacket";
import type { RedPacketDB } from "@/types";
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router';
import { genTotpCode } from "../../functions/common";
import QRCode from "qrcode";

const secret = ref<string | undefined>();
const redPacket = ref<RedPacketDB | undefined>();
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
        url += `&otp=${genTotpCode(secret.value)}`;
    }
    console.log(url);
    let canvas = document.getElementById('canvas')
    await QRCode.toCanvas(canvas, url);
}

const refreshQrCode = async () => {
    await genQrCode();
    await delay(5000);
    await refreshQrCode();
}

onMounted(refreshQrCode);
</script>