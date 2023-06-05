<template>
  <div class="login-card">
    <div class="card" :style="!show ? 'display: flex; align-items: center; justify-content: center;' : ''">
      <form @submit="onSubmit">
        <div v-if="show" class="step1">
            <div style="display: flex; align-items: center; justify-content: center;">
              <img src="@/assets/svg/logo-beta.svg" style="height: 2.5rem;" />
            </div>
            <h2 class="title">Welcome To Hexlink</h2>
            <p class="subtitle">Crypto for everyone</p>
            <h3 class="small-title">What's your phone number or email?</h3>
            <div class="email-login">
              <input type="text" v-model="inputData" placeholder="Enter phone number or email" name="uname" class="email-input" required>
            </div>
            <div class="phone-login">
              <phone-input
                @phone="phone = $event"
                @country="country = $event"
                @phoneData="phoneData = $event"
                name="phone-number-input"
                required
                :value="'1'"
                style="margin-bottom: 15px;"
              />
            </div>
            <Button class="cta-btn" type="primary" :loading="isLoadingLogin" :disabled="loginDisabled" @click="emailLogin">
              <div class="btn-text">Continue</div>
            </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from 'ant-design-vue';
import { emailAnonymousLogin } from '@/services/auth';
import { useAuthStore } from '@/stores/auth';
import PhoneInput from "@/components/PhoneInput.vue";
import type { PhoneDATA } from "../types";

const store = useAuthStore();
const router = useRouter();
const show = ref<boolean>(true);
const email = ref<string>("");
const isLoadingLogin = ref(false);
const loginDisabled = ref<boolean>(true);

const phone: Ref<string> = ref("");
const country: Ref<string> = ref("");
const phoneData: Ref<PhoneDATA> = ref({});

const inputData = ref<string>("");
const isEmail = ref<boolean>(true);

const onSubmit = (e: Event) => {
  e.preventDefault();
}

const emailLogin = async() => {
  isLoadingLogin.value = true;
  if (inputData.value != "") {
    await emailAnonymousLogin(inputData.value);
    router.push(store.returnUrl || "/");
  } else {
    console.log("Phone number: ", phone.value);
    TODO: "Add phone number login"
  }
}

watch([inputData, phone], () => {
  if (inputData.value == "" && phone.value == "") {
    loginDisabled.value = true;
  } else {
    loginDisabled.value = false;
  }
})
</script>

<style lang="less" scoped>
.fade-enter-active, .fade-leave-active {
  transition: display 10s; }
.fade-enter-from, .fade-leave-to  {
  display: none;}
input[type="number"] {
  width: 40px;
  height: 40px;
  font-size: 2rem;
  text-align: center;
  border-radius: 0.5rem;
  box-shadow: none;
  border: 1px solid #999;
  margin: 8px 5px 25px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  caret-color: transparent !important; }
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0; }
input[type="number"] {
  -moz-appearance: textfield; }
.login-card {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #F2F5FF; }
.social-login img {
    width: 24px; }
a {
    text-decoration: none; }
.card {
  width: 350px;
  border-radius: 15px;
  background-color: #ffff;
  padding: 1.8rem;
  margin: 1rem;
  box-shadow: 0px 5px 20px rgb(0 0 0 / 15%); }
.subtitle {
  text-align: center;
  font-weight: bold;
  margin-bottom: 20px; }
.resend {
  text-align: center; }
.resend-plain {
  color: #808080;
  text-align: center;}
.btn-text {
  color: rgb(255, 255, 255);
  font-weight: 500;
  line-height: 20px;
  font-size: 16px;
  cursor: pointer; }
.social-login {
  display: flex;
  justify-content: center;
  gap: 5px; }
.or {
  text-align: center;
  font-weight: bold;
  border-bottom: 2px solid rgb(245 239 239);
  line-height: 0.1em;
  margin: 25px 0; }
.or span {
  background: #fff;
  padding: 0 10px; }
.email-login {
  display: flex;
  flex-direction: column; }
.email-input {
  padding: 10px 0 10px 12px;
  margin-top: 0.5rem;
  margin-bottom: 15px;
  border: 2px solid transparent;
  background: #eee;
  border-radius: 8px;
  box-sizing: border-box; }
.email-input:focus-visible {
  border-color: black; }
.cta-btn {
  display: flex;
  justify-content: center;
  background-color: rgb(7, 106, 224);
  color: white;
  padding: 14px 20px;
  width: 100%;
  height: auto;
  border-radius: 10px;
  border: none; }
.cta-btn:focus-visible {
  background-color: rgba(7, 106, 224, 0.8); }
.google-btn {
    background-color: #1DA1F2;
    color: white;
    padding: 14px 16px;
    margin-top: 10px;
    margin-bottom: 20px;
    width: 100%;
    height: auto;
    border-radius: 10px;
    border: none; }
.google-btn:hover {
    background-color: rgba(29, 161, 242, 0.8); }
.title {
  margin: 10px 0px 0px 0px;
  text-align: center;
  font-weight: bold;
  font-size: 1.5em;
  font-weight: bold; }
.small-title {
  font-size: 16px;
  font-weight: 500;
  margin: 2.5rem 0px 5px 0px;
  text-align: center; }
</style>