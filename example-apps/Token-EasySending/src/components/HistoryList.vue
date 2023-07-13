<template>
  <div v-if="userOps.length == 0">
    <EmptyContent 
      title="Start by sending the first transaction"
      message="Warning: All your history are local, if you logout, all history will be lost."
    >
    </EmptyContent>
  </div>
  <div v-if="userOps.length > 0">
    <div v-for="(userOp, index) of userOps" :key="userOp.userOpHash" style="margin-top: 20px;">
      <Erc20Transaction v-if="userOp.type === 'erc20Transfer'" :index='index' :userOp='userOp'/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import EmptyContent from '@/components/EmptyContent.vue';
import Erc20Transaction from '@/components/Erc20Transaction.vue';
import { type UserOp, useHistoryStore } from '@/stores/history';

const userOps = ref<UserOp[]>([]);

onMounted(() => {
  userOps.value = useHistoryStore().history;
});
</script>

<style lang="less" scoped>
</style>