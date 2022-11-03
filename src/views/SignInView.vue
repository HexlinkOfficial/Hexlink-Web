<template>
    <a-row justify="center" align="middle" style="height: 100%;">
        <a-col style="width: 100%;">
            <a-row justify="center">
                <img
                    src="/src/assets/logo.png"
                    height="100"
                    width="100"
                />
            </a-row>
            <a-row justify="center" class="title">
                <span>Hexlink: start your web3 journey</span>
            </a-row>
            <a-row justify="center" style="margin-top: 30px;">
                <a-button size="large" @click="google_login">
                    <img
                        src="/images/google.svg"
                        style="height: 20px; width: 20px; margin-right: 10px;"
                    />
                    <span>Sign In with Google</span>
                </a-button>
            </a-row>
            <a-row justify="center" style="margin-top: 5px;">
                <a-button size="large" @click="twitter_login">
                    <img
                        src="/images/twitter.svg"                    
                        style="height: 20px; width: 20px; margin-right: 10px;"
                    />
                    <span>Sign In with Twitter</span>
                </a-button>
            </a-row>
        </a-col>
    </a-row>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'; 
import { googleSocialLogin, twitterSocialLogin } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'

const store = useAuthStore();
const router = useRouter();

const google_login = async () => {
    await googleSocialLogin();
    router.push(store.returnUrl || "/");
}

const twitter_login = async () => {
    await twitterSocialLogin();
    router.push(store.returnUrl || "/");
}
</script>

<style lang="less" scoped>
.title {
    margin: 10px 0px 40px 0px;
    font-family: system-ui;
    font-size: 1.5em;
    font-weight: bold;
}
</style>