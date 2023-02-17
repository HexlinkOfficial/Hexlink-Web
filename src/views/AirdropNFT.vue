<template>
  <Layout :hidden="status !== ''" :active="1">
    <RedPacketBase>
      <AirdropNFTSend></AirdropNFTSend>
    </RedPacketBase>
  </Layout>
  <RedpacketConfirm v-if="status !== ''" :mode="'nft'"></RedpacketConfirm>
</template>

<script setup lang="ts">
import RedPacketBase from "@/components/RedPacketBase.vue";
import AirdropNFTSend from "@/components/AirdropNFTSend.vue";
import RedpacketConfirm from "@/components/RedPacketConfirm.vue";
import Layout from "@/components/Layout.vue";
import { useRedPacketStore } from '@/stores/redpacket';
import { storeToRefs } from 'pinia';

const { status } = storeToRefs(useRedPacketStore());
</script>