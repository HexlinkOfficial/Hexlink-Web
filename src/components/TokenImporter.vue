<template>
    <a-form :model="tokenToImport">
        <a-form-item
            label="Contract Address"
            name="address"
            :rules="[{ required: true, validator: validateContract, trigger: 'change' }]"
        >
            <a-input v-model:value="tokenToImport.address"></a-input>
        </a-form-item>
        <a-form-item
            label="Name"
            name="name"
            :rules="[{ required: true, message: 'Name not found' }]"
        >
            <a-input v-model:value="tokenToImport.name" disabled></a-input>
        </a-form-item>
        <a-form-item
            label="Symbol"
            name="symbol"
            :rules="[{ required: true, message: 'Symbol not found' }]"
        >
            <a-input v-model:value="tokenToImport.symbol" disabled></a-input>
        </a-form-item>
        <a-form-item
            label="Decimals"
            name="decimals"
            :rules="[{ required: true, message: 'Decimals not found' }]"
        >
            <a-input v-model:value="tokenToImport.decimals" disabled></a-input>
        </a-form-item>
        <a-form-item>
            <a-button type="primary" @click="handleImport">Import</a-button>
        </a-form-item>
    </a-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Rule } from 'ant-design-vue/es/form';
import {
    loadTokenDetails,
    DEFAULT_TOKEN,
    type Token,
} from "@/services/web3/tokens";
import { isContract } from "@/services/web3/wallet";
import { subscribe } from "@/services/subscriptions.js";

import { useAuthStore } from '@/stores/auth';
const store = useAuthStore();

const props = defineProps({
  tokens: {
    type: Object as () => String[],
    required: true,
  },
  wallet: {
    type: String,
    required: true,
  }
});

const tokenToImport = ref<Token>({...DEFAULT_TOKEN});
const validateContract = async function(_rule: Rule, value: string) {
    if (value === '') {
        return Promise.reject('Please input token contract address');
    } else if (props.tokens.find(t => t == value)) {
        return Promise.reject('Token already imported');
    } else if (await isContract(value)) {
        const [token] = await loadTokenDetails([value], props.wallet);
        tokenToImport.value = token;
        return Promise.resolve();
    } else {
        return Promise.reject('Invalid address');
    }
}

const emit = defineEmits(['subscribed']);
const handleImport = async function() {
    await subscribe(store.currentUser!, store.idToken!, {
        address: tokenToImport.value.address,
        chainId: import.meta.env.VITE_CHAIN_ID,
        protocol: 'ERC20'
    });
    emit('subscribed', tokenToImport);
    tokenToImport.value = {...DEFAULT_TOKEN};
}
</script>
