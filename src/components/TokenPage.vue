<template>
    <a-row justify="center" align="bottom" style="min-height: 150px;">
        <a-col style="text-align: center;">
            <span style="font-size: 2em; font-weight: bold;">${{dynamicBalance.toString() || 0}}</span>
            <br />
            <span style="font-size: 1.2em;">Total Assets </span>
            <span style="font-size: 1.2em; font-weight: bold;"> ${{totalAssets.toString() || 0}}</span>
        </a-col>
    </a-row>
    <a-row justify="center" style="margin-top: 20px; margin-bottom: 20px;">
        <a-button size="large" class="action" disabled>
            <template #icon><download-outlined /></template>
            Deposit
        </a-button>
        <a-button size="large" class="action" disabled>
            <template #icon><upload-outlined /></template>
            Withdraw
        </a-button>
        <a-button size="large" class="action" disabled>
            <template #icon><shopping-cart-outlined  /></template>
            Buy Token
        </a-button>
        <a-button size="large" class="action" disabled>
            <template #icon><swap-outlined /></template>
            Swap Token
        </a-button>
    </a-row>
    <a-row v-if="!isDeployed" justify="center" align="middle" style="margin: 20px;">
        <WalletSetup
            :email="user?.email || ''"
            :wallet="wallet!"
        ></WalletSetup>
    </a-row>
    <a-row v-if="wallet" justify="center" style="margin: 50px 20px 20px 20px;">
        <TokenPreference
            :tokens="(tokens as Token[])"
            :wallet="wallet!"
            @tokenAdded="handleTokenAdded"
            @preferenceUpdate="handlePreferenceUpdate"
        ></TokenPreference>
    </a-row>
    <a-row justify="center" v-if="wallet" v-for="token in visiableTokens">
        <TokenListItem
            :token="(token as Token)"
            :wallet="wallet"
            :balance="dynamicBalance.toNumber()"
        ></TokenListItem>
    </a-row>
    <a-row v-if="loading" justify="center" style="margin-top: 40px">
        <a-spin size="large" />
    </a-row>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import {
    DownloadOutlined,
    SwapOutlined,
    UploadOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons-vue';

import { loadAllERC20Tokens } from "@/services/web3/tokens";
import type { Token } from "@/services/web3/tokens";
import {
    getHexlinkMetadata,
    isContract,
    type IMetadata,
} from "@/services/web3/wallet";
import TokenListItem from "@/components/TokenListItem.vue";
import WalletSetup from "@/components/WalletSetup.vue";
import TokenPreference from "@/components/TokenPreference.vue";
import { useAuthStore } from '@/stores/auth';
import { BigNumber } from "bignumber.js";
import TOKEN_LIST from '@/data/TOKENS.json';
import {
    getERC20Preferences,
    setERC20Preferences
} from "@/services/graphql/preferences";

const store = useAuthStore();
const user = store.currentUser;

const loading = ref<boolean>(true);
const tokens = ref<Token[]>([]);
const metadata = ref<IMetadata | null>(null);
const wallet = ref<string>();

const loadTokenList = async (wallet: string) : Promise<Token[]> => {
    const preferences = await getERC20Preferences(
        store.currentUser!,
        store.idToken!,
        Number(import.meta.env.VITE_CHAIN_ID),
    );
    const tokens = await loadAllERC20Tokens(
        TOKEN_LIST,
        preferences,
        wallet
    );
    await setERC20Preferences(
        store.currentUser!,
        store.idToken!,
        tokens.tokensToSetPreference
    );
    return tokens.tokens;
}

onMounted(async () => {
    metadata.value = await getHexlinkMetadata(user?.email);
    wallet.value = metadata.value.wallet;

    tokens.value = await loadTokenList(wallet.value!);
    loading.value = false;
});

const visiableTokens = computed(() => {
    return tokens.value.filter(t => t.preference?.display || false);
});

const handlePreferenceUpdate = async function(params: any) {
    tokens.value.forEach(t => {
        if (t.address == params.address) {
            t.preference = params.preference;
        }
    });
}

const handleTokenAdded = async function(token: Token) {
    tokens.value.push(token);
}

const totalAssets = computed(() => {
    let total: BigNumber = BigNumber(0);
    for (const token of visiableTokens.value) {
        if (token.balance && token.price) {
            total = total.plus(token.balance.normalized.times(token.price));
        }
    }
    return total.plus(BigNumber(dynamicBalance.value));
});

const dynamicBalance = computed(() => {
    return BigNumber(Math.floor(Math.random() * 100));
});

const isDeployed = computed(async() => {
    return await isContract(wallet.value);
})
</script>

<style lang="less" scoped>
.action {
    margin: 0px 10px 0px 10px;
}
</style>