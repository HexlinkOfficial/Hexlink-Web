<template>
  <div class="login-card" :style="{ backgroundImage: `url(${background})` }">
    <div class="card" :style="!show ? 'display: flex; align-items: center; justify-content: center;' : ''">
      <form @submit="onSubmit">
        <div v-if="show" class="step1">
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
                <img src="@/assets/svg/logo-beta.svg" style="height: 2.5rem;" />
            </div>
            <h2 class="title">Welcome To Hexlink</h2>
            <p class="subtitle">Crypto for everyone</p>
            <div class="social-login">
                <Button size="large" @click="googleLogin" type="primary" class="google-btn" :loading="isGoogleLoading">
                    <i class="fa fa-google"></i>
                    <span style="margin: 0 5px;">Sign in with Google</span>
                </Button>
            </div>
            <p class="or"><span>or</span></p>
            <div class="email-login">
                <input type="text" v-model="email" placeholder="Enter Email" name="uname" class="email-input" required>
            </div>
            <Button class="cta-btn" type="primary" :loading="isLoadingLogin" :disabled="loginDisabled" @click="emailLogin">
                Continue
            </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from 'ant-design-vue';
import { googleSocialLogin, emailAnonymousLogin } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import background from "@/assets/background.png";

const store = useAuthStore();
const router = useRouter();
const show = ref<boolean>(true);
const email = ref<string>("");
const isLoadingLogin = ref(false);
const isGoogleLoading = ref<boolean>(false);
const loginDisabled = ref<boolean>(true);

const onSubmit = (e: Event) => {
    e.preventDefault();
}

const googleLogin = async () => {
    isGoogleLoading.value = true;
    await googleSocialLogin();
    router.push(store.returnUrl || "/");
}

const emailLogin = async() => {
    isLoadingLogin.value = true;
    await emailAnonymousLogin(email.value);
    router.push(store.returnUrl || "/");
}

watch(email, () => {
    if (email.value == "") {
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
    background-color: rgb(228, 229, 247);
    height: 100vh; }
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
    margin: 0; }
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
    flex-direction: column;
    padding-top: 20px; }
.email-input {
    padding: 15px 20px;
    margin-top: 8px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-sizing: border-box; }
.cta-btn {
    background-color: rgb(7, 106, 224);
    color: white;
    padding: 18px 20px;
    margin-top: 10px;
    margin-bottom: 20px;
    width: 100%;
    height: auto;
    border-radius: 10px;
    border: none; }
.cta-btn:hover {
    background-color: rgba(7, 106, 224, 0.8); }
.google-btn {
    background-color: #1DA1F2;
    color: white;
    padding: 18px 20px;
    margin-top: 10px;
    margin-bottom: 20px;
    width: 100%;
    height: auto;
    border-radius: 10px;
    border: none; }
.google-btn:hover {
    background-color: rgba(29, 161, 242, 0.8); }
.title {
    margin: 10px 0px 10px 0px;
    text-align: center;
    font-weight: bold;
    font-size: 1.5em;
    font-weight: bold; }
</style>