<template>
  <Layout :hidden="showClaim" :active="1">
    <h1 style="margin-bottom: 1rem;">Red Packet</h1>
    <RedPacketBase>
      <RedPacektHistoryList></RedPacektHistoryList>
    </RedPacketBase>
  </Layout>
  <RedPacketClaim v-if="showClaim"></RedPacketClaim>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import RedPacketBase from "@/components/RedPacketBase.vue";
import RedPacektHistoryList from "@/components/RedPacketHistoryList.vue";
import RedPacketClaim from "@/components/RedPacketClaim.vue";
import Layout from "@/components/Layout.vue";

const showClaim = computed(() => {
  return !!useRoute().query.claim;
});
</script>