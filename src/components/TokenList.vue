<template>
    <a-row justify="center" align="bottom" style="min-height: 150px;">
        <a-typography-title>$ {{metadata?.balance || 0}}</a-typography-title>
    </a-row>
    <a-row justify="center" style="margin-bottom: 50px;">
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
        <a-button size="large" class="action">
            <template #icon><swap-outlined /></template>
            Swap
        </a-button>
    </a-row>
    <a-row justify="center" style="margin-top: 20px;">
        <a-button
            size="large"
            block
            type="primary"
            style="width: 100%; max-width: 800px;"
            @click="() => showImport = true"
        >
            Import Token
        </a-button>
    </a-row>
    <a-row justify="center" style="margin-top: 30px">
        <a-spin v-if="loading" size="large" />
    </a-row>
    <a-row justify="center" v-for="(token, index) in tokens">
        <a-card style="margin: 20px; width: 100%; max-width: 800px">
            <template #title>
                <a-tooltip placement="top" title="Explore at Etherscan">
                    <a :href="'https://goerli.etherscan.io/address/' + token.contract">
                        <a-avatar src="/src/assets/token.png"/>
                    </a>
                </a-tooltip>
                <span style="margin-left: 15px; padding: 0px;">{{token.balance}}</span>
                <span style="margin-left: 5px; padding: 0px;">{{token.symbol}}</span>
            </template>
            <template #extra>
                <a-button
                    shape="round"
                    @click="handleSend(token)"
                >
                    <template #icon><send-outlined /></template>
                    Send
                </a-button>
                <a-tooltip>
                    <template #title>
                        <span>Transaction History</span>
                    </template>
                    <a-button
                        style="margin-left: 10px;"
                        shape="round"
                        href="'/transactions?tokenContract=' + token.contract"
                    >
                        <template #icon><transaction-outlined /></template>
                    </a-button>
                </a-tooltip>
            </template>
        </a-card>
    </a-row>
    <TokenSender :token="tokenToSend" :showSend="showSend" @close="showSend = false"></TokenSender>
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
import { ref, onMounted } from "vue";
import { SendOutlined, DownloadOutlined, SwapOutlined, UploadOutlined, TransactionOutlined } from '@ant-design/icons-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';

import {
    isContract,
    getYawMetadata,
    getERC20Metadata,
    normalizeBalance,
    getTokenBalance,
    getBalances,
    type Token,
} from "@/services/ethers";
import type { IMetadata, IToken } from "@/services/ethers";
import tokenList from "@/services/tokens.json";
import ERC20 from "@/services/ERC20.json";
import TokenSender from "@/components/TokenSender.vue";

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

onMounted(async () => {
    metadata.value = await getYawMetadata();
    const tempTokens = await getBalances(
        tokenList.tokens,
        metadata.value.wallet
    );
    loading.value = false;
    tokens.value = tempTokens;
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
</script>

<style lang="less" scoped>
.action {
    margin: 0px 10px 0px 10px;
}
</style>