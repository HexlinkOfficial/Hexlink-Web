<template>
  <router-view />
</template>

<style lang="less">
#app {
  height: 100%;
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