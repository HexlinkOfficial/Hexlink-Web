<template>
    <a-layout style="height: 100%;">
      <a-layout-sider theme="light">
        <NavigationSide />
      </a-layout-sider>
      <a-layout-content style="overflow: auto;">
        <a-row justify="center">
          <a-col style="max-width: 800px; width: 100%;" >
            <ActivityList />
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
  </template>
  
  <script setup lang="ts">
  import NavigationSide from "@/components/NavigationSide.vue"
  import ActivityList from "@/components/ActivityList.vue"
  </script>