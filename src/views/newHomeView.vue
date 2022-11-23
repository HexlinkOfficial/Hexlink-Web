<script setup lang="ts">
import NavigationSide from "@/components/NavigationSide.vue"
import TokenPage from "@/components/TokenPage.vue"
import Navheader from '@/components/nav/NavHeader.vue'
import Header from '@/components/Header.vue'
import { ref, watch } from "vue";

let menuToggle = ref(false)
</script>

<template>
  <div id="main-wrapper" className="show">
    <Header />
  </div>
</template>

