<template>
    <a-input-search
        :value="searchText"
        placeholder="search by name or address"
        enter-button
        style="margin-top: 10px; margin-bottom: 30px;"
        @search="onSearch"
    />
    <a-spin v-if="searching"></a-spin>
    <a-list v-if="showMode == 'list'" :data-source="tokenListToShow">
        <template #renderItem="{ item }">
            <a-row style="margin-top: 10px;" justify="space-between">
                <a-col>
                    <span style="font-weight: bold;">{{item.name}}&nbsp;&nbsp;</span>
                    <span>{{item.symbol}}</span>
                    <br/>
                    <a-typography-paragraph :copyable="{text: item.address}" style="font-size: 0.8em;">
                        Contract Address: {{prettyPrintAddress(item.address)}}
                    </a-typography-paragraph>
                </a-col>
                <a-col>
                    <a-switch v-model:checked="item.display" @change="handleChange(item)"/>
                </a-col>
            </a-row>
        </template>
    </a-list>
    <a-form v-if="showMode == 'import'" :model="tokenToImport">
        <a-form-item
            label="Contract Address"
            name="address"
            :rules="[{ required: true, trigger: 'change' }]"
        >
            <a-input v-model:value="tokenToImport.address" disabled></a-input>
        </a-form-item>
        <a-form-item
            label="Name"
            name="name"
            :rules="[{ required: true, message: 'Name not found' }]"
        >
            <a-input v-model:value="tokenToImport.displayName"></a-input>
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
            <a-button type="primary" @click="addToken">Add</a-button>
        </a-form-item>
    </a-form>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from '@/stores/auth';
import {
    setERC20Preference,
    updateERC20Preference
} from '@/services/graphql/preferences';
import { loadERC20Token } from "@/services/web3/tokens";
import type { Token } from "@/services/web3/tokens";
import * as ethers from "ethers";
import { isContract, prettyPrintAddress } from '@/services/web3/wallet';
import { message } from "ant-design-vue";

export interface TokenToImport {
    address: string,
    name: string,
    symbol: string,
    decimals: number,
    displayName: string,
    display: boolean,
}

const store = useAuthStore();
const tokenList = ref<TokenToImport[]>([]);

const DEFAULT_TOKEN = {
    address: "",
    name: "",
    symbol: "",
    decimals: 18,
    displayName: "",
    display: true,
} as TokenToImport;

const props = defineProps({
    tokens: {
        type: Object as () => Token[],
        requried: true,
    },
    wallet: {
        type: String,
        required: true,
    },
});

const handleChange = (token: Token) => async (display: boolean) => {
    if (!!(token.preference?.display) == display) {
        return;
    }
    await updateERC20Preference(store.idToken!, {
        id: token.preference!.id,
        display
    });
}

const tokenToImport = ref<TokenToImport>({...DEFAULT_TOKEN});
const searching = ref<boolean>(false);
const showMode = ref<"import" | "list">("list");
const searchText = ref<string>();
const tokenListToShow = ref<any[]>([]);

const genSearchString = (token: Token) => {
    return [
        token.metadata?.name,
        token.metadata?.symbol,
        token.preference?.displayName
    ].filter(t => !!t).join(" ").toLowerCase();
}

const tokensToSearch = computed(() => {
    return (props.tokens || []).map(t => ({
        ...t,
        toSearch: genSearchString(t)
    }));
});

const onSearch= async (text: string) => {
    text = text.trim().toLowerCase();
    searching.value = true;
    showMode.value = "list";
    if (!text) {
        tokenListToShow.value = tokensToSearch.value;
        searching.value = false;
        return;
    }

    if (ethers.utils.isAddress(text)) {
        tokenListToShow.value = tokenList.value.filter(
            t => t.address.toLowerCase() == text.toLowerCase()
        );
        if (tokenListToShow.value.length == 0 && await isContract(text)) {
            showMode.value = "import";
            const token = await loadERC20Token(text, props.wallet);
            tokenToImport.value = {
                address: token.address,
                name: token.metadata?.name || "",
                symbol: token.metadata?.symbol || "",
                displayName: token.metadata?.name || "",
                decimals: token.metadata?.decimals || 18,
                display: true,
            }
        }
    } else {
        tokenListToShow.value = tokensToSearch.value.filter(
            t => t.toSearch.includes(text)
        );
    }
    searching.value = false;
}

const emit = defineEmits(['subscribed']);
const addToken = async () => {
    const result = await setERC20Preference(store.currentUser!, store.idToken!, {
        address: tokenToImport.value.address,
        chainId: import.meta.env.VITE_CHAIN_ID,
        display: tokenToImport.value.display,
        displayName: tokenToImport.value.displayName!
    });
    if (result) {
        emit('subscribed', {...tokenToImport, subscription: result?.id});
        showMode.value = "list";
        tokenToImport.value = {...DEFAULT_TOKEN};
    } else {
        message.error("Failed to add the token");
    }
}
</script>