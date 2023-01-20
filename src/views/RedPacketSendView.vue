<template>
  <Layout :hidden="status !== ''" :active="1">
    <h1 style="margin-bottom: 1rem;">Red Packet</h1>
    <RedPacketBase>
      <RedPacketSend></RedPacketSend>
    </RedPacketBase>
  </Layout>
  <RedpacketConfirm v-if="status !== ''"></RedpacketConfirm>
</template>

<script setup lang="ts">
import RedPacketBase from "@/components/RedPacketBase.vue";
import RedPacketSend from "@/components/RedPacketSend.vue";
import RedpacketConfirm from "@/components/RedPacketConfirm.vue";
import Layout from "@/components/Layout.vue";

import { watch } from "vue";
import { useRedPacketStore } from '@/stores/redpacket';
import { storeToRefs } from 'pinia'

const { status } = storeToRefs(useRedPacketStore());
watch(() => status, (status) => {
  console.log(status);
});
</script>