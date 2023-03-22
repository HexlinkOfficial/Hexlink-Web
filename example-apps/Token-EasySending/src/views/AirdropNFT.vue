<template>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <Header />
    <RedPacketBase>
      <RedPacektHistoryList></RedPacektHistoryList>
    </RedPacketBase>
  </div>
</template>

<script setup lang="ts">
import RedPacketBase from "@/components/RedPacketBase.vue";
import RedPacektHistoryList from "@/components/RedPacketHistoryList.vue";
import Header from '@/components/Header.vue';
</script>

<style lang="less" scoped>
</style>