<template>
  <Layout :hidden="status !== ''" :active="1">
    <RedPacketBase>
      <RedPacketSend></RedPacketSend>
    </RedPacketBase>
  </Layout>
  <RedpacketConfirm v-if="status !== ''" :mode="'token'"></RedpacketConfirm>
</template>

<script setup lang="ts">
import RedPacketBase from "@/components/RedPacketBase.vue";
import RedPacketSend from "@/components/RedPacketSend.vue";
import RedpacketConfirm from "@/components/RedPacketConfirm.vue";
import Layout from "@/components/Layout.vue";
import { useRedPacketStore } from '@/stores/redpacket';
import { storeToRefs } from 'pinia';

const { status } = storeToRefs(useRedPacketStore());
</script>