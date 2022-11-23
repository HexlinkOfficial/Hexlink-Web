<template>
  <div className="app">
    <!-- <sidebar /> -->
    <router-view />
  </div>
</template>

<!-- <template>
  <router-view />
</template> -->

<script setup>
  import Sidebar from "@/components/Sidebar.vue"
</script>

<style lang="less">
#app {
  max-height: 100vh;
}

:root {
  --primary: #4ade80;
  --primary-alt: #22c55e;
  --grey: #64748b;
  --dark: #1e293b;
  --dark-alt: #334155;
  --light: #f1f5f9;
  --sidebar-width: 300px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--light);
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