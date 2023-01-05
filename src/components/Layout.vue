<template>
  <div id="main-wrapper" class="show">
    <Header />
    <SideBar :active="active" />
    <div class="content-body">
      <h1 style="margin-bottom: 1rem;">Red Packet</h1>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from './Header.vue';
import SideBar from './SideBar.vue';

const props = defineProps({
  active: Number
});
</script>

<style leng="less" scoped>
#main-wrapper {
  opacity: 0;
  transition: all 0.25s ease-in;
  overflow: hidden;
  position: relative;
  z-index: 1;
  padding-top: 100px;
}

#main-wrapper.show {
  opacity: 1;
}

.content-body {
  margin-left: 9.5rem; 
}

@media only screen and (max-width: 990px) {
  .content-body {
    margin-left: 0px;
    margin-bottom: 50px; 
  } 
}
</style>