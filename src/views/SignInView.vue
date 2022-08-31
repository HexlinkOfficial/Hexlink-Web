<template>
    <a-row justify="center" align="middle" style="height: 100%;">
        <a-col style="width: 100%;">
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
            <a-row justify="center" style="margin-top: 30px;">
                <a-button size="large" @click="login">
                    <img
                        src="/images/google.svg"
                        style="height: 20px; width: 20px; margin-right: 10px;"
                    />
                    <span>Sign In with Google</span>
                </a-button>
            </a-row>
            <a-row justify="center" style="margin-top: 30px; width: 100%;">
                <a-input-search
                    v-model:value="email"
                    placeholder="Input your email"
                    enter-button="Check Address"
                    @search="onTranslate()"
                    style="max-width: 500px;"
                >
                </a-input-search>
            </a-row>
            <a-row justify="center" style="margin-top: 10px; width: 100%;">
                <a-spin v-if="translating"></a-spin>
                <a-typography-paragraph
                    v-if="address"
                    :copyable="{ text: address }"
                    style="margin-top: 10px;"
                >
                    Your address is {{ address }}
                </a-typography-paragraph>
            </a-row>
        </a-col>
    </a-row>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from 'vue-router'; 
import { socialLogin } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import { validateEmail } from '@/services/validator';
import { genAddress } from "@/services/ethers";
import YawAdmin from "@/services/YawAdmin.json";
import YawWallet from "@/services/YawWallet.json";
import { message } from "ant-design-vue";

const store = useAuthStore();
const router = useRouter();
const email = ref<string>("");
const address = ref<string>("");
const translating = ref<boolean>(false);

const onTranslate = async () => {
    translating.value = true
    if (validateEmail(email.value)) {
        address.value = await genAddress(email.value, YawAdmin, YawWallet);
    } else {
        message.warning("Please input a valid email")
    }
    translating.value = false;
}

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