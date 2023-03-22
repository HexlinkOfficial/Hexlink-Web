<template>
  <div v-if="props.hidden" class="hidden-layer" @wheel.prevent @touchmove.prevent @scroll.prevent></div>
  <div id="main-wrapper" class="show" :class="props.hidden ? 'mobile-modal' : ''">
    <Header />
    <SideBar :active="props.active" />
    <div class="content-body">
      <div class="container">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from './Header.vue';
import SideBar from './Sidebar.vue';

const props = defineProps({
  active: Number,
  hidden: Boolean,
});
</script>

<style lang="less" scoped>
#main-wrapper {
  opacity: 0;
  transition: all 0.25s ease-in;
  overflow: hidden;
  position: relative;
  z-index: 1;
  padding-top: 100px; }
#main-wrapper.show {
  opacity: 1; }
.content-body {
  margin-left: 9.5rem; }
@media only screen and (max-width: 990px) {
  .content-body {
    margin-left: 0px;
    margin-bottom: 50px; } }
.hidden-layer {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 50; }
.mobile-modal {
  @media (max-width: 768px) {
    position: fixed; } }
</style>