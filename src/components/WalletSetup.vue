<template>
    <a-alert
        message="Your account is not setup yet. To send or swap tokens, please setup your account first."
        type="warning"
    >
    </a-alert>
    <a-button
        style="margin-left: 5px"
        type="primary"
        size="small"
        @click="showSetup = true"
    >
        Setup
    </a-button>
    <a-modal
        v-model:visible="showSetup"
        title="Setup your account"
        style="width: 100%; max-width: 600px; padding-left: 50px; padding-right: 50px;"
    >
    <a-steps :current="setupInput.step">
        <a-step v-for="item in sendSteps" :key="item.title" :title="item.title" />
        </a-steps>
        <a-row style="margin-top: 40px;" v-if="setupInput.step == 0">
            <a-col>
                <a-typography-paragraph
                    style="margin-top: 10px;"
                >
                    Email: {{props.email}}
                </a-typography-paragraph>
                <a-typography-paragraph
                    style="margin-top: 10px;"
                >
                    Wallet address to setup: {{props.wallet}}
                </a-typography-paragraph>
                <a-row v-if="setupInput.confirming" style="margin-top: 10px;">
                    <span>Estimating service Fee </span>
                    <a-spin style="margin-left: 10px;"></a-spin>
                </a-row>
                <a-row align="middle" v-if="!setupInput.confirming" style="margin-top: 10px;">
                    <a-col style="min-width: 400px;">
                        <span>Base service Fee: ${{baseCostAsUSD.toFixed(2)}}</span>
                        <br />
                        <span>Max service Fee: ${{maxCostAsUSD.toFixed(2)}}</span>
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
        <a-row justify="center" v-if="setupInput.step == 1" style="margin-top: 40px;">
            <a-spin v-if="setupInput.deploying"></a-spin>
            <a-typography-paragraph
                v-if="!setupInput.deploying"
                :copyable="{ text: setupInput.response.txHash }"
            >
                Transaction sent, transaction id is {{prettyPrintTxHash(setupInput.response.txHash)}}
            </a-typography-paragraph>
        </a-row>
        <a-row justify="center" style="margin-top: 20px;">
            <a-button
                v-if="setupInput.step == 0"
                type="primary"
                @click="executeDeploy()"
            >
                Confirm
            </a-button>
        </a-row>
        <template #footer></template>
    </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

import { getETHPrice } from "@/services/web3/price";
import { deployWallet, prettyPrintTxHash} from "@/services/web3/wallet";
import BigNumber from "bignumber.js";

export interface SetupInput {
    step: number,
    deploying: boolean,
    confirming: boolean,
    gasEstimation: {
        baseCost: BigNumber,
        maxCost: BigNumber,
        ethPrice: BigNumber,
    },
    response: {
        txHash: string,
    },
};

const sendSteps = [
    {
        title: 'Confirm',
    },
    {
        title: 'Execute',
    }
];

const props = defineProps({
    email: {
        type: String,
        required: true,
    },
    wallet: {
        type: String,
        required: true,
    }
});

const showSetup = ref<boolean>(false);

const refreshServiceFee = async function() {
    const ethPrice = await getETHPrice();
    const gasEstimation = {
        baseCost: BigNumber("0.000014750958658"),
        maxCost: BigNumber("0.000054750958658"),
    }
    setupInput.value.gasEstimation = {...gasEstimation, ethPrice}
}

onMounted(async () => {
    setupInput.value.confirming = true;
    await refreshServiceFee();
    setupInput.value.confirming = false;
});

const EMPTY_INPUT: SetupInput = {
    step: 0,
    confirming: false,
    deploying: false,
    gasEstimation: {
        baseCost: BigNumber(0),
        maxCost: BigNumber(0),
        ethPrice: BigNumber(0),
    },
    response: {
        txHash: "",
    }
};
const setupInput = ref<SetupInput>({...EMPTY_INPUT});
const executeDeploy = async function() {
    setupInput.value.step++;
    setupInput.value.deploying = true;
    setupInput.value.response.txHash = (await deployWallet()).txHash;
    setupInput.value.deploying = false;
}

const baseCostAsETH = computed(() => {
    return setupInput.value.gasEstimation.baseCost;
});

const baseCostAsUSD = computed(() => {
    return baseCostAsETH.value.times(
        setupInput.value.gasEstimation.ethPrice
    );
});

const maxCostAsETH = computed(() => {
    return setupInput.value.gasEstimation.maxCost;
});

const maxCostAsUSD = computed(() => {
    return maxCostAsETH.value.times(
        setupInput.value.gasEstimation.ethPrice
    );
});
</script>