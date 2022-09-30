<template>
    <a-row justify="center" style="margin-top: 100px;">
        <a-col flex="auto">
            <a-select
                v-model:value="filter.tokens"
                style="width: 100%; padding-right: 20px;"
                size="large"
                mode="multiple"
                placeholder="Select tokens"
                @change="handleTokeTypeChange"
            >
               <a-select-option
                    v-for="token in tokens"
                    :key="token.address"
                    :value="token.address"
                >
                    <a-tooltip>
                        <template #title>
                            {{token.preference?.display_name || token.metadata.name}} {{addressToShow(token.address)}}
                        </template>
                        {{token.metadata.symbol}}
                    </a-tooltip>
               </a-select-option>
            </a-select>
        </a-col> 
        <a-select
            v-model:value="filter.order"
            style="width: 120px"
            size="large"
            @change="handleSortChange"
        >
            <a-select-option value="desc">
                Latest
            </a-select-option>
            <a-select-option value="aesc">Oldest</a-select-option>
        </a-select>
    </a-row>
    <a-row v-if="loading" justify="center">
        <a-spin style="margin-top: 100px"></a-spin>
    </a-row>
    <a-list v-if="!loading" :data-source="activities" style="margin-top: 100px">
        <template #renderItem="{ item }">
            <a-card style="margin-top: 20px;">
                <template #title>
                    
                </template>
                <template #extra>
                    
                </template>
            </a-card>
        </template>
    </a-list>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getAssetTransfers, getAllVisiableTokens } from '@/services/web3/tokens';
import type { AssetTransfer, Token } from '@/services/web3/tokens';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router'
import { prettyPrintAddress } from '@/services/web3/wallet';

const store = useAuthStore();
const route = useRoute();
const loading = ref<boolean>(true);
    
const query = computed(() => route.query)
const filter = ref<{
    action:  'all' | 'send' | 'receive' | 'all',
    tokens: string[], // contract addresses
    order: 'aesc' | 'desc',
}>({tokens: [], action: 'all', order: 'desc'});

const tokens = ref<Token[]>([]);
const activities = ref<AssetTransfer[]>([]);

onMounted(async () => {
    const visiableTokens = await getAllVisiableTokens(store);
    tokens.value = Object.values(visiableTokens);
    activities.value = await getAssetTransfers({
        wallet: store.currentUser!.walletAddress!,
        category: ['erc20'],
        order: 'desc'
    });
    loading.value = false;
});

const addressToShow = (address: string) => {
    if (address == '0x') {
        return ""
    }
    return `(${prettyPrintAddress(address)})`;
}

const handleTokeTypeChange = () => {

};

const handleSortChange = () => {

};
</script>