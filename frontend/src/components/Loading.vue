<template>
  <div class="loading-class">
    <div class="load-3">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.load-3 .line:nth-last-child(1) {
  animation: loadingC 0.6s 0.1s linear infinite; }
.load-3 .line:nth-last-child(2) {
  animation: loadingC 0.6s 0.2s linear infinite; }
.load-3 .line:nth-last-child(3) {
  animation: loadingC 0.6s 0.3s linear infinite; }
@keyframes loadingC {
  0% { transform: translate(0, 0); }
  50% { transform: translate(0, 15px); }
  100% { transform: translate(0, 0); } }
.line {
  display: inline-block;
  width: 20px;
  height: 5px;
  border-radius: 15px;
  background-color: #076AE0; }
.loading-class {
  display: flex;
  justify-content: center;
  padding: 30px; }
</style>