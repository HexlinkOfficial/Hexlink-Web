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
            :wallet="address!"
        ></WalletSetup>
    </a-row>
    <a-row justify="center" style="margin: 50px 20px 20px 20px;">
        <a-button
            size="large"
            block
            type="primary"
            style="width: 100%; max-width: 800px;"
            @click="() => showImport = true"
        >
            Add Token
        </a-button>
    </a-row>
    <a-row justify="center" v-if="address" v-for="token in tokens">
        <TokenListItem
            :token="(token as Token)"
            :wallet="address"
            :balance="dynamicBalance.toNumber()"
        ></TokenListItem>
    </a-row>
    <a-row v-if="loading" justify="center" style="margin-top: 40px">
        <a-spin size="large" />
    </a-row>
    <a-modal
        v-if="address"
        v-model:visible="showImport"
        title="Add new token"
    >
        <TokenImporter
            :tokens="tokens.map(t => t.address)"
            :wallet="address"
            @subscribed="subscribed"
        ></TokenImporter>
        <template #footer></template>
    </a-modal> 
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import {
    DownloadOutlined,
    SwapOutlined,
    UploadOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons-vue';

import {
    loadTokenDetails,
    getETHBalance,
    DEFAULT_BALANCE,
    type Token,
} from "@/services/web3/tokens";
import {
    getHexlinkMetadata,
    isContract,
    type IMetadata,
} from "@/services/web3/wallet";
import TOKEN_LIST from "@/data/TOKENS.json";
import TokenListItem from "@/components/TokenListItem.vue";
import WalletSetup from "@/components/WalletSetup.vue";
import TokenImporter from "@/components/TokenImporter.vue";
import { useAuthStore } from '@/stores/auth';
import { BigNumber } from "bignumber.js";

const store = useAuthStore();
const user = store.currentUser;

const loading = ref<boolean>(true);
const tokens = ref<Token[]>([{
    address: "",
    symbol: "ETH",
    decimals: 18,
    name: "Ethereum",
    logo: "",
    balance: DEFAULT_BALANCE,
    price: 1000,
}]);
const metadata = ref<IMetadata | null>(null);
const showImport = ref<boolean>(false);
const address = ref<string>();
onMounted(async () => {
    metadata.value = await getHexlinkMetadata(user?.email);
    address.value = metadata.value.wallet;
    tokens.value[0].balance = await getETHBalance(address.value!);
    const loadedTokens = 
    tokens.value = tokens.value.concat(await loadTokenDetails(
        TOKEN_LIST.tokens.map(t => t.contract),
        address.value!
    ));
    loading.value = false;
});

const subscribed = async function(token: Token) {
    showImport.value = false;
    tokens.value.push(token);
}

const totalAssets = computed(() => {
    let total: BigNumber = BigNumber(0);
    for (const token of tokens.value) {
        total = total.plus(token.balance.normalized.times(token.price!));
    }
    return total.plus(BigNumber(dynamicBalance.value));
});

const dynamicBalance = computed(() => {
    return BigNumber(Math.floor(Math.random() * 100));
});

const isDeployed = computed(async() => {
    return await isContract(address.value);
})
</script>

<style lang="less" scoped>
.action {
    margin: 0px 10px 0px 10px;
}
</style>