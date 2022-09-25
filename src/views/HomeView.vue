<template>
  <a-layout style="height: 100%;">
    <a-layout-sider theme="light">
      <NavigationSide />
    </a-layout-sider>
    <a-layout-content style="overflow: auto;">
      <TokenPage />
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import NavigationSide from "@/components/NavigationSide.vue"
import TokenPage from "@/components/TokenPage.vue"
</script>