<template>
    <a-row justify="center" align="bottom" style="min-height: 150px;">
        <a-typography-title>{{balance}} GoerliETH</a-typography-title>
    </a-row>
    <a-row justify="center" style="margin-bottom: 50px;">
        <a-button size="large" disabled>
            <template #icon><download-outlined /></template>
            Buy
        </a-button>
        <a-button
            size="large"
            style="margin-left: 20px; margin-right: 20px;"
            @click="handleSendETH"
            :disabled="balance == 0"
        >
            <template #icon><send-outlined /></template>
            Send
        </a-button>
        <a-button size="large" disabled>
            <template #icon><swap-outlined /></template>
            Swap
        </a-button>
    </a-row>
    <a-row justify="center">
        <a-spin v-if="loading" size="large" />
    </a-row>
    <a-row justify="center" v-for="(token, index) in tokens">
        <a-card style="margin: 20px; width: 100%; max-width: 800px;">
            <template #title>
                <a-tooltip placement="top" title="Explore at Etherscan">
                    <a :href="'https://goerli.etherscan.io/address/' + token.address">
                        <a-avatar src="/src/assets/token.png"/>
                    </a>
                </a-tooltip>
                <span style="margin-left: 15px; padding: 0px;">{{token.balance}}</span>
                <span style="margin-left: 5px; padding: 0px;">{{token.symbol}}</span>
            </template>
            <template #extra>
                <a-button
                    size="large"
                    @click="handleSendERC20(token.address)"
                    :disabled="token.balance == 0"
                >
                    Send
                </a-button>
            </template>
        </a-card>
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
    <a-modal v-model:visible="showSend" title="Token List" @ok="handleSend">
        <a-form :model="sendInput">
            <a-form-item
                label="Receiver"
                name="receiver"
                :rules="[{ validator: validateAddress, trigger: 'change' }]"
            >
                <a-input v-model:value="sendInput.receiver"></a-input>
            </a-form-item>
            <a-form-item
                label="Amount"
                name="amount"
                :rules="[{ validator: validateSendAmount, trigger: 'change' }]"
            >
                <a-input-number v-model:value="sendInput.amount"></a-input-number>
            </a-form-item>
        </a-form>
    </a-modal>
    <a-modal v-model:visible="showImport" title="Token List" @ok="handleImport">
        <a-form :model="importTokeInput">
            <a-form-item
                label="Address"
                name="address"
                :rules="[{ validator: validateContract, trigger: 'change' }]"
            >
                <a-input v-model:value="importTokeInput.address"></a-input>
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
import { SendOutlined, DownloadOutlined, SwapOutlined } from '@ant-design/icons-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';

import {
    isContract,
    getBalance,
    getYawMetadata,
    getERC20Metadata,
    normalizeBalance,
    getERC20Balance,
    getERC20Balances,
    type Token,
} from "@/services/ethers";
import type { IMetadata, IToken } from "@/services/ethers";
import tokenList from "@/services/tokens.json";
import ERC20 from "@/services/ERC20.json";
import * as ethers from "ethers";
import { send } from "process";

export interface SendInput {
    contract?: string,
    receiver: string,
    amount: number,
}

const loading = ref<boolean>(true);
const tokens = ref<Token[]>([]);
const metadata = ref<IMetadata | null>(null);
const balance = ref<number>(0);

const showImport = ref<boolean>(false);
const importTokeInput = ref<IToken>({
    address: "",
    symbol: "",
    decimals: 0,
});

const showSend = ref<boolean>(false);
const sendInput = ref<SendInput>({
    receiver: "",
    amount: 0,
});

onMounted(async () => {
    metadata.value = await getYawMetadata();
    const tempBalance = await getBalance(metadata.value);
    const tempTokens = await getERC20Balances(
        tokenList.tokens,
        metadata.value.wallet,
        ERC20
    );
    loading.value = false;
    balance.value = tempBalance;
    tokens.value = tempTokens;
});

const validateSendAmount = async function(_rule: Rule, value: number) {
    const contract = sendInput.value.contract;
    let maxAllowed = 0;
    if (contract) {
        maxAllowed = tokens.value.find(t => t.address == contract)!.balance;
    } else {
        maxAllowed = balance.value;
    }
    if (value < 0) {
        return Promise.reject('Amount must be higher than 0');
    } else if (value > maxAllowed) {
        return Promise.reject('Amount must be lower than your balance');
    } else {
        return Promise.resolve();
    }
}

const validateAddress = async function(_rule: Rule, value: string) {
    if (value === '') {
        return Promise.reject('Please input token contract address');
    } else if (ethers.utils.isAddress(value)) {
        return Promise.resolve();
    } else {
        return Promise.reject('Invalid address');
    }
}

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

const handleImport = async function() {
     const find = tokenList.tokens.find(
        (t: {address: string}) => t.address == importTokeInput.value.address
    );
    if (find) {
        message.warning('Token already added');
    } else {
        if (metadata.value?.wallet) {
            const balance = await getERC20Balance(
                importTokeInput.value.address,
                metadata.value.wallet,
                ERC20
            );
            const normalized = normalizeBalance(balance, importTokeInput.value.decimals);
            tokens.value.push({...importTokeInput.value, balance: normalized});
        } else {

        }
    }
    showImport.value = false;
}

const handleSendERC20 = async function(tokenContract: string) {
    showSend.value = true;
    sendInput.value.contract = tokenContract;
}

const handleSendETH = async function() {
    showSend.value = true;
    sendInput.value.contract = undefined;
}

const handleSend = async function() {
    showSend.value = false;
}
</script>