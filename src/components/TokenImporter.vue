<template>
    <a-modal v-model:visible="showImport" title="Token List" @ok="handleImport">
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
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Rule } from 'ant-design-vue/es/form';
import * as ethers from "ethers";

import { prettyPrintAddress } from "@/services/web3/wallet";
import { getETHPrice } from "@/services/web3/price";
import {
    loadTokenDetails,
    DEFAULT_TOKEN,
    type Token,
} from "@/services/web3/tokens";
import {
    getHexlinkMetadata,
    isContract,
    type IMetadata,
} from "@/services/web3/wallet";
import type { Contact } from "@/services/contacts";
import { validateEmail } from '@/services/validator';
import { BigNumber } from 'bignumber.js';
import { getIdTokenAndSetClaimsIfNecessary } from "@/services/auth";

const props = defineProps({
  showImport: {
    type: Boolean,
    required: true,
  },
  tokens: {
    type: Object as () => Token[],
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
} else if (props.tokens.value.find(t => t.address == value)) {
    return Promise.reject('Token already imported');
} else if (await isContract(value)) {
    const [token] = await loadTokenDetails([value], address.value!);
    tokenToImport.value = token;
    return Promise.resolve();
} else {
    return Promise.reject('Invalid address');
}

const handleImport = async function() {
    if (metadata.value?.wallet) {
        await subscribe(store.currentUser!, store.idToken!, {
            address: tokenToImport.value.address,
            chainId: import.meta.env.VITE_CHAIN_ID,
            protocol: 'ERC20'
        });
        tokens.value.push(tokenToImport.value);
        tokenToImport.value = {...DEFAULT_TOKEN};
    } else {
        message.warning('Wallet address not found');
    }
    showImport.value = false;
}
</script>