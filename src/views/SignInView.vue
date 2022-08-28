<template>
    <a-row justify="center" align="middle" style="height: 100%;">
        <a-col>
            <a-row justify="center">
                <img
                    src="/src/assets/logo.png"
                    height="150"
                    width="150"
                />
            </a-row>
            <a-row justify="center" class="title">
                <span>Yaw: start your path to web3</span>
            </a-row>
            <a-row justify="center" class="ma-0">
                <a-button size="large" @click="login">
                    <img
                        src="/images/google.svg"
                        style="height: 20px; width: 20px; margin-right: 10px;"
                    />
                    <span>Sign In with Google</span>
                </a-button>
            </a-row>
        </a-col>
    </a-row>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { socialLogin } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'

const store = useAuthStore();
const router = useRouter();

const login = async () => {
    await socialLogin();
    router.push(store.returnUrl || "/");
}
</script>

<style lang="less" scoped>
.title {
    margin: 0px 0px 20px 0px;
    font-family: system-ui;
    font-size: 1.5em;
    font-weight: bold;
}
</style>