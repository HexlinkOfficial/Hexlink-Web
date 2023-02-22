<template>
  <Layout :hidden="showClaim || showDetails" :active="1">
    <lockScreen v-if="isLocked" @lock="lock"></lockScreen>
    <RedPacketBase v-if="!isLocked">
      <RedPacektHistoryList></RedPacektHistoryList>
    </RedPacketBase>
  </Layout>
  <RedPacketClaim v-if="showClaim"></RedPacketClaim>
  <RedPacketDetail v-if="showDetails"></RedPacketDetail>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useWhitelistStore } from "@/stores/whitelist";
import { useAccountStore } from '@/stores/account';
import RedPacketBase from "@/components/RedPacketBase.vue";
import RedPacektHistoryList from "@/components/RedPacketHistoryList.vue";
import RedPacketClaim from "@/components/RedPacketClaim.vue";
import RedPacketDetail from "@/components/RedPacketDetail.vue";
import Layout from "@/components/Layout.vue";
import lockScreen from "@/components/lockScreen.vue";

const isLocked = ref<boolean>(true);
const whitelist = useWhitelistStore();
const myAccount = useAccountStore();
const statusArray = ref<number[]>([]);

onMounted(() => {
  if (whitelist.whitelist.includes(myAccount.account!.address)) {
    isLocked.value = false;
  };
});

const showClaim = computed(() => {
  return !!useRoute().query.claim;
});

const showDetails = computed(() => {
  return !!useRoute().query.details;
});

const lock = () => {
  isLocked.value = false;
};
</script>