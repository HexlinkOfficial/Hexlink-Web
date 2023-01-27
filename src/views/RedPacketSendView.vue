<template>
  <Layout :hidden="creatingStatus !== ''" :active="1">
    <h1 style="margin-bottom: 1rem;">Red Packet</h1>
    <RedPacketBase>
      <RedPacketSend></RedPacketSend>
    </RedPacketBase>
  </Layout>
  <RedpacketConfirm v-if="creatingStatus !== ''"></RedpacketConfirm>
</template>

<script setup lang="ts">
import RedPacketBase from "@/components/RedPacketBase.vue";
import RedPacketSend from "@/components/RedPacketSend.vue";
import RedpacketConfirm from "@/components/RedPacketConfirm.vue";
import Layout from "@/components/Layout.vue";

import { useRedPacketStore } from '@/stores/redpacket';
import { storeToRefs } from 'pinia'

const { creatingStatus } = storeToRefs(useRedPacketStore());
</script>