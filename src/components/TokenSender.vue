<template>
    <a-modal
        v-model:visible="showSend"
        @cancel="clearSendInput"
        :title="token.balance + ' ' + token.symbol"
        style="width: 100%; max-width: 800px;"
    >
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
                    <a-input-number v-model:value="sendInput.amount" style="width: calc(100% - 100px); min-width: 100px;"></a-input-number>
                    <a-button
                        type="primary"
                        size="small"
                        class="action"
                        @click="sendInput.amount = token.balance"
                    >
                        Max
                    </a-button>
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
        <a-row justify="center" v-if="sendInput.step == 2">
           <a-spin></a-spin>
        </a-row>
        <a-row justify="center" v-if="sendInput.step == 3">
            <a-typography-paragraph
                :copyable="{ text: sendInput.response.txHash }"
                style="margin-top: 10px;"
            >
                Transaction sent, transaction id is {{sendInput.response.txHash}}
            </a-typography-paragraph>
        </a-row>
        <a-row justify="center">
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
                @click="executeSending()"
                :disabled="!validateSendAmount(sendInput.amount).success"
            >
                Send
            </a-button>
            <a-button
                v-if="sendInput.step == 1"
                style="margin-left: 8px"
                @click="sendInput.step--"
            >
                Previous
            </a-button>
        </a-row>
        <template #footer></template>
    </a-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Rule } from 'ant-design-vue/es/form';
import * as ethers from "ethers";

import {
    prettyPrintAddress,
    type Token,
} from "@/services/ethers";
import type { Contact } from "@/services/contacts";
import { validateEmail } from '@/services/validator';

export interface SendInput {
    receiver: string,
    amount: number,
    step: number,
    response: {
        txHash: string,
    },
}

const contacts = ref<Contact[]>([
    {
        displayName: "Jack",
        email: "jack@gmail.com",
    },
    {
        displayName: "Rebecca",
        email: "rebecca@outlook.com",
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
        title: 'Executing',
    },
    {
        title: 'Done',
    }
];

const props = defineProps({
  showSend: {
    type: Boolean,
    required: true,
  },
  token: {
    type: Object as () => Token,
    required: true,
  }
});

const sendInput = ref<SendInput>({
    receiver: "",
    amount: 0,
    step: 0,
    response: {
        txHash: "",
    }
});

const emit = defineEmits(['close']);
const clearSendInput = function() {
    sendInput.value = {
        receiver: "",
        amount: 0,
        step: 0,
        response: {
            txHash: "",
        }
    };
    emit('close')
};

const validateSendAmount = function(value: number) {
    let maxAllowed = props.token.balance;
    if (value <= 0) {
        return {message: 'Amount must be higher than 0'};
    } else if (value > maxAllowed) {
        return {message: 'Amount cannot be higher than your balance'};
    } else {
        return {success: true};
    }
}

const sendAmountValidator = async function(_rule: Rule, value: number) {
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

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const executeSending = async function() {
    sendInput.value.step++;
    // sendInput.value.response.txHash = (await send(
    //     props.token,
    //     sendInput.value.receiver,
    //     sendInput.value.amount,
    // )).txHash;
    await sleep(3000);
    sendInput.value.response.txHash = "0x12345";
    sendInput.value.step++;
}
</script>

