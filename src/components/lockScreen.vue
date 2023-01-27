<template>
  <div style="height: 500px; display: flex; align-items: center; justify-content: center;">
    <div>
      <div class="title">Please enter your invitation code</div>
      <div id="app-cover">
        <div id="password-box">
          <i class="fas fa-lock" id="icon-1"></i>
          <div id="input-box">
            <input v-model="password" type="password" id="password" placeholder="Enter your code">
          </div>
          <i class="fas fa-chevron-right" id="icon-2" @click="myPassword"></i>
        </div>
      </div>
      <div v-if="showReminder" class="reminder">Wrong invitation code!</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useWhitelistStore } from "@/stores/whitelist";
import { useAccountStore } from '@/stores/account';

const emit = defineEmits(["lock"]);

const password = ref<string>("");
const showReminder = ref<boolean>(false);
const whitelist = useWhitelistStore();
const myAccount = useAccountStore();

const myPassword = () => {
  password.value == "friday" ? showReminder.value = true: showReminder.value = false;
  if (password.value == "friday") {
    showReminder.value = true;
    emit("lock", true);
    !whitelist.whitelist.includes(myAccount.account!.address) && whitelist.addToAccounts(myAccount.account!.address);
    console.log("whitelist: ", whitelist.whitelist);
  } else {
    showReminder.value = false;
  }
  password.value = "";
};
</script>

<style lang="less" scoped>
.reminder {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 13px;
  color: #f44336;
  font-weight: 600; }
.title {
  font-size: 20px;
  text-align: center;
  margin-bottom: 1rem; }
*:focus {
  outline: none; }
#app-cover {
  width: 310px;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 20px 30px -20px #000; }
#password-box {
  position: relative;
  height: 46px;
  padding: 0 46px; }
#password-box i {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 16px;
  text-align: center;
  line-height: 1;
  padding: 15px; }
#icon-1 {
  left: 0; }
#password-box #icon-2 {
  right: 0;
  padding: 15px 20px;
  margin-right: 0.5rem;
  cursor: pointer; }
#input-box {
  position: absolute;
  top: 0;
  right: 56px;
  bottom: 0;
  left: 46px; }
#input-box input {
  width: 100%;
  height: 46px;
  font-size: 24px;
  font-family: Arial, Helvetica, sans-serif;
  letter-spacing: 3px;
  padding: 0;
  margin: 0;
  border: 0; }
#input-box input::placeholder {
  position: relative;
  top: -2px;
  color: #bababa;
  font-size: 14px;
  letter-spacing: 0; }
#password-box i,
#input-box input {
  color: #3c3c3c; }
#init-btn {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 56px;
  height: 46px;
  cursor: pointer;
  z-index: 1; }
#init-btn.zindex {
  width: 42px;
  z-index: 3; }
@keyframes shake {
  0% {
    margin-left: 0; }
  25% {
    margin-left: 4px; }
  50% {
    margin-left: 0; }
  75% {
    margin-left: -4px; }
  100% {
    margin-left: 0; } }
</style>