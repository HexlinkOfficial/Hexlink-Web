<template>
    <a-steps :current="sendInput.step">
        <a-step v-for="item in sendSteps" :key="item.title" :title="item.title" />
    </a-steps>
    <a-row style="margin-top: 40px;">
        <a-form
            :model="sendInput"
            v-if="sendInput.step <= 1"
            style="width: 100%;"
        >
            <a-form-item
                v-if="sendInput.step == 0"
                has-feedback
                label="Receiver"
                name="receiver"
                :rules="[{ validator: receiverValidator, trigger: 'change' }]"
            >
                <a-input v-model:value="sendInput.receiver" style="width: 100%;"></a-input>
            </a-form-item>
            <a-form-item
                v-if="sendInput.step == 1"
                has-feedback
                label="Amount"
                name="amount"
                :rules="[{ validator: sendAmountValidator, trigger: 'change' }]"
            >
                <a-input-search
                    v-model:value="sendInput.amount"
                    placeholder="Amount to send"
                    enter-button="Max"
                    @search="sendInput.amount = token.balance!.toString()"
                />
            </a-form-item>
        </a-form>
    </a-row>
    <a-row justify="center" v-if="sendInput.step == 0">
        <a-list item-layout="horizontal" :data-source="contacts" style="width: 100%;">
            <template #renderItem="{ item }">
            <a-list-item @click="setReceiver(item)">
                <a-list-item-meta
                    :description="item.email || prettyPrintAddress(item.address)"
                >
                    <template #title>
                        <a href="item.displayName">{{ item.displayName }}</a>
                    </template>
                    <template #avatar>
                        <a-avatar src="https://joeschmoe.io/api/v1/random" />
                    </template>
                </a-list-item-meta>
            </a-list-item>
            </template>
        </a-list>
    </a-row>
    <a-row justify="start" v-if="sendInput.step == 2">
        <a-col>
            <a-typography-paragraph
                style="margin-top: 10px;"
            >
                Receiver: {{sendInput.receiver}}
            </a-typography-paragraph>
            <a-typography-paragraph
                style="margin-top: 10px;"
            >
                Amount to send: {{sendInput.amount}}
            </a-typography-paragraph>
            <a-typography-paragraph
                style="margin-top: 10px;"
            >
                New Balance: {{token.balance!.normalized.minus(sendInput.amount)}}
            </a-typography-paragraph>
            <a-row v-if="sendInput.confirming" style="margin-top: 10px;">
                <span>Estimating service Fee </span>
                <a-spin style="margin-left: 10px;"></a-spin>
            </a-row>
            <a-row align="middle" v-if="!sendInput.confirming" style="margin-top: 10px;">
                <a-col style="min-width: 400px;">
                    <a-tooltip
                        v-if="sendInput.payETH"
                        placement="top"
                        :title="'ETH Price: $' + sendInput.gasEstimation.ethPrice"
                    >
                        <span>Base service Fee: {{baseCostAsETH}} ETH</span>
                        <br />
                        <span>Max service Fee: {{maxCostAsETH}} ETH</span>
                    </a-tooltip>
                </a-col>
                <a-col style="min-width: 400px;" v-if="!sendInput.payETH">
                    <span>Base service Fee: ${{baseCostAsUSD}}</span>
                    <br />
                    <span>Max service Fee: ${{maxCostAsUSD}}</span>
                </a-col>
                <a-col style="margin-left: 10px;">
                    <a-switch v-model:checked="sendInput.payETH"/>
                    <span style="margin-left: 10px;">Pay with ETH</span>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
    <a-row justify="center" v-if="sendInput.step == 3">
        <a-spin v-if="sendInput.sending"></a-spin>
        <a-typography-paragraph
            v-if="!sendInput.sending"
            :copyable="{ text: sendInput.response.txHash }"
            style="margin-top: 10px;"
        >
            Transaction sent, transaction id is {{sendInput.response.txHash}}
        </a-typography-paragraph>
    </a-row>
    <a-row justify="center" style="margin-top: 20px;">
        <a-button
            v-if="sendInput.step == 0"
            type="primary"
            @click="sendInput.step++"
            :disabled="!validateReceiver(sendInput.receiver).success"
        >
            Next
        </a-button>
        <a-button
            v-if="sendInput.step == 1"
            type="primary"
            @click="toConfirmSend()"
            :disabled="!validateSendAmount(sendInput.amount).success"
        >
            Next
        </a-button>
        <a-button
            v-if="sendInput.step == 2"
            type="primary"
            :disabled="sendInput.confirming"
            @click="executeSending()"
        >
            Execute
        </a-button>
        <a-button
            v-if="sendInput.step == 1"
            style="margin-left: 8px"
            @click="sendInput.step--"
        >
            Previous
        </a-button>
    </a-row>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Rule } from 'ant-design-vue/es/form';
import * as ethers from "ethers";

import { getETHPrice } from "@/services/web3/price";
import { 
    // estimateERC20Transfer,
    // estimateETHTransfer,
    send,
    type Token,
    type GasEstimation,
} from "@/services/web3/tokens";
import { prettyPrintAddress } from "@/services/web3/wallet";
import type { Contact } from "@/services/contacts";
import { validateEmail } from '@/services/validator';
import { BigNumber } from 'bignumber.js';

export interface GasEstimationWithPrice extends GasEstimation {
    ethPrice: BigNumber,
}

export interface SendInput {
    receiver: string,
    amount: string,
    step: number,
    sending: boolean,
    confirming: boolean,
    payETH: false,
    gasEstimation: GasEstimationWithPrice,
    response: {
        txHash: string,
    },
}

const contacts = ref<Contact[]>([
    {
        displayName: "Shu",
        email: "shudong2019@gmail.com",
    },
    {
        displayName: "IronChain",
        email: "ironchaindao@gmail.com",
    },
    {
        displayName: "Tom",
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    },
]);

const sendSteps = [
    {
        title: 'Set Receiver',
    },
    {
        title: 'Set Amount',
    },
    {
        title: 'Confirm',
    },
    {
        title: 'Execute',
    }
];

const props = defineProps({
  token: {
    type: Object as () => Token,
    required: true,
  },
  balance: {
    type: Number,
    required: true
  }
});

const EMPTY_INPUT: SendInput = {
    receiver: "",
    amount: "0",
    step: 0,
    sending: false,
    confirming: false,
    payETH: false,
    gasEstimation: {
        baseCost: BigNumber(0),
        maxCost: BigNumber(0),
        ethPrice: BigNumber(0),
    },
    response: {
        txHash: "",
    }
};
const sendInput = ref<SendInput>({...EMPTY_INPUT});
const validateSendAmount = function(value: string) {
    const amount = Number(value);
    let maxAllowed = props.token.balance.normalized;
    if (isNaN(amount)) {
        return {message: 'Invalid amount, please input a valid number'};
    } if (amount <= 0) {
        return {message: 'Amount must be higher than 0'};
    } else if (maxAllowed.lt(amount)) {
        return {message: 'Amount cannot be higher than your balance'};
    } else {
        return {success: true};
    }
}

const sendAmountValidator = async function(_rule: Rule, value: string) {
    const result = validateSendAmount(value);
    if (result.success) {
        return Promise.resolve();
    } else {
        return Promise.reject(result.message);
    }
}

const validateReceiver = function(receiver: string) {
    if (receiver == '') {
        return {message: "Please input token contract address"};
    } else if (ethers.utils.isAddress(receiver)) {
        return {success: true};
    } else if (validateEmail(receiver)) {
        return {success: true};
    } else {
        return {message: "InvalidAddress"};
    }
}

const receiverValidator = async function(_rule: Rule, value: string) {
    const result = validateReceiver(value);
    if (result.success) {
        return Promise.resolve();
    } else {
        return Promise.reject(result.message);
    }
}

const setReceiver = async function(contact: Contact) {
    sendInput.value.receiver = contact.email || contact.address || "";
}

const executeSending = async function() {
    sendInput.value.step++;
    sendInput.value.sending = true;
    sendInput.value.response.txHash = (await send(
        props.token,
        sendInput.value.receiver,
        Number(sendInput.value.amount),
    )).txHash;
    sendInput.value.sending = false;
}

const toConfirmSend = async function() {
    sendInput.value.step++;
    sendInput.value.confirming = true;
    const ethPrice: BigNumber = await getETHPrice();
    if (props.token.address) {
        // const gasEstimation = await estimateERC20Transfer(
        //     props.token,
        //     sendInput.value.receiver,
        //     Number(sendInput.value.amount)
        // );
        const gasEstimation = {
             baseCost: BigNumber("0.000014750958658"),
             maxCost: BigNumber("0.000054750958658"),
        }
        sendInput.value.gasEstimation = {...gasEstimation, ethPrice}
    } else {
        //const gasEstimation = await estimateETHTransfer();
        const gasEstimation = {
             baseCost: BigNumber("0.0000034750958658"),
             maxCost: BigNumber("0.000034750958658"),
        }
        sendInput.value.gasEstimation = {...gasEstimation, ethPrice};
    }
    sendInput.value.confirming = false;
}

const baseCostAsETH = computed(() => {
    return sendInput.value.gasEstimation.baseCost;
});

const baseCostAsUSD = computed(() => {
   return sendInput.value.gasEstimation.baseCost.times(
        sendInput.value.gasEstimation.ethPrice
    ).dp(2).toString();
});

const maxCostAsETH = computed(() => {
    return sendInput.value.gasEstimation.maxCost;
});

const maxCostAsUSD = computed(() => {
    return sendInput.value.gasEstimation.maxCost.times(
        sendInput.value.gasEstimation.ethPrice
    ).dp(2).toString();
});
</script>

