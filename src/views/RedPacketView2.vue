<template>
  <layout :active="1">
      <a-button
        shape="round"
        size="large"
        type="primary"
        @click="connectOrDisconnectWallet"
      >{{connection.connected ? "Disconnect" : "Connect Wallet"}}</a-button>
      <a-form :model="redpacket" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="Mode">
          <a-select v-model:value="redpacket.mode" style="width: 120px">
            <a-select-option value="random">Random</a-select-option>
            <a-select-option value="split">split</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <a-form-item label="Balance">
        <a-input-number v-model:value="redpacket.balance" style="width: 120px"></a-input-number>
        <a-select v-model:value="redpacket.token" style="width: 120px" :options="tokens">
        </a-select>
      </a-form-item>
      <a-form-item label="Split">
        <a-input-number v-model:value="redpacket.split" style="width: 120px"></a-input-number>
      </a-form-item>
      <a-form-item label="Enable gas sponsorship">
        <a-select
          v-model:value="redpacket.gasToken"
          style="width: 120px"
          :options="gasTokens"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="Choose account">
        <a-card title="Hexlink Account" :bordered="false" style="width: 200px; margin: 20px;">
          <p>Balance:</p>
          <p>{{ redpacket.token.label }}: 0</p>
          <p v-if="redpacket.gasToken !== 'undefined'">{{ redpacket.gasToken.label }}: 0</p>
        </a-card>
        <a-card title="External Account" :bordered="false" style="width: 200px">
          <p>Balance:</p>
          <p>{{ redpacket.token.label }}: 0</p>
          <p v-if="redpacket.gasToken !== 'undefined'">{{ redpacket.gasToken.label }}: 0</p>
        </a-card>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="createRedPacket">Create</a-button>
      </a-form-item>
  </layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Layout from "@/components/Layout.vue";
import type { Connection } from "@/interfaces/connection";
import { connectWallet, disconnectWallet } from "@/services/web3/connection";
import { ethers } from "ethers";

interface RedPacket {
  mode: "random" | "fixed";
  split: Number,
  balance: Number,
  token: {
    label: string,
    value: string,
  },
  gasToken: {
    label: string,
    value: string,
  } | "undefined",
  expiredAt: Number,
}

const redpacket = ref<RedPacket>({
  mode: "random",
  split: 0,
  balance: 0,
  token: {
    label: 'MATIC',
    value: ethers.constants.AddressZero,
  },
  gasToken: {
    label: "Disabled",
    value: "undefined",
  },
  expiredAt: 0 // do not expire
});

const tokens = [{
  label: "MATIC",
  value: {
    label: "MATIC",
    value: ethers.constants.AddressZero,
  }
}];

const gasTokens = [{
  label: "Disabled",
  value: "undefined",
},
{
  label: "MATIC",
  value: {
    label: "MATIC",
    value: ethers.constants.AddressZero,
  },
}];

const connection = ref<Connection>({
  connected: false
});

const connectOrDisconnectWallet = async function() {
  if (connection.value.connected) {
    connection.value = await disconnectWallet();
  } else {
    if (typeof window.ethereum == 'undefined') {
      console.log('MetaMask is not installed!');
    }
    connection.value = await connectWallet();
    console.log(connection.value.connected);
  }
};

const createRedPacket = async function() {
  
};

const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };
</script>

<style lang="less" scoped>
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>