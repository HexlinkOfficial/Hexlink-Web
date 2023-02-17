<template>
  <div class="login-card" :style="{ backgroundImage: `url(${background})` }">
    <div class="card">
      <form @submit="onSubmit">
        <transition name="fade">
            <div v-if="show" class="step1">
                <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
                    <img :src="hexlink" style="width:2.5rem; height: 2.5rem;" />
                </div>
                <h2 class="title">Welcome To HexLink</h2>
                <p class="subtitle">Address-less experience with Hexlink Auth Protocal</p>
                <div class="social-login">
                    <button size="large" @click="twitter_login" className="twitter-btn">
                        <i class="fa fa-twitter"></i>
                        &nbsp;&nbsp;Sign in with Twitter
                    </button>
                </div>
                <p class="or"><span>or</span></p>
                <div class="email-login">
                    <input type="text" v-model="email" placeholder="Enter Email" name="uname" class="email-input" required>
                </div>
                <button class="cta-btn" @click="sendOTP">Log In</button>
            </div>
        </transition>
        <transition name="fade">
            <div v-if="!show" class="step2">
                <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
                    <img :src="secure" style="width:2.5rem; height: 2.5rem;" />
                </div>
                <h2 class="title">Enter Verification Code</h2>
                <p class="subtitle">Enter code that we have sent to your email <b>{{ email }}</b></p>
                <div class="social-login" style="flex-direction: column;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <input v-for="(arr, index) in code" :key="index" type="number" pattern="\d*" :id="'input_' + index"
                            maxlength="1" v-model="code[index]" @input="handleInput" @keypress="isNumber"
                            @keydown.delete="handleDelete" @paste="onPaste" />
                    </div>
                    <button class="cta-btn" @click="verifyOTP">Verify</button>
                </div>
            </div>
        </transition>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { twitterSocialLogin, signOutFirebase, genOTP, validateOTP } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import hexlink from "@/assets/logo/blue-logo.svg";
import background from "@/assets/background.png";
import secure from "@/assets/secure.svg";

const store = useAuthStore();
const router = useRouter();
let code: string[] = Array(6);
let dataFromPaste: string[] | undefined;
const keysAllowed: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",];
const show = ref<boolean>(true);
const email = ref<string>("");

const onSubmit = (e: Event) => {
    e.preventDefault();
}

const twitter_login = async () => {
    await twitterSocialLogin();
    router.push(store.returnUrl || "/");
}

const isNumber = (event: Event) => {
    (event.currentTarget as HTMLInputElement).value = "";
    const keyPressed: string = (event as KeyboardEvent).key;
    if (!keysAllowed.includes(keyPressed)) {
        event.preventDefault();
    }
}

const handleInput = (event: Event) => {
    const inputType = (event as InputEvent).inputType;
    let currentActiveElement = event.target as HTMLInputElement;
    if (inputType === "insertText")
        (currentActiveElement.nextElementSibling as HTMLElement)?.focus();
    if (inputType === "insertFromPaste" && dataFromPaste) {
        for (const num of dataFromPaste) {
            let id: number = parseInt(currentActiveElement.id.split("_")[1]);
            currentActiveElement.value = num;
            code[id] = num;
            if (currentActiveElement.nextElementSibling) {
                currentActiveElement =
                    currentActiveElement.nextElementSibling as HTMLInputElement;
                (currentActiveElement.nextElementSibling as HTMLElement)?.focus();
            }
        }
    }
    console.log(code);
}

const handleDelete = (event: Event) => {
    //keydown event = move to previous element then only delete number
    let value = (event.target as HTMLInputElement).value;
    let currentActiveElement = event.target as HTMLInputElement;
    if (!value)
        (currentActiveElement.previousElementSibling as HTMLElement)?.focus();
}

const onPaste = (event: Event) => {
    dataFromPaste = (event as ClipboardEvent).clipboardData
        ?.getData("text")
        .trim()
        .split("");
    if (dataFromPaste) {
        for (const num of dataFromPaste) {
            if (!keysAllowed.includes(num)) event.preventDefault();
        }
    }
}

const sendOTP = async () => {
    await genOTP(email.value);
    show.value = !show.value;
}

const verifyOTP = async () => {
    const result = await validateOTP(email.value, code.join(""));
    if (result?.code === 200) {
        router.push(store.returnUrl || "/");
    }
    // should show an error message in UI
}
</script>

<style lang="less" scoped>
.fade-enter-active, .fade-leave-active {
  transition: display 10s; }
.fade-enter-from, .fade-leave-to  {
  display: none;}
input[type="number"] {
  width: 50px;
  height: 50px;
  font-size: 2rem;
  text-align: center;
  border-radius: 0.5rem;
  box-shadow: none;
  border: 1px solid #999;
  margin-top: 8px;
  margin-bottom: 25px;
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
    margin-left: 1rem;
    margin-right: 1rem;
    background-color: rgb(228, 229, 247);
    height: 100vh; }
.social-login img {
    width: 24px; }
a {
    text-decoration: none; }
.card {
    width: 450px;
    border-radius: 15px;
    background-color: #ffff;
    padding: 1.8rem;
    box-shadow: 2px 5px 20px rgba(0, 0, 0, 0.1); }
.subtitle {
  text-align: center;
  font-weight: bold;
  margin-bottom: 30px; }
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
    border-radius: 10px;
    border: none; }
.cta-btn:hover {
    background-color: rgba(7, 106, 224, 0.8); }
.twitter-btn {
    background-color: #1DA1F2;
    color: white;
    padding: 18px 20px;
    margin-top: 10px;
    margin-bottom: 20px;
    width: 100%;
    border-radius: 10px;
    border: none; }
.twitter-btn:hover {
    background-color: rgba(29, 161, 242, 0.8); }
.title {
    margin: 10px 0px 10px 0px;
    text-align: center;
    font-weight: bold;
    font-size: 1.5em;
    font-weight: bold; }
</style>