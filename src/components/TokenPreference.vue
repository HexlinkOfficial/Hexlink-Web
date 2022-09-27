<template>
    <a-button
        size="large"
        block
        type="primary"
        style="width: 100%; max-width: 800px;"
        @click="() => showAddToken = true"
    >
        Add Token
    </a-button>
    <a-modal
        v-model:visible="showAddToken"
        title="Add new token"
    >
        <a-input-search
            placeholder="search by name or address"
            enter-button
            style="margin-top: 10px; margin-bottom: 30px;"
            @search="onSearch"
        />
        <a-spin v-if="searching"></a-spin>
        <a-list v-if="!showImport" :data-source="tokenListToShow">
            <template #renderItem="{ item }">
                <a-row style="margin-top: 10px;" justify="space-between">
                    <a-col>
                        <span style="font-weight: bold;">{{item.metadata.name}}&nbsp;&nbsp;</span>
                        <span>{{item.metadata.symbol}}</span>
                        <br/>
                        <a-typography-paragraph v-if="item.address == '0x'"></a-typography-paragraph>
                        <a-typography-paragraph
                            :copyable="{text: item.address}"
                            style="font-size: 0.8em;"
                            v-if="item.address != '0x'"
                        >
                            Contract Address: {{prettyPrintAddress(item.address)}}
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
        <a-form v-if="showImport" :model="tokenToImport">
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
                <a-input v-model:value="tokenToImport.preference!.displayName"></a-input>
            </a-form-item>
            <a-form-item
                label="Symbol"
                name="symbol"
                :rules="[{ required: true, message: 'Symbol not found' }]"
            >
                <a-input v-model:value="tokenToImport.metadata!.symbol" disabled></a-input>
            </a-form-item>
            <a-form-item
                label="Decimals"
                name="decimals"
                :rules="[{ required: true, message: 'Decimals not found' }]"
            >
                <a-input v-model:value="tokenToImport.metadata!.decimals" disabled></a-input>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="addToken">Add</a-button>
            </a-form-item>
        </a-form>
        <template #footer></template>
    </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useAuthStore } from '@/stores/auth';
import {
    setERC20Preferences,
    updateERC20Preference
} from '@/services/graphql/preferences';
import { loadERC20Token } from "@/services/web3/tokens";
import type { Token, TokenMetadata } from "@/services/web3/tokens";
import * as ethers from "ethers";
import { isContract, prettyPrintAddress } from '@/services/web3/wallet';
import { message } from "ant-design-vue";
import type { Preference } from "@/services/graphql/preferences";

const props = defineProps({
    tokens: {
        type: Object as () => Token[],
        required: true,
    },
    wallet: {
        type: String,
        required: true,
    },
});

const DEFAULT_TOKEN = {
    address: "",
    metadata: {
        name: "",
        symbol: "",
        decimals: 18,
    } as TokenMetadata,
    preference: {
        id: 0,
        displayName: "",
        display: true
    } as Preference,
};

const store = useAuthStore();
const showAddToken = ref<boolean>(false);
const tokenToImport = ref<Token>({...DEFAULT_TOKEN});
const searching = ref<boolean>(false);
const showImport = ref<boolean>(false);
const searchText = ref<string>("");
const tokenListToShow = ref<Token[]>([]);
const updatingPreference = ref<{[key: string]: boolean}>({});

watch(
  () => props.tokens,
  async (newValue, _) => {
    await genTokenList(searchText.value, newValue);
  }
);

const onSearch = async (text: string) => {
    searching.value = true;
    showImport.value = false;
    await genTokenList(text, props.tokens);
    searching.value = false;
}

const search = (token: Token, text: string) => {
    return [
        token.metadata?.name,
        token.metadata?.symbol,
        token.preference?.displayName
    ].filter(t => !!t).join(" ").toLowerCase().includes(text);
}

const genTokenList = async (text: string, tokenList: Token[]) => {
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
    } else if (await isContract(text)) {
        try {
            const token = await loadERC20Token(text, props.wallet);
            showImport.value = true;
            tokenToImport.value = {
                ...token,
                preference: {
                    id: 0,
                    displayName: token.metadata!.name!,
                    display: true
                }
            }
        } catch (err: any) {
            console.log("Failed to load erc20 token details" + err);
        }
    }
};

const emit = defineEmits(['preferenceUpdate', 'tokenAdded']);
const addToken = async () => {
    try {
        const [{id}] = await setERC20Preferences(
            store.currentUser!,
            store.idToken!,
            [{
                address: tokenToImport.value.address,
                chainId: import.meta.env.VITE_CHAIN_ID,
                display: tokenToImport.value.preference!.display,
                displayName: tokenToImport.value.preference!.displayName!
            }]
        );
        tokenToImport.value.preference!.id = id;
        emit('tokenAdded', tokenToImport);
        showAddToken.value = false;
        showImport.value = false;
        searchText.value = "";
        tokenToImport.value = {...DEFAULT_TOKEN};
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
            const preference = await updateERC20Preference(store.idToken!, {
                id: token.preference!.id,
                display: token.preference.display
            });
            emit(
                'preferenceUpdate',
                {
                    address: token.address,
                    preference
                }
            );
        } else {
            token.preference = {id: -1, display: true};
            const [{id}] = await setERC20Preferences(
                store.currentUser!,
                store.idToken!,
                [{
                    address: token.address,
                    chainId: Number(import.meta.env.VITE_CHAIN_ID),
                    display: true
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