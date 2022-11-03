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
                <span>Hexlink: start your web3 path</span>
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
import { googleSocialLogin, twitterSocialLogin } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import { validateEmail } from '@/services/validator';
import { accountAddress } from "@/services/web3/account";
import { message } from "ant-design-vue";

const store = useAuthStore();
const router = useRouter();
const email = ref<string>("");
const address = ref<string>("");
const translating = ref<boolean>(false);

const onTranslate = async () => {
    translating.value = true
    if (validateEmail(email.value)) {
        address.value = await accountAddress(email.value);
    } else {
        message.warning("Please input a valid email")
    }
    translating.value = false;
}

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
    margin: 0px 0px 20px 0px;
    font-family: system-ui;
    font-size: 1.5em;
    font-weight: bold;
}
</style>