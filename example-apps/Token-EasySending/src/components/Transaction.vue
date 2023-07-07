<template>
    
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { type UserOp, useHistoryStore } from '@/stores/history';

const userOps = ref<UserOp[]>([]);

onMounted(() => {
userOps.value = useHistoryStore().history;
});
</script>

<style lang="less" scoped>
</style>