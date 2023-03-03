<template>
  <layout :hidden="showSend || showReceive" :active="1">
    <AssetView></AssetView>
  </layout>
  <SendToken v-if="showSend"></SendToken>
  <ReceiveToken v-if="showReceive"></ReceiveToken>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Layout from "@/components/Layout.vue";
import AssetView from "@/views/AssetView.vue"
import SendToken from "@/components/SendToken.vue";
import ReceiveToken from "@/components/ReceiveToken.vue";
import { useRoute } from "vue-router";

const showSend = computed(() => {
  return useRoute().query.action == "send";
})

const showReceive = computed(() => {
  return useRoute().query.action == "receive";
})
</script>