<template>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <Header />
    <AssetView></AssetView>
  </div>
</template>

<script setup lang="ts">
import AssetView from '@/views/AssetView.vue';
import Header from '@/components/Header.vue';
</script>

<style lang="less" scoped></style>