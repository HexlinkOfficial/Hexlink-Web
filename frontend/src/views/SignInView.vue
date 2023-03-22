<template>
  <div class="login-card" :style="{ backgroundImage: `url(${background})` }">
    <div class="card" :style="!show ? 'display: flex; align-items: center; justify-content: center;' : ''">
      <form @submit="onSubmit">
        <transition name="fade">
            <div v-if="show" class="step1">
                <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
                    <img src="@/assets/svg/logo-beta.svg" style="height: 2.5rem;" />
                </div>
                <h2 class="title">Welcome To HexLink</h2>
                <p class="subtitle">Crypto for everyone</p>
                <div class="social-login">
                    <Button size="large" @click="twitter_login" type="primary" class="twitter-btn" :loading="isTwitterLoading">
                        <i class="fa fa-twitter"></i>
                        <span style="margin: 0 5px;">Sign in with Twitter</span>
                    </Button>
                </div>
                <div class="social-login">
                    <Button size="large" @click="google_login" type="primary" class="google-btn" :loading="isGoogleLoading">
                        <i class="fa fa-google"></i>
                        <span style="margin: 0 5px;">Sign in with Google</span>
                    </Button>
                </div>
                <p class="or"><span>or</span></p>
                <div class="email-login">
                    <input type="text" v-model="email" placeholder="Enter Email" name="uname" class="email-input" required>
                </div>
                <Button class="cta-btn" type="primary" :loading="isLoadingLogin" :disabled="loginDisabled" @click="sendOTP">
                    Log In
                </Button>
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
                    <p v-if="!isResendLink" class="resend-plain">Resend the verification code in {{ countDown }}s.</p>
                    <a v-if="isResendLink" class="resend" @click="resendOTP">Resend the verification code.</a>
                    <Button class="cta-btn" style="margin-bottom: 0px;" type="primary" :loading="isLoading" :disabled="isDisabled" @click="verifyOTP">
                        Verify
                    </Button>
                    <p v-if="isRateExceeded" style="color: #FF5C5C; text-align: center;">Too many attempts. Please wait for five minutes.</p>
                    <p v-if="otpValidataionFailed" style="color: #FF5C5C; text-align: center;">Invalid email or otp. Please try again.</p>
                </div>
            </div>
        </transition>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from 'ant-design-vue';
import { twitterSocialLogin, signOutFirebase, genOTP, validateOTP, googleSocialLogin } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import background from "@/assets/background.png";
import secure from "@/assets/secure.svg";
import { createNotification } from '@/web3/utils';

const store = useAuthStore();
const router = useRouter();
let code: string[] = Array(6);
let dataFromPaste: string[] | undefined;
const keysAllowed: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",];
const show = ref<boolean>(true);
const email = ref<string>("");
const isResendLink = ref<boolean>(false);
const isRateExceeded = ref<boolean>(false);
const isDisabled = ref<boolean>(true);
const otpValidataionFailed = ref<boolean>(false);
const countDown = ref<number>(60);
const isLoadingLogin = ref(false);
const isLoading = ref(false);
const isTwitterLoading = ref<boolean>(false);
const isGoogleLoading = ref<boolean>(false);
const loginDisabled = ref<boolean>(true);

const onSubmit = (e: Event) => {
    e.preventDefault();
}

const twitter_login = async () => {
    isTwitterLoading.value = true;
    await twitterSocialLogin();
    router.push(store.returnUrl || "/");
}

const google_login = async () => {
    isGoogleLoading.value = true;
    await googleSocialLogin();
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
    if (currentActiveElement.id.split("_")[1] === "5") {
        isDisabled.value = false;
    }
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
        isDisabled.value = false;
        for (const num of dataFromPaste) {
            if (!keysAllowed.includes(num)) event.preventDefault();
        }
    }
}

const countDownTimer = () => {
    let interval = setInterval(() => {
        if (countDown.value > 0) {
            countDown.value--;
        } else {
            clearInterval(interval);
            isResendLink.value = true;
        }
    }, 1000)
}

const sendOTP = async () => {
    if(email.value != "") {
        isLoadingLogin.value = true;
        try {
            const result = await genOTP(email.value);
            if (result === 429) {
                console.error("Too many requests to send otp.");
                createNotification("Too many requests to send otp.", "error");
            }
            else if (result === 200) {
                show.value = !show.value;
                email.value = email.value.toLowerCase();
                countDownTimer();
            }
        } catch (err) {
            console.log(err);
            createNotification(err as string, "error");
        } finally {
            isLoadingLogin.value = false;
        }
    } else {
        createNotification("Please enter email to continue", "error");
    }
}

const resendOTP = async() => {
    countDown.value = 60;
    isResendLink.value = false;
    countDownTimer();
    const result = await genOTP(email.value);
    if (result === 429) {
        console.error("Too many requests to send otp.");
        createNotification("Too many requests to send otp.", "error");
    }
}

const verifyOTP = async () => {
    isRateExceeded.value = false;
    otpValidataionFailed.value = false;
    isLoading.value = true;
    try {
        const result = await validateOTP(email.value, code.join(""));
        if (result?.code === 200) {
            router.push(store.returnUrl || "/");
        } else if (result?.code === 429) {
            isRateExceeded.value = true;
        } else if (result?.code === 400) {
            if (!isRateExceeded.value) {
                otpValidataionFailed.value = true;
            }
        }
    } catch (err) {
        console.log(err);
        createNotification(err as string, "error");
    } finally {
        isLoading.value = false;
    }
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
.twitter-btn {
    background-color: #1DA1F2;
    color: white;
    padding: 18px 20px;
    margin-top: 10px;
    margin-bottom: 20px;
    width: 100%;
    height: auto;
    border-radius: 10px;
    border: none; }
.twitter-btn:hover {
    background-color: rgba(29, 161, 242, 0.8); }
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