<template>
  <div className="app">
    <div id="preloader" v-show="isLoading">
      <Loading />
    </div>
    
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Loading from "@/components/Loading.vue";

const isLoading = ref<boolean>(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>

<style lang="less">
#app {
  max-height: 100vh;
}

#preloader {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: #fff;
  z-index: 999999999; }
  #preloader i {
    display: block;
    width: 16px;
    height: 16px;
    background: black;
    border-radius: 16px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -8px 0 0 -8px;
    opacity: 1;
    -webkit-transform: translate3d(60px, 0, 0);
    overflow: hidden;
    text-indent: -9999px;
    border: 1px solid white; }
    #preloader i:nth-child(1) {
      background: #556ee6;
      -webkit-animation: googleDotA 1.75s ease-in-out infinite; }
    #preloader i:nth-child(2) {
      background: #34c38f;
      -webkit-animation: googleDotB 1.75s ease-in-out infinite; }
    #preloader i:nth-child(3) {
      background: #f1b44c;
      -webkit-animation: googleDotC 1.75s ease-in-out infinite; }

@-webkit-keyframes googleDotA {
  0% {
    opacity: 0;
    transform: translate3d(60px, 0, 0);
    -webkit-transform: translate3d(60px, 0, 0); }
  30% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0); }
  70% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0); }
  100% {
    opacity: 0;
    transform: translate3d(-300px, 0, 0);
    -webkit-transform: translate3d(-300px, 0, 0); } }

@-webkit-keyframes googleDotB {
  0% {
    opacity: 0;
    transform: translate3d(180px, 0, 0);
    -webkit-transform: translate3d(180px, 0, 0); }
  35% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0); }
  77% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0); }
  100% {
    opacity: 0;
    transform: translate3d(-180px, 0, 0);
    -webkit-transform: translate3d(-180px, 0, 0); } }

@-webkit-keyframes googleDotC {
  0% {
    opacity: 0;
    transform: translate3d(300px, 0, 0);
    -webkit-transform: translate3d(300px, 0, 0); }
  40% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0); }
  80% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0); }
  100% {
    opacity: 0;
    transform: translate3d(-60px, 0, 0);
    -webkit-transform: translate3d(-60px, 0, 0); } }

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #f6f6f6;
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.login {
  display: flex;
  justify-content: center;
  margin-top: 200px;
}

.home {
  height: 100%;
  width: 100%;
}

.border {
    border-style: solid;
    border-radius: 10px;
    border-color: #edebeb;
    padding: 15px;
}

.avatar {
    font-weight: bold;
    background-color: #209645;
}
</style>