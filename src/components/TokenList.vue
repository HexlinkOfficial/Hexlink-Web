<template>
    <a-row justify="center" align="bottom" style="min-height: 150px;">
        <a-col style="text-align: center;">
            <span style="font-size: 2em; font-weight: bold;">${{dynamicBalance}}</span>
            <br />
            <span style="font-size: 1.2em;">Total Assets </span>
            <span style="font-size: 1.2em; font-weight: bold;"> ${{totalAssets}}</span>
        </a-col>
    </a-row>
    <a-row justify="center" style="margin-top: 20px; margin-bottom: 20px;">
        <a-button size="large" class="action">
            <template #icon><download-outlined /></template>
            Deposit
        </a-button>
        <a-button
            size="large"
            class="action"
        >
            <template #icon><upload-outlined /></template>
            Withdraw
        </a-button>
        <a-button
            size="large"
            class="action"
        >
            <template #icon><shopping-cart-outlined /></template>
            Buy Token
        </a-button>
        <a-button size="large" class="action" :disabled="!isWalletDeployed">
            <template #icon><swap-outlined /></template>
            Swap Token
        </a-button>
    </a-row>
    <a-row v-if="!isWalletDeployed" justify="center" align="middle" style="margin: 20px;">
        <a-alert
            message="You yaw account is not setup yet. To send or swap tokens, please setup your yaw account."
            type="warning"
        >
        </a-alert>
        <a-button
            style="margin-left: 5px"
            type="primary"
            size="small"
            @click="setupWallet()"
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
    <a-row v-if="loading" justify="center" style="margin-top: 40px">
        <a-spin size="large" />
    </a-row>
    <a-row justify="center" v-for="(token, index) in tokens">
        <a-card style="margin: 20px; width: 100%; max-width: 800px">
            <template #title>
                <a-row align="middle">
                    <a-col style="margin-right: 20px;">
                        <a-tooltip v-if="token.contract" placement="top" :title="token.contract">
                            <a-avatar src="/images/token.png"/>
                        </a-tooltip>
                        <a-avatar v-if="!token.contract" src="/images/token.png"/>
                    </a-col>
                    <a-col>
                        <span>{{token.name}}</span>
                        <br />
                        <span>Price: ${{token.price || 1000}}</span>
                    </a-col>
                </a-row>
            </template>
            <template #extra>
                <a-row>
                    <a-col style="text-align: right;">
                        <span>{{token.balance}} {{token.symbol}}</span>
                        <br />
                        <span>${{(token.price || 1000) * token.balance}}</span>
                    </a-col>
                    <a-col  style="margin-left: 10px; margin-right: 10px;">
                        <a-button
                            shape="round"
                            @click="handleSend(token)"
                            :disabled="!isWalletDeployed"
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
                                href="'/transactions?tokenContract=' + token.contract"
                            >
                                <template #icon><transaction-outlined /></template>
                            </a-button>
                        </a-tooltip>
                    </a-col>
                </a-row>
            </template>
        </a-card>
    </a-row>
    <TokenSender :token="tokenToSend" :showSend="showSend" @close="showSend = false"></TokenSender>
    <WalletSetup
        :showSetup="showSetup"
        :email="user?.email || ''"
        :address="address"
        @close="showSetup = false"
        @deployed="isWalletDeployed = true"
    ></WalletSetup>
    <a-modal v-model:visible="showImport" title="Token List" @ok="handleImport">
        <a-form :model="importTokeInput">
            <a-form-item
                label="Contract Address"
                name="contract"
                :rules="[{ validator: validateContract, trigger: 'change' }]"
            >
                <a-input v-model:value="importTokeInput.contract"></a-input>
            </a-form-item>
            <a-form-item
                label="Symbol"
                name="symbol"
                :rules="[{ required: true, message: 'Symbol not found' }]"
            >
                <a-input v-model:value="importTokeInput.symbol" disabled></a-input>
            </a-form-item>
            <a-form-item
                label="Decimals"
                name="decimals"
                :rules="[{ required: true, message: 'Decimals not found' }]"
            >
                <a-input v-model:value="importTokeInput.decimals" disabled></a-input>
            </a-form-item>
        </a-form>
    </a-modal>
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
import type { Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';

import {
    isContract,
    getYawMetadata,
    getERC20Metadata,
    normalizeBalance,
    getTokenBalance,
    getBalances,
    genAddress,
    type Token,
} from "@/services/ethers";
import type { IMetadata, IToken } from "@/services/ethers";
import tokenList from "@/services/tokens.json";
import ERC20 from "@/services/ERC20.json";
import TokenSender from "@/components/TokenSender.vue";
import WalletSetup from "@/components/WalletSetup.vue";

import { useAuthStore } from '@/stores/auth';
import YawAdmin from "@/services/YawAdmin.json";
import YawWallet from "@/services/YawWallet.json";

const store = useAuthStore();
const user = store.currentUser;

const loading = ref<boolean>(true);
const tokens = ref<Token[]>([]);
const metadata = ref<IMetadata | null>(null);

const showImport = ref<boolean>(false);
const importTokeInput = ref<IToken>({
    symbol: "",
    decimals: 0,
});

const showSend = ref<boolean>(false);
const tokenToSend = ref<Token>({
    decimals: 18,
    balance: 0,
    symbol: "",
});

const showSetup = ref<boolean>(false);
const setupWallet = function() {
    showSetup.value = true;
}

const address = ref<string>("");
const isWalletDeployed = ref<boolean>(true);
onMounted(async () => {
    address.value = await genAddress(user?.email, YawAdmin, YawWallet);
    isWalletDeployed.value = await isContract(address.value!);
    tokens.value = await getBalances(tokenList.tokens, address.value!);
    loading.value = false;
    metadata.value = await getYawMetadata();
});

const validateContract = async function(_rule: Rule, value: string) {
    if (value === '') {
        return Promise.reject('Please input token contract address');
    } else if (await isContract(value)) {
        const tokenMetadata = await getERC20Metadata(value, ERC20);
        importTokeInput.value.symbol = tokenMetadata.symbol;
        importTokeInput.value.decimals = tokenMetadata.decimals;
        return Promise.resolve();
    } else {
        return Promise.reject('Invalid address');
    }
}

const handleSend = async function(token: Token) {
    showSend.value = true;
    tokenToSend.value = token;
}

const handleImport = async function() {
    if (tokens.value.find(t => t.contract == importTokeInput.value.contract)) {
        message.warning('Token already added');
    } else {
        if (metadata.value?.wallet) {
            const balance = await getTokenBalance(
                importTokeInput.value.contract!,
                metadata.value.wallet
            );
            const normalized = normalizeBalance(balance, importTokeInput.value.decimals);
            tokens.value.push({...importTokeInput.value, balance: normalized});
        } else {

        }
    }
    showImport.value = false;
}

const totalAssets = computed(() => {
    let total: number = 0;
    for (const token of tokens.value) {
        total += (token.balance || 0) * (token.price || 0);
    }
    return total + dynamicBalance.value;
});

const dynamicBalance = computed(() => {
    const token = tokens.value.find(t => t.symbol === 'YAW');
    return (token?.balance || 0) * 0.01;
});
</script>

<style lang="less" scoped>
.action {
    margin: 0px 10px 0px 10px;
}
</style>