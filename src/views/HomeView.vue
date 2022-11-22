<script setup lang="ts">
import NavigationSide from "@/components/NavigationSide.vue"
import TokenPage from "@/components/TokenPage.vue"
import Navheader from '@/components/nav/NavHeader.vue'
</script>

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