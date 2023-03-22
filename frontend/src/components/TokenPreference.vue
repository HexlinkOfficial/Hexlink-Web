<template>
    <a-button
        size="large"
        block
        type="primary"
        style="width: 100%; max-width: 800px;"
        @click="onAddToken"
    >
        Add Token
    </a-button>
    <a-modal
        v-model:visible="showPreference"
        title="Add new token"
    >
        <a-input-search
            placeholder="search by name or address"
            enter-button
            style="margin-top: 10px; margin-bottom: 30px;"
            v-model:value="searchText"
            @search="onSearch"
        />
        <a-spin v-if="searching"></a-spin>
        <a-list v-if="!showImport" :data-source="tokenListToShow">
            <template #renderItem="{ item }">
                <a-row style="margin-top: 10px;" justify="space-between">
                    <a-col>
                        <span v-if="item.preference?.token_alias && item.preference?.token_alias !== item.metadata.name" style="font-weight: bold;">
                            {{item.preference?.token_alias}}&nbsp;({{item.metadata.name}})&nbsp;&nbsp;
                        </span>
                        <span v-if="!item.preference?.token_alias || item.preference?.token_alias == item.metadata.name" style="font-weight: bold;">
                            {{item.metadata.name}}&nbsp;&nbsp;
                        </span>
                        <span>{{item.metadata.symbol}}</span>
                        <br/>
                        <a-typography-paragraph v-if="item.address == '0x'"></a-typography-paragraph>
                        <a-typography-paragraph
                            :copyable="{text: item.address}"
                            style="font-size: 0.8em;"
                            v-if="item.address != '0x'"
                        >
                            Contract Address: {{prettyPrintAddress(item.metadata.address)}}
                        </a-typography-paragraph>
                    </a-col>
                    <a-col>
                        <div @click="handleClick(item)">
                            <a-switch
                                :checked="item.preference?.display || false"
                                :loading="updatingPreference[item.address]"
                            />
                        </div>
                    </a-col>
                </a-row>
            </template>
        </a-list>
        <a-form v-if="showImport" :model="tokenToImport" @finish="addToken">
            <a-form-item
                label="Contract Address"
                name="address"
                :rules="[{ required: true, trigger: 'change' }]"
            >
                <a-input v-model:value="tokenToImport.metadata.address" disabled></a-input>
            </a-form-item>
            <a-form-item
                label="Name"
                name="name"
                :rules="[{ required: true, message: 'Name is not set' }]"
            >
                <a-input v-model:value="tokenToImport.metadata.name"></a-input>
            </a-form-item>
            <a-form-item
                label="Symbol"
                name="symbol"
                :rules="[{ required: true, message: 'Symbol not found' }]"
            >
                <a-input v-model:value="tokenToImport.metadata.symbol" disabled></a-input>
            </a-form-item>
            <a-form-item
                label="Decimals"
                name="decimals"
                :rules="[{ required: true, message: 'Decimals is found' }]"
            >
                <a-input v-model:value="tokenToImport.metadata.decimals" disabled></a-input>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit">Add</a-button>
            </a-form-item>
        </a-form>
        <template #footer></template>
    </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useAuthStore } from '@/stores/auth';
import {
    insertTokenPreferences,
    updateTokenPreference
} from '@/graphql/preference';
import { loadErc20Token } from "@/web3/tokens";
import type { Token } from "../../../functions/common";
import * as ethers from "ethers";
import { prettyPrintAddress, isContract } from "../../../functions/common";
import { message } from "ant-design-vue";
import { useChainStore } from "@/stores/chain";

const props = defineProps({
    tokens: {
        type: Object as () => {[key: string]: Token},
        required: true,
    },
});

const DEFAULT_TOKEN = {
    address: "",
    name: "",
    symbol: "",
    decimals: 18,
    chain: "",
    chainId: "",
};

const store = useAuthStore();
const showPreference = ref<boolean>(false);
const tokenToImport = ref<Token>({...DEFAULT_TOKEN});
const searching = ref<boolean>(false);
const showImport = ref<boolean>(false);
const searchText = ref<string>("");
const tokenListToShow = ref<Token[]>([]);
const updatingPreference = ref<{[key: string]: boolean}>({});

const chain = computed(() => useChainStore().chain.name);

watch(
  () => props.tokens,
  async (newValue, _) => {
    await genTokenList(searchText.value, newValue);
  }
);

const onAddToken = async() => {
    await genTokenList(searchText.value, props.tokens);
    showPreference.value = true;
}

const onSearch = async (text: string) => {
    searching.value = true;
    showImport.value = false;
    await genTokenList(text, props.tokens);
    searching.value = false;
}

const search = (token: Token, text: string) => {
    return [
        token.name,
        token.symbol,
        token.preference?.tokenAlias
    ].filter(t => !!t).join(" ").toLowerCase().includes(text);
}

const genTokenList = async (text: string, tokenMap: {[key: string]: Token}) => {
    const tokenList = Object.values(tokenMap);
    text = text.trim().toLowerCase();
    if (!text) {
        tokenListToShow.value = tokenList;
    }
    if (!ethers.utils.isAddress(text)) {
        tokenListToShow.value =  tokenList.filter(
            t => search(t, text)
        );
    }
    const filtered = tokenList.filter(
        t => t.address.toLowerCase() == text
    );
    if (filtered.length > 0) {
        tokenListToShow.value =  filtered;
    } else if (await isContract(useChainStore().provider, text)) {
        try {
            const token = await loadErc20Token(text);
            tokenToImport.value = token;
            showImport.value = true;
        } catch (err: any) {
            console.log("Failed to load erc20 token details" + err);
        }
    }
};

const emit = defineEmits(['preferenceUpdate', 'tokenAdded']);
const addToken = async () => {
    try {
        const [id] = await insertTokenPreferences(
            store.user!,
            [{
                tokenAddress: tokenToImport.value.address,
                chain: useChainStore().chain.name,
                display: true,
                tokenAlias: tokenToImport.value.name,
                metadata: tokenToImport.value,
            }]
        );
        tokenToImport.value.preference = {
            id: id.id,
            display: true,
            tokenAlias: tokenToImport.value.name,
        };
        emit('tokenAdded', tokenToImport.value);
        showPreference.value = false;
        showImport.value = false;
        searchText.value = "";
        tokenToImport.value = {...DEFAULT_TOKEN};
        await genTokenList(searchText.value, props.tokens);
    } catch(err: any) {
        message.error("Failed to add the token");
    }
}

const handleClick = async (token: Token) => {
    const prevPreference = token.preference;
    updatingPreference.value[token.address] = true;
    try {
        if (token.preference) {
            token.preference.display = !token.preference.display;
            const updated = {
                id: token.preference!.id,
                display: token.preference.display
            };
            await updateTokenPreference(store.user!, updated);
            emit(
                'preferenceUpdate',
                {
                    address: token.address,
                    preference: updated
                }
            );
        } else {
            token.preference = {id: -1, display: true};
            const [{id}] = await insertTokenPreferences(
                store.user!,
                [{
                    tokenAddress: token.address,
                    chain: useChainStore().chain.name,
                    display: true,
                    metadata: tokenToImport.value
                }]
            );
            token.preference = {id, display: true};
            emit(
                'preferenceUpdate',
                {
                    address: token.address,
                    preference: { id, display: true }
                }
            );
        }
    } catch (err: any) {
        token.preference = prevPreference;
        message.error("Failed to connect error");
    }
    updatingPreference.value[token.address] = false;
}
</script>