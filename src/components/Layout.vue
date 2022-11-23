<template>
  <div id="main-wrapper" class="show">
    <Header />
    <SideBar :active="active" />
    <slot />
  </div>
</template>

<script>
import Header from './Header.vue'
import SideBar from './SideBar.vue'
export default {
  components: { Header, SideBar },
  name: "Layout",
  props: {
    active: Number,
  },
};
</script>

<style leng="less" scoped>
#main-wrapper {
  opacity: 0;
  transition: all 0.25s ease-in;
  overflow: hidden;
  position: relative;
  z-index: 1;
  padding-top: 120px;
}

#main-wrapper.show {
  opacity: 1;
}
</style>