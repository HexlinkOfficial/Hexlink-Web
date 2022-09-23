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
    <a-row v-if="!isWalletDeployed" justify="center" align="middle" style="margin: 20px;">
        <a-alert
            message="Your account is not setup yet. To send or swap tokens, please setup your account first."
            type="warning"
        >
        </a-alert>
        <a-button
            style="margin-left: 5px"
            type="primary"
            size="small"
            @click="showSetup = true"
        >
            Setup
        </a-button>
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
    <a-row justify="center" v-for="(token, index) in tokens">
        <a-card style="margin: 20px; width: 100%; max-width: 800px">
            <template #title>
                <a-row align="middle">
                    <a-col style="margin-right: 20px;">
                        <a-tooltip v-if="token.address" placement="top" :title="token.address">
                            <a-avatar :src="token.logo || '/images/token.png'"/>
                        </a-tooltip>
                        <a-avatar v-if="!token.address" :src="token.logo || '/images/token.png'"/>
                    </a-col>
                    <a-col>
                        <span>{{token.name || token.symbol}}</span>
                        <br />
                        <span>Price: ${{token.price || 0}}</span>
                    </a-col>
                </a-row>
            </template>
            <template #extra>
                <a-row>
                    <a-col style="text-align: right;">
                        <span>{{token.balance.normalized}} {{token.symbol}}</span>
                        <br />
                        <span>${{token.balance.normalized.times(token.price || 0).toString()}}</span>
                    </a-col>
                    <a-col  style="margin-left: 10px; margin-right: 10px;">
                        <a-button
                            shape="round"
                            :disabled="!isWalletDeployed || token.balance.normalized.lte(0)"
                            @click="handleSend(token as Token)"
                        >
                            <template #icon><send-outlined /></template>
                            Send
                        </a-button>
                    </a-col>
                    <a-col>
                        <a-tooltip>
                            <template #title>
                                <span>Transaction History</span>
                            </template>
                            <a-button
                                shape="round"
                                href="'/activities?tokenContract=' + token.address"
                            >
                                <template #icon><transaction-outlined /></template>
                            </a-button>
                        </a-tooltip>
                    </a-col>
                </a-row>
            </template>
        </a-card>
    </a-row>
    <a-row v-if="loading" justify="center" style="margin-top: 40px">
        <a-spin size="large" />
    </a-row>
    <TokenSender
        :token="tokenToSend"
        :showSend="showSend"
        @close="showSend = false"
        :balance="dynamicBalance.toNumber()"
    ></TokenSender>
    <WalletSetup
        :showSetup="showSetup"
        :email="user?.email || ''"
        :address="address"
        @close="showSetup = false"
        @deployed="isWalletDeployed = true"
    ></WalletSetup>
    
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import {
    SendOutlined,
    DownloadOutlined,
    SwapOutlined,
    UploadOutlined,
    TransactionOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import {
    loadTokenDetails,
    getETHBalance,
    DEFAULT_BALANCE,
    DEFAULT_TOKEN,
    type Token,
} from "@/services/web3/tokens";
import {
    getHexlinkMetadata,
    isContract,
    type IMetadata,
} from "@/services/web3/wallet";
import TOKEN_LIST from "@/data/TOKENS.json";
import TokenSender from "@/components/TokenSender.vue";
import WalletSetup from "@/components/WalletSetup.vue";
import { useAuthStore } from '@/stores/auth';
import { BigNumber } from "bignumber.js";
import { subscribe, unsubscribe } from "@/services/subscriptions.js";

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

const showSend = ref<boolean>(false);
const tokenToSend = ref<Token>({...DEFAULT_TOKEN});

const showSetup = ref<boolean>(false);

const address = ref<string>();
const isWalletDeployed = ref<boolean>(true);
onMounted(async () => {
    metadata.value = await getHexlinkMetadata(user?.email);
    address.value = metadata.value.wallet;
    isWalletDeployed.value = await isContract(address.value!);
    tokens.value[0].balance = await getETHBalance(address.value!);
    tokens.value = tokens.value.concat(await loadTokenDetails(
        TOKEN_LIST.tokens.map(t => t.contract),
        address.value!
    ));
    loading.value = false;
});

const handleSend = async function(token: Token) {
    showSend.value = true;
    tokenToSend.value = token;
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
</script>

<style lang="less" scoped>
.action {
    margin: 0px 10px 0px 10px;
}
</style>