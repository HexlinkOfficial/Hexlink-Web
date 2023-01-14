<template>
  <!-- <a-list>
<template #renderItem="{ item }"> -->
  <div v-if="props.luckHistory" class="token-listDetail">
    <div class="token-table">
      <div style="overflow: visible; border-radius: 0.75rem;">
        <table>
          <thead>
            <tr>
              <th>Red Packet</th>
              <th>Amount/Rest</th>
              <th>Gas Station Balance</th>
              <th>Split</th>
              <th>Mode</th>
              <!-- <th></th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(redPacket, i) in props.redPackets" :key="i" @click="showDetails()">
              <td>a link</td>
              <td>{{ redPacket.metadata.balance }}/0</td>
              <td>0</td>
              <td>{{ redPacket.metadata.split }}</td>
              <td>{{ redPacket.metadata.mode }}</td>
            </tr>
            <tr v-if="showDetailsEnabled">
              <td colspan=2>01/04/2023</td>
              <td colspan=4>ming claimed xxx Token</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as ethers from "ethers";
import { ref } from 'vue';
import type { RedPacketDB } from '@/graphql/redpacket';

const showDetailsEnabled = ref<boolean>(false);
const props = defineProps({
  redPackets: {
    type: Object as () => RedPacketDB[],
    required: true,
  },
  luckHistory: {
  type: Boolean,
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
.token-listDetail {
  border-radius: 0.75rem;
  margin-top: 1.75rem;
  overflow: auto; }
  .token-listDetail .token-table {
    display: flex;
    margin-left: -1rem;
    margin-right: -1rem;
    flex-direction: column;
  
    @media (min-width: 640px) {
      margin-left: 0;
      margin-right: 0; } }
    .token-listDetail .token-table table {
      min-width: 100%;
      table-layout: auto;
      border-color: inherit;
      text-indent: 0; }
      .token-listDetail .token-table .table-thread {
        display: none;
        border-bottom: 1px solid #e5e7eb;
        @media (min-width: 640px) {
          display: table-header-group; } }
        .token-listDetail .token-table .table-thread .toke-header {
          font-weight: 400;
          cursor: pointer; }
          .token-listDetail .token-table .table-thread .toke-header .token-header-data {
            display: flex;
            align-items: center; }
        .token-listDetail .token-table .table-thread .portfolio-percentage-header {
          display: none;
          font-weight: 400;
          cursor: pointer;

          @media (min-width: 1024px) {
            display: table-cell; } }
          .token-listDetail .token-table .table-thread .portfolio-percentage-header .portfolio-percentage-header-data {
            display: flex;
            align-items: center; }
          .token-listDetail .token-table .table-thread .portfolio-percentage-header .portfolio-percentage-header-sign {
            display: flex;
            margin-left: 0.5rem;
            flex-direction: column;
            align-items: center; }
        .token-listDetail .token-table .table-thread .price-header {
          display: none;
          font-weight: 400;
          cursor: pointer;
        
          @media (min-width: 768px) {
            display: table-cell; } }
          .token-listDetail .token-table .table-thread .price-header .price-header-data {
            display: flex;
            align-items: center; }
        .token-listDetail .token-table .table-thread .balance-header {
          font-weight: 400;
          text-align: right;
          cursor: pointer;
        
          @media (min-width: 768px) {
            text-align: left; } }
          .token-listDetail .token-table .table-thread .balance-header .balance-header-data {
            display: flex;
            align-items: center; }
</style>
