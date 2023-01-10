<template>
  <!-- <a-list>
<template #renderItem="{ item }"> -->
  <table>
    <thead>
      <tr>
        <th>Red Packet</th>
        <th>Amount/Rest</th>
        <th>Gas Station Enabled</th>
        <th>Gas Station Balance</th>
        <th>Split</th>
        <th>Mode</th>
        <!-- <th></th> -->
      </tr>
    </thead>
    <tbody>
      <tr v-for="(redPacket, i) in props.redPackets" :key="i" @click="showDetails()">
        <td>a link</td>
        <td>{{redPacket.metadata.balance}}/0</td>
        <td>{{redPacket.gas_station_enabled}}</td>
        <td>0</td>
        <td>{{redPacket.metadata.split}}</td>
        <td>{{redPacket.metadata.mode}}</td>
      </tr>
      <tr v-if="showDetailsEnabled">
        <td colspan=2>01/04/2023</td>
        <td colspan=4>ming claimed xxx Token</td>
      </tr>
    </tbody>      
  </table>
</template>

<script lang="ts" setup>
import * as ethers from "ethers";
import { ref } from 'vue';
import type { ParsedRedPacket } from '@/services/graphql/redpacket';

const showDetailsEnabled = ref<boolean>(false);
const props = defineProps({
  redPackets: {
    type: Object as () => ParsedRedPacket[],
    required: true,
  }
});

const showDetails = async function() {
  showDetailsEnabled.value = showDetailsEnabled.value ? false : true;
}

const getTransaction = async function() {
  const provider = new ethers.providers.EtherscanProvider("goerli");
  const txHash = "0x";
  const tx = await provider.getTransaction(txHash);
  console.log(tx);
}
</script>

<style lang="less" scoped>
tr:hover td {background:rgb(230, 227, 227)}
</style>
