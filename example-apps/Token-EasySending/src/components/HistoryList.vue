<template>
  <div v-if="userOps.length == 0">
    <EmptyContent 
      title="Start by sending the first transaction"
      message="Unlocking the potential of Hexlink by depositing your first token or claim your first airdrop"
    >
    </EmptyContent>
  </div>
  <div v-if="userOps.length > 0">
    <div v-for="(userOp, index) of userOps" :key="userOp.userOpHash" style="margin-top: 20px;">
      <Transaction :index='index' :userOp='userOp'/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import EmptyContent from '@/components/EmptyContent.vue';
import Transaction from '@/components/Transaction.vue';
import { type UserOp, useHistoryStore } from '@/stores/history';

const userOps = ref<UserOp[]>([]);

onMounted(() => {
  userOps.value = useHistoryStore().history;
});
</script>

<style lang="less" scoped>
</style>