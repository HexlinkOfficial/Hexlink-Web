<template>
  <a-layout style="height: 100%;">
    <a-layout-sider theme="light">
      <NavigationSide />
    </a-layout-sider>
    <a-layout>
      <a-layout-content>
        <TokenList />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import NavigationSide from "@/components/NavigationSide.vue"
import TokenList from "@/components/TokenList.vue"
</script>