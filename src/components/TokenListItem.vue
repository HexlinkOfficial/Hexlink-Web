<template>
    <a-card style="margin: 20px; width: 100%; max-width: 800px">
        <template #title>
            <a-row align="middle">
                <a-col style="margin-right: 20px;">
                    <a-tooltip v-if="token.address" placement="top" :title="token.address">
                        <a-avatar :src="metadata.logo || '/images/token.png'"/>
                    </a-tooltip>
                    <a-avatar v-if="!token.address" :src="metadata.logo || '/images/token.png'"/>
                </a-col>
                <a-col>
                    <span>{{metadata.name}}</span>
                    <br />
                    <span>Price: ${{token.price || 0}}</span>
                </a-col>
            </a-row>
        </template>
        <template #extra>
            <a-row>
                <a-col style="text-align: right;">
                    <span>{{token.balance?.normalized || 0}} {{metadata.symbol}}</span>
                    <br />
                    <span>${{token.balance?.normalized.times(token.price || 0).toString() || 0}}</span>
                </a-col>
                <a-col  style="margin-left: 10px; margin-right: 10px;">
                    <a-button
                        shape="round"
                        :disabled="!isDeployed || token.balance?.normalized.lte(0)"
                        @click="showSend = true"
                    >
                        <template #icon><send-outlined /></template>
                        Send
                    </a-button>
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
                <a-modal
                    v-model:visible="showSend"
                    @cancel="showSend = false"
                    v-if="token.balance?.value.gt(0)"
                    :title="'You have ' + token.balance!.normalized + ' ' + metadata.symbol"
                    style="width: 100%; max-width: 800px;"
                >
                    <TokenSender
                        :token="token"
                        :balance="balance"
                    ></TokenSender>
                    <template #footer></template>
                </a-modal>
            </a-row>
        </template>
    </a-card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
    SendOutlined,
    TransactionOutlined,
} from '@ant-design/icons-vue';
import TokenSender from "@/components/TokenSender.vue";
import type { Token } from "@/services/web3/tokens";
import { isContract } from "@/services/web3/wallet";

const showSend = ref<boolean>(false);
const props = defineProps({
  token: {
    type: Object as () => Token,
    required: true,
  },
  wallet: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  }
});

const metadata = computed(() => {
    return {
        name: props.token.preference?.display_name || props.token.metadata.name,
        symbol: props.token.metadata.symbol,
        decimals: props.token.metadata.decimals,
        logo: props.token.metadata.logo,
    };
})

const isDeployed = computed(async () => {
    return await isContract(props.wallet);
});
</script>
