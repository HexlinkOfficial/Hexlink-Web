<template>
  <Layout :hidden="showClaim || showDetails || showTokenSendModal || showNFTSendModal" :active="1">
    <lockScreen v-if="isLocked" @lock="lock"></lockScreen>
    <RedPacketBase v-if="!isLocked">
      <RedPacektHistoryList></RedPacektHistoryList>
    </RedPacketBase>
  </Layout>
  <RedPacketClaim v-if="showClaim"></RedPacketClaim>
  <RedPacketDetail v-if="showDetails"></RedPacketDetail>
  <RedPacketSendModal v-if="showTokenSendModal && status === ''"></RedPacketSendModal>
  <RedPacketNFTModal v-if="showNFTSendModal && status === ''"></RedPacketNFTModal>
  <RedpacketConfirm v-if="status !== ''" :mode="showTokenSendModal ? 'token' : 'nft'"></RedpacketConfirm>
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
import RedPacketSendModal from "@/components/RedPacketSendModal.vue";
import RedpacketConfirm from "@/components/RedPacketConfirm.vue";
import RedPacketNFTModal from "@/components/RedPacketNFTModal.vue";
import { storeToRefs } from 'pinia';
import { useRedPacketStore } from '@/stores/redpacket';

const isLocked = ref<boolean>(true);
const whitelist = useWhitelistStore();
const myAccount = useAccountStore();
const statusArray = ref<number[]>([]);
const { status } = storeToRefs(useRedPacketStore());

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

const showTokenSendModal = computed(() => {
  return useRoute().query.action == 'send';
})

const showNFTSendModal = computed(() => {
  return useRoute().query.action == 'airdropNFT';
})

const lock = () => {
  isLocked.value = false;
};
</script>