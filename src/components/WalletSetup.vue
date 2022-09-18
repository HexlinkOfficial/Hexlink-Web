<template>
    <a-modal
        v-model:visible="props.showSetup"
        title="Wallet Setup"
        @cancel="clearSetupInput()"
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
                    Wallet address to setup: {{props.address}}
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
import * as ethers from "ethers";

import { getETHPrice, deployWallet, prettyPrintTxHash} from "@/services/ethers";

export interface SetupInput {
    step: number,
    deploying: boolean,
    confirming: boolean,
    gasEstimation: {
        baseCost: ethers.BigNumber,
        maxCost: ethers.BigNumber,
        ethPrice: number,
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
    showSetup: {
        type: Boolean,
        required: true,
    },
    email: String,
    address: String,
});

const refreshServiceFee = async function() {
    const ethPrice = await getETHPrice();
    const gasEstimation = {
        baseCost: ethers.utils.parseEther("0.000014750958658"),
        maxCost: ethers.utils.parseEther("0.000054750958658"),
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
        baseCost: ethers.BigNumber.from(0),
        maxCost: ethers.BigNumber.from(0),
        ethPrice: 0,
    },
    response: {
        txHash: "",
    }
};
const setupInput = ref<SetupInput>({...EMPTY_INPUT});
const emit = defineEmits(['close', 'deployed']);
const clearSetupInput = function() {
    setupInput.value.step = 0;
    setupInput.value.confirming = false;
    setupInput.value.deploying = false;
    emit('close');
};

const executeDeploy = async function() {
    setupInput.value.step++;
    setupInput.value.deploying = true;
    setupInput.value.response.txHash = (await deployWallet()).txHash;
    setupInput.value.deploying = false;
    emit('deployed');
}

const baseCostAsETH = computed(() => {
    return  Number(ethers.utils.formatEther(
        setupInput.value.gasEstimation.baseCost
    ));
});

const baseCostAsUSD = computed(() => {
    return baseCostAsETH.value * setupInput.value.gasEstimation.ethPrice;
});

const maxCostAsETH = computed(() => {
    return Number(ethers.utils.formatEther(
        setupInput.value.gasEstimation.maxCost
    ));
});

const maxCostAsUSD = computed(() => {
    return maxCostAsETH.value * setupInput.value.gasEstimation.ethPrice
});
</script>