<template>
    <a-row justify="center" style="margin-top: 100px;">
        <a-col flex="auto">
            <a-select
                v-model:value="selected"
                style="width: 100%;"
                size="large"
                mode="multiple"
                placeholder="Select tokens"
                @change="handleTokenSelection"
            >
               <a-select-option
                    v-for="token in tokens"
                    :key="token.address"
                    :value="token.address"
                >
                    <a-tooltip>
                        <template #title>
                            {{token.preference?.token_alias || token.metadata.name}} {{addressToShow(token.address)}}
                        </template>
                        {{token.metadata.symbol}}
                    </a-tooltip>
               </a-select-option>
            </a-select>
        </a-col>
    </a-row>
    <a-row v-if="loading" justify="center">
        <a-spin style="margin-top: 100px"></a-spin>
    </a-row>
    <a-list v-if="!loading" :data-source="activities" style="margin-top: 100px">
        <template #renderItem="{ item }">
            <a-card style="margin-top: 20px;">
                <template #title>
                    <a-typography-text v-if="item.action.type == 'send'" :copyable="{ text: item.action.to! }">
                        To
                        <a :href="'https://goerli.etherscan.io/address/' + item.action.to">
                            {{prettyPrintAddress(item.action.to!) }}
                        </a>
                    </a-typography-text>
                    <a-typography-text v-if="item.action.type == 'receive'" :copyable="{ text: item.action.from! }">
                        From
                        <a :href="'https://goerli.etherscan.io/address/' + item.action.from">
                            {{prettyPrintAddress(item.action.from!) }}
                        </a>
                    </a-typography-text>
                </template>
                <template #extra>
                    <span v-if="item.action.type == 'send'">
                        {{ '-' + item.amount.normalized.toString() }} {{ item.asset.metadata.symbol }}
                    </span>
                    <span v-if="item.action.type == 'receive'">
                        {{ '+' + item.amount.normalized.toString() }} {{ item.asset.metadata.symbol }}
                    </span>
                </template>
                <a-row justify="space-between">
                    <a-typography-text :copyable="{ text: item.tx.hash }">
                        Transaction:
                        <a :href='"https://goerli.etherscan.io/tx/" + item.tx.hash'>
                            {{ prettyPrintTxHash(item.tx.hash) }}
                        </a>
                    </a-typography-text>
                    <a-typography-text>
                        {{ prettyPrintTimestamp(item.tx.timestamp) }}
                    </a-typography-text>
                </a-row>

            </a-card>
        </template>
    </a-list>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAssetTransfers, getAllVisiableTokens } from '@/services/web3/tokens';
import type { AssetTransfer, Token } from '@/services/web3/tokens';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { prettyPrintAddress, prettyPrintTxHash, prettyPrintTimestamp } from '@/services/web3/account';

const store = useAuthStore();
const route = useRoute();
const loading = ref<boolean>(true);
const selected = ref<string[]>(
    (route.query["tokens"] as string || "").split(',').filter(s => s.trim().length > 0)
);
const tokens = ref<Token[]>([]);
const activities = ref<AssetTransfer[]>([]);

const loadActivities = async (selected: string[]) => {
    let params = {
        wallet: store.currentUser!.walletAddress!,
        order: 'desc',
        category: [] as string[],
        contractAddresses: [] as string[],
    };
    if (selected.length == 0) {
        params.category = ['external', 'internal', 'erc20'];
        params.contractAddresses = tokens.value.map(
            t => t.address
        ).filter(t => t && t != '0x');
    } else {
        selected.forEach(address => {
            if (address == '0x') {
                params.category.push('external');
                params.category.push('internal');
            } else {
                if (!params.category.includes('erc20')) {
                    params.category.push('erc20');
                }
                params.contractAddresses.push(address);
            }
        });
    }
    return await getAssetTransfers(params);
};

onMounted(async () => {
    const chain = "GOERLI";
    const visiableTokens = await getAllVisiableTokens(store, chain);
    tokens.value = Object.values(visiableTokens);
    activities.value = await loadActivities(selected.value);
    loading.value = false;
});

const addressToShow = (address: string) => {
    if (address == '0x') {
        return ""
    }
    return `(${prettyPrintAddress(address)})`;
}

const router = useRouter();
const handleTokenSelection = async () => {
    loading.value = true;
    activities.value = await loadActivities(selected.value);
    loading.value = false;
    if (selected.value.length > 0) {
        router.push({path: "/activities", query: { tokens: selected.value.join(",")}});
    } else {
        router.push("/activities");
    }
};
</script>