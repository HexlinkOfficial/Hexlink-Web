<template>
    <a-list :data-source="props.tokens" style="width: 100%; max-width: 800px;">
        <template #renderItem="{ item }">
            <a-card style="margin-top: 20px;">
                <template #title>
                    <a-row align="middle">
                        <a-col style="margin-right: 20px;">
                            <a-tooltip v-if="item.address" placement="top" :title="item.address">
                                <a-avatar :src="item.metadata.logo || '/images/token.png'"/>
                            </a-tooltip>
                            <a-avatar v-if="!item.address" :src="item.metadata.logo || '/images/token.png'"/>
                        </a-col>
                        <a-col>
                            <span>{{item.preference?.display_name || item.metadata.name}}</span>
                            <br />
                            <span>Price: ${{item.price || 0}}</span>
                        </a-col>
                    </a-row>
                </template>
                <template #extra>
                    <a-row>
                        <a-col style="text-align: right;">
                            <span>{{item.balance?.normalized || 0}} {{item.metadata.symbol}}</span>
                            <br />
                            <span>${{item.balance?.normalized.times(item.price || 0).toString() || 0}}</span>
                        </a-col>
                        <a-col  style="margin-left: 10px; margin-right: 10px;">
                            <TokenSender
                                :disabled="!isDeployed || item.balance?.normalized.lte(0)"
                                :token="item"
                            ></TokenSender>
                        </a-col>
                        <a-col>
                            <a-tooltip>
                                <template #title>
                                    <span>Transaction History</span>
                                </template>
                                <a-button
                                    shape="round"
                                    href="'/activities?tokenContract=' + token.address"
                                >
                                    <template #icon><transaction-outlined /></template>
                                </a-button>
                            </a-tooltip>
                        </a-col>
                    </a-row>
                </template>
            </a-card>
        </template>
    </a-list>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { TransactionOutlined } from '@ant-design/icons-vue';
import TokenSender from "@/components/TokenSender.vue";
import type { Token } from "@/services/web3/tokens";
import { isContract } from "@/services/web3/wallet";

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

const isDeployed = computed(async () => {
    return await isContract(props.wallet);
});
</script>
