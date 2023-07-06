<template>
  <div>
    <EmptyContent 
      title="Start by Sending the first transaction"
      message="Unlocking the potential of Hexlink by depositing your first token or claim your first airdrop"
    >
    </EmptyContent>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import EmptyContent from '@/components/EmptyContent.vue';

const loading = ref<boolean>(false);
const hasContent = ref<boolean>(false);
</script>

<style lang="less" scoped>
</style>