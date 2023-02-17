<template>
  <layout :hidden="showSend" :active="1">
    <AssetView></AssetView>
  </layout>
  <SendToken v-if="showSend"></SendToken>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import Layout from "@/components/Layout.vue";
import AssetView from "@/views/AssetView.vue"
import SendToken from "@/components/SendToken.vue";
import { useRoute } from "vue-router";

const showSend = computed(() => {
  return useRoute().query.action == "send";
})
</script>