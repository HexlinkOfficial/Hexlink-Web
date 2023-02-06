<template>
  <div v-if="loading" class="loading-state">
    <Loading />
  </div>
  <!-- <div v-if="!loading" class="no-history">
    <div style="text-align: center;">You have no transaction history yet!</div>
  </div> -->
  <div v-if="!loading" class="transaction-detail">
    <div style="overflow: visible; border-radius: 0.75rem;">
      <div v-for="(value, name, index) in transactionByDate" :key="index" style="position: relative;">
        <div class="history-date">
          <div style="font-size: 0.875rem; line-height: 1.25rem;">{{ name }}</div>
        </div>
        <div v-for="(r, i) in value" :key="i" class="history-record">
          <div v-if="r.action.type == 'receive'" class="record-box">
            <div style="display: block; position: relative;">
              <div class="icon" style="background-color: #4BAE4F;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 7L17 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M17 7V17H7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>
            <div class="record-detail">
              <div class="action-and-time">
                <div style="display: block; margin-bottom: 0;">
                  <div style="display: flex;">
                    <div class="sent-info">
                      <div class="info-1">
                        Received
                      </div>
                    </div>
                  </div>
                  <div style="color: #6a6d7c; white-space: nowrap; margin-left: 0; font-size: 11px;">
                    <div style="display: flex;">{{ new Date(r.tx.timestamp).toLocaleString().split(',')[1]}}</div>
                  </div>
                </div>
              </div>
              <div class="token-amount">
                <div class="sent-info">
                  <a-tooltip placement="top">
                    <template #title>
                      <span>
                        Amount: {{ r.amount.normalized }}
                      </span>
                    </template>
                    <div style="overflow: auto; white-space: nowrap; margin-left: 0.25rem; width: 45px;display: flex;justify-content: flex-end;">
                      + {{ r.amount.normalized.toString().substring(0, 5) }}
                    </div>
                  </a-tooltip>
                  <div class="token-icon" style="margin-right: 0.25rem; margin-left: 0.25rem;">
                    <img :src="loadTokenLogo(r.asset.address)">
                  </div>
                  {{ r.asset.symbol }}
                </div>
              </div>
              <div class="claim-status">
                <div style="display: flex; align-items: center;">
                  <div class="arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 6L9 12L15 18" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <span class="thumb">
                      <img src="https://i.postimg.cc/15QJZwkN/profile.png" :size="64" referrerpolicy="no-referrer" />
                    </span>
                    <div style="display: flex; flex-direction: column; margin-left: 0.5rem;">
                      <span class="from-text">From</span>
                      <span style="font-size: 12px; color: rgb(100,116,139)">@dreambig_peter</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="share">
                <i class="fa fa-paper-plane share-button" aria-hidden="true" @click="copy('haha')"></i>
              </div>
              <div class="cta">
                <i className="fa fa-twitter"></i>
              </div>
            </div>
          </div>
          <div v-if="r.action.type == 'send'" class="record-box">
            <div style="display: block; position: relative;">
              <div class="icon" style="background-color: #4BAE4F;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 7L17 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M17 7V17H7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>
            <div class="record-detail">
              <div class="action-and-time">
                <div style="display: block; margin-bottom: 0;">
                  <div style="display: flex;">
                    <div class="sent-info">
                      <div class="info-1">
                        Received
                      </div>
                    </div>
                  </div>
                  <div style="color: #6a6d7c; white-space: nowrap; margin-left: 0; font-size: 11px;">
                    <div style="display: flex;">1:59:32 AM</div>
                  </div>
                </div>
              </div>
              <div class="token-amount">
                <div class="sent-info">
                  <a-tooltip placement="top">
                    <template #title>
                      <span>
                        Amount: 0.3145
                      </span>
                    </template>
                    <div
                      style="overflow: auto; white-space: nowrap; margin-left: 0.25rem; width: 45px;display: flex;justify-content: flex-end;">
                      + 0.3145
                    </div>
                  </a-tooltip>
                  <div class="token-icon" style="margin-right: 0.25rem; margin-left: 0.25rem;">
                    <img src="https://token.metaswap.codefi.network/assets/networkLogos/ethereum.svg">
                  </div>
                  gETH
                </div>
              </div>
              <div class="claim-status">
                <div style="display: flex; align-items: center;">
                  <div class="arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 6L9 12L15 18" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <span class="thumb">
                      <img src="https://i.postimg.cc/15QJZwkN/profile.png" :size="64" referrerpolicy="no-referrer" />
                    </span>
                    <div style="display: flex; flex-direction: column; margin-left: 0.5rem;">
                      <span class="from-text">From</span>
                      <span style="font-size: 12px; color: rgb(100,116,139)">@dreambig_peter</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="share">
                <i class="fa fa-paper-plane share-button" aria-hidden="true" @click="copy('haha')"></i>
              </div>
              <div class="cta">
                <i className="fa fa-twitter"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted } from 'vue';
import Loading from "@/components/Loading.vue";
import { copy } from "@/web3/utils";
import { getAssetTransfers, loadTokenLogo } from '@/web3/tokens';

const loading = ref<boolean>(false);
const transfer = ref<any>();
const transactionByDate = ref<any>([]);

const loadTransactions = async () => {
  const orderGroup: any = {};

  transfer.value = await getAssetTransfers({
    wallet: '0x4dD92D3b036a10733E85C2C3775935AAb515A653',
    category: ["external", "internal", "erc20", "erc721", "erc1155"],
  })
  // divide all transactions into group by dates
  transfer.value.forEach((t: any) => {
    const date = new Date(t.tx.timestamp).toLocaleString().split(',')[0];
    if (date in orderGroup) {
      orderGroup[date].push(t);
    } else {
      orderGroup[date] = new Array(t);
    }
  })

  const sortedGroup: any = {};
  var isDescending = true;
  Object.keys(orderGroup).sort((a, b) => isDescending
    ? new Date(b).getTime() - new Date(a).getTime()
    : new Date(a).getTime() - new Date(b).getTime()
  ).forEach((v) => {
    sortedGroup[v] = orderGroup[v];
  });
  transactionByDate.value = JSON.parse(JSON.stringify(sortedGroup));
  // reorder group
  const sortedTransaction: any = {};
  Object.keys(transactionByDate.value).forEach(v => {
    const time: any = [];
    transactionByDate.value[v].forEach((t: any) => {
      time.push(new Date(t.tx.timestamp).getTime());
    })
    const sortedArray: any[] = [];
    time.sort((a: number, b: number) => b - a).forEach((t: number) => {
      transactionByDate.value[v].forEach((time: any) => {
        new Date(time.tx.timestamp).getTime() == t && sortedArray.push(time);
      })
    })
    sortedTransaction[v] = sortedArray;
  })
  transactionByDate.value = JSON.parse(JSON.stringify(sortedTransaction));
};

onMounted(async () => {
  await loadTransactions();
  console.log(transactionByDate.value);
});
</script>

<style lang="less" scoped>
.loading-state {
  display: flex;
  padding: 0.5rem;
  align-items: center;
  justify-content: center;
  height: 450px;
  @media (max-width: 990px) {
    height: 150px; } }
.no-history {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 450px;
  @media (max-width: 990px) {
    height: 150px; } }
.transaction-detail {
  border-radius: 0.75rem;
  margin-top: 1rem;
  padding: 0.5rem;
  overflow: visible; }
.transaction-detail .token-table {
  display: flex;
  margin-left: -1rem;
  margin-right: -1rem;
  flex-direction: column;
  @media (min-width: 640px) {
    margin-left: 0;
    margin-right: 0; } }
.history-date {
  top: 0;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  margin-left: 0.875rem; }
.history-record {
  position: relative;
  padding-left: 1.5rem;
  padding-bottom: 0.5rem;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  cursor: pointer; }
.history-record:hover {
  box-shadow: rgb(39 44 49 / 7%) 8px 28px 50px, rgb(39 44 49 / 4%) 1px 6px 12px;
  transform: translate3d(0px, -1px, 0px) scale(1.01);
  transition: all 0.2s ease 0s; }
.record-box {
  display: flex;
  align-items: center;
  border-top: 1px solid #e5e7eb;
  height: 4.5rem;
  padding-top: 0.5rem; }
.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 55px;
  border-width: 1px;
  background-color: #FD4755; }
.record-detail {
  display: grid;
  padding-left: 1rem;
  padding-right: 1rem;
  overflow-x: visible;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-y: visible;
  align-items: center;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  flex: 1 1;
  width: 100%;
  @media (min-width: 1280px) {
    gap: 1.5rem; }
  @media (min-width: 1024px) {
    gap: 1.25rem; }
  @media (max-width: 990px) {
    grid-template-columns: repeat(7, minmax(0, 1fr)); } }
.action-and-time {
  display: flex;
  align-items: center;
  grid-column: span 1/span 1;
  margin-bottom: 0; }
.token-amount {
  display: flex;
  justify-content: center;
  align-items: center;
  grid-column: span 1/span 1;
  margin-bottom: 0;
  margin-left: -1.5rem; }
.sent-info {
  display: flex;
  flex-shrink: 1;
  white-space: nowrap;
  font-weight: 600;
  font-size: 12px;
  color: #000;
  @media (max-width: 990px) {
    flex-direction: column; } }
.claim-status {
  display: block;
  margin-left: 1rem;
  grid-column: span 2/span 2;
  @media (max-width: 990px) {
    margin-left: 1rem;
    grid-column: span 2/span 2; } }
.arrow {
  font-size: .875rem;
  line-height: 1.25rem;
  margin-left: 1rem;
  margin-right: 1rem; }
.thumb {
  display: flex;
  overflow: hidden;
  width: 40px;
  height: 40px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  &:hover {
    transform: translateY(-0.125rem); } }
.thumb img {
  border-radius: 50px;
  max-width: 30px; }
.from-text {
  font-weight: 600;
  font-size: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: rgb(15, 23, 42); }
.share {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 2rem;
  grid-column: span 1/span 1; }
.share img {
  max-width: 20px; }
.cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  grid-column: span 1/span 1; }
</style>