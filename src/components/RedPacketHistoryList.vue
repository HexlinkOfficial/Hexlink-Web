<template>
  <!-- <a-list>
<template #renderItem="{ item }"> -->
  <div v-if="props.luckHistory" class="token-listDetail">
    <div class="token-table">
      <div style="overflow: visible; border-radius: 0.75rem;">
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Amount/Rest</th>
              <th>Split</th>
              <th>Mode</th>
              <th>CreatedAt</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(redPacket, i) in redPackets" :key="i" @click="showDetails()">
              <td>{{ metadata(redPacket.metadata.token).symbol }}/0</td>
              <td>{{ redPacket.metadata.balance }}/0</td>
              <td>{{ redPacket.metadata.split }}</td>
              <td>{{ redPacket.createdAt }}</td>
              <td>
                <a-button @click="refund" disabled>
                  Refund
                </a-button>
                <a-typography-paragraph :copyable="{ text: claimLink(redPacket) }">
                  Claim Link
                </a-typography-paragraph>
              </td>
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
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getERC20Metadata } from '@/web3/tokens';
import { useProfileStore } from "@/stores/profile";
import { useNetworkStore } from '@/stores/network';
import { getRedPacketsByUser } from '@/graphql/redpacket';
import type { RedPacketDB } from '@/graphql/redpacket';
import type { TokenMetadata } from '@/types';
import type { BigNumber as EthBigNumber } from "ethers";
import { queryRedPacketInfo } from "@/web3/redpacket";

interface RedPacketAggregated {
  redPacket: RedPacketDB,
  token: TokenMetadata,
  state: {
    balance: EthBigNumber,
    split: EthBigNumber
  }
};

const redPackets = ref<RedPacketAggregated[]>([]);
const profileStore = useProfileStore();

const loadData = async function() {
  if (useProfileStore().profile?.initiated) {
    const rps : RedPacketDB[] = await getRedPacketsByUser();
    redPackets.value = await Promise.all(rps.map(r => aggregate(r)));
  }
}

onMounted(loadData);
watch(() => useNetworkStore().network, loadData);

const showDetailsEnabled = ref<boolean>(false);
const props = defineProps({
  luckHistory: {
    type: Boolean,
    required: true,
  }
});

const refund = () => {
  console.log("Not supported yet");
};

const claimLink = (redPacket: RedPacketDB) => {
  return useRoute().path + "/id=" + redPacket.id
};

const showDetails = async function() {
  showDetailsEnabled.value = showDetailsEnabled.value ? false : true;
};

const metadata = (tokenAddr: string): TokenMetadata => {
  return profileStore.profile.tokens[tokenAddr.toLowerCase()].metadata;
}

const aggregate = async function(redPacket: RedPacketDB) : Promise<RedPacketAggregated> {
  const state = await queryRedPacketInfo(redPacket);
  const tokenAddr = redPacket.metadata.token.toLowerCase();
  if (!profileStore.profile.tokens[tokenAddr]) {
    profileStore.addToken({metadata: await getERC20Metadata(tokenAddr)});
  }
  const token = profileStore.profile.tokens[tokenAddr];
  return {
    redPacket,
    token: token.metadata,
    state
  } as RedPacketAggregated;
};
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
