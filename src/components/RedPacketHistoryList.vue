<template>
  <div v-if="loading" class="loading-state">
    <Loading />
  </div>
  <div v-if="redPackets.length == 0 && !loading" class="no-history">
    <div style="text-align: center;">You have no luck history yet! Go send some luck~</div>
  </div>
  <div v-if="!loading" class="token-listDetail">
    <div class="token-table">
      <div style="overflow: visible; border-radius: 0.75rem;">
        <div v-for="(value, name, index) in luckHistoryByDate" :key="index" style="position: relative; ">
          <div class="history-date">
            <div style="font-size: 0.875rem; line-height: 1.25rem;">{{ name }}</div>
          </div>
          <div v-for="(v, i) in value" :key="i" class="history-record">
            <div v-if="v.redPacket" class="record-box">
              <div style="display: block; position: relative;">
                <div class="icon">
                  <svg style="color:white;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-subdued">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </div>
              <div class="record-detail">
                <div class="action-and-time">
                  <div style="display: block; margin-bottom: 0;">
                    <div style="display: flex;">
                      <div class="sent-info">
                        <div class="info-1">
                          Sent
                          <a-tooltip placement="top">
                            <template #title>
                              <span>
                                Amount: {{ normalizedDbBalance(v) }}
                              </span>
                            </template>
                            <div style="overflow: auto; white-space: nowrap; margin-left: 0.25rem; max-width: 40px;">{{ normalizedDbBalance(v) }}
                            </div>
                          </a-tooltip>
                          <div class="token-icon" style="margin-right: 0.25rem; margin-left: 0.25rem;">
                            <img :src="v.token.logoURI">
                          </div>
                        </div>
                        <!-- <div class="info-2">
                          {{ v.redPacket.metadata.mode }}ly
                        </div> -->
                      </div>
                    </div>
                    <div style="color: #6a6d7c; white-space: nowrap; margin-left: 0; font-size: 12px;">
                      <div style="display: flex;">{{ new Date(v.redPacket.createdAt).toLocaleString().split(',')[1] }}</div>
                    </div>
                  </div>
                </div>
                <div class="claim-status">
                  <div class="progress-bar">
                    <span class="box-progress" :style="{
                      width: (v.redPacket.metadata.split - v.redPacket.state.split)/v.redPacket.metadata.split*100 + '%'
                    }"></span>
                  </div>
                  <div class="claimed-data">
                    <p class="claimed-number">
                      Claimed: 
                      <strong>{{
                        v.redPacket.metadata.split - v.redPacket.state.split
                      }}/{{ v.redPacket.metadata.split }}</strong>
                       Share
                    </p>
                    <p class="claim-mode">
                      Mode: 
                      <strong>{{ v.redPacket.metadata.mode }}</strong>
                    </p>
                    <p class="claimed-number">
                      Left:
                      <strong>{{ normalize(v.redPacket.state.balance, v.token) }}</strong>
                      <div class="token-icon" style="margin-right: 0.25rem; margin-left: 0.25rem;">
                        <img :src="v.token.logoURI">
                      </div>
                      {{ v.token.symbol }}
                    </p>
                  </div>
                </div>
                <div class="share">
                  <i class="fa fa-paper-plane" aria-hidden="true" @click="copyShareLink(v.redPacket)"></i>
                </div>
                <div class="cta">
                  <button class="connect-wallet-button">
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
            <div v-if="v.redpacket" class="record-box">
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
                          Claimed
                          <!-- <a-tooltip placement="top">
                            <template #title>
                              <span>
                                Amount: {{ normalizeClaimAmount(v) }}
                              </span>
                            </template>
                            <div style="overflow: auto; white-space: nowrap; margin-left: 0.25rem; max-width: 45px;">
                              {{ normalizeClaimAmount(v) }}
                            </div>
                          </a-tooltip> -->
                          <!-- <div class="token-icon" style="margin-right: 0.25rem; margin-left: 0.25rem;">
                            <img :src="v.token.logoURI">
                          </div> -->
                        </div>
                      </div>
                    </div>
                    <div style="color: #6a6d7c; white-space: nowrap; margin-left: 0; font-size: 12px;">
                      <div style="display: flex;">{{ new Date(v.redpacket.redPacket.createdAt).toLocaleString().split(',')[1] }}</div>
                    </div>
                  </div>
                </div>
                <div class="claim-status">
                  <div style="display: flex; align-items: center;">
                    <div style="display: flex; align-items: center;">
                      <span class="thumb"><img :src="v.redpacket.redPacket.creator.logoURI ? v.redpacket.redPacket.creator.logoURI : 'https://i.postimg.cc/15QJZwkN/profile.png'" :size="64" referrerpolicy="no-referrer" /></span>
                      <div style="display: flex; flex-direction: column; margin-left: 0.5rem;">
                        <span class="from-text">From</span>
                        <span style="font-size: 12px; color: rgb(100,116,139)">@{{ v.redpacket.redPacket.creator.handle }}</span>
                      </div>
                    </div>
                    <div class="arrow">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </div>
                    <div style="display: flex; align-items: center;">
                      <span class="thumb"><img
                          :src="v.token.logoURI"
                          :size="64" referrerpolicy="no-referrer" /></span>
                      <div style="display: flex; flex-direction: column; margin-left: 0.5rem;">
                        <span class="from-text" style="color: #0d8838;">
                          <a-tooltip placement="top">
                            <template #title>
                              <span>
                                Amount: {{ normalizeClaimAmount(v) }}
                              </span>
                            </template>
                            <div style="overflow: auto; white-space: nowrap; max-width: 45px;">
                              + {{ normalizeClaimAmount(v) }}
                            </div>
                          </a-tooltip>
                        </span>
                        <span style="font-size: 12px; color: rgb(100,116,139)">{{ v.token.symbol }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="share">
                  <i className="fa fa-twitter"></i>
                </div>
                <div class="cta">
                  <i class="fa fa-info-circle" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { loadErc20Token } from '@/web3/tokens';
import { useChainStore } from "@/stores/chain";
import { getCreatedRedPackets, updateRedPacketStatus } from '@/graphql/redpacket';
import { getClaimedRedPackets, updateRedPacketTxStatus, getRedPacketClaims } from '@/graphql/redpacketClaim';
import type {
  RedPacketDB,
  ClaimedRedPacket,
  RedPacketClaim,
} from '@/types';
import { BigNumber as EthBigNumber } from "ethers";
import { queryRedPacketInfo } from "@/web3/redpacket";
import { tokenAmount } from "../../functions/common";
import { getInfuraProvider } from "@/web3/network";
import { ethers } from "ethers";
import Loading from "@/components/Loading.vue";
import { useAccountStore } from '@/stores/account';
import { useTokenStore } from '@/stores/token';
import { copy } from "@/web3/utils";
import { ConsoleSqlOutlined } from '@ant-design/icons-vue';
import { Console } from 'console';

import { normalizeBalance } from "../../functions/common";
import type { Token } from "../../functions/common";
import { redPacketAddress } from "../../functions/redpacket";

interface CreatedRedPacket {
  redPacket: RedPacketDB,
  token: Token,
};

interface ClaimedRedPacketInfo {
  redpacket: ClaimedRedPacket,
  token: Token,
}

const redPackets = ref<CreatedRedPacket[]>([]);
const claimed = ref<ClaimedRedPacketInfo[]>([]);
const loadClaimInfo = async (provider: ethers.providers.Provider) => {
  const claims : ClaimedRedPacket[] = await getClaimedRedPackets();
  claimed.value = await Promise.all(
    claims.map(c => aggregatedClaimed(provider, c))
  );
}

const loadClaimsForOnePacket = async (
  provider: ethers.providers.Provider,
  redPacketId: string
) : Promise<RedPacketClaim[]> => {
  const claims = await getRedPacketClaims(redPacketId);
  return await Promise.all(
    claims.map(c => validateClaimStatus(provider, c))
  );
}

const redPacketByDate = ref<any>([]);
const claimedByDate = ref<any>([]);
const luckHistoryByDate = ref<any>([]);

const loadData = async function() {
  loading.value = true;
  if (useAccountStore().account) {
    const provider = getInfuraProvider(useChainStore().chain);
    const rps : RedPacketDB[] = await getCreatedRedPackets();
    redPackets.value = await Promise.all(rps.map(r => aggregateCreated(provider, r)));
    await loadClaimInfo(provider);
    // await loadClaimsForOnePacket(provider, redPackets.value[0]?.redPacket.id);
  }
  loading.value = false;
  extractDate();
};

const extractDate = () => {
  const sentGroup: any = {};
  const claimGroup: any = {};
  const sentOrderedGroup: any = {}
  const claimedOrderedGroup: any = {}
  claimed.value.forEach((c) => {
    const date = new Date(c.redpacket.claim.createdAt).toLocaleString().split(',')[0];
    if (date in claimGroup) {
      claimGroup[date].push(c);
    } else {
      claimGroup[date] = new Array(c);
    }

    // sort the claimed red packet
    var isDescending = true;
    const d_group = Object.keys(claimGroup).sort((a, b) => isDescending
      ? new Date(b).getTime() - new Date(a).getTime()
      : new Date(a).getTime() - new Date(b).getTime());
    d_group.forEach((v) => {
      claimedOrderedGroup[v] = claimGroup[v];
    })
    claimedByDate.value = JSON.parse(JSON.stringify(claimedOrderedGroup));
  });

  redPackets.value.forEach((val) => {
    const date = new Date(val.redPacket.createdAt).toLocaleString().split(',')[0];
    if (date in sentGroup) {
      sentGroup[date].push(val);
    } else {
      sentGroup[date] = new Array(val);
    }

    // sort the object
    var isDescending = true;
    const d_group = Object.keys(sentGroup).sort((a, b) => isDescending
      ? new Date(b).getTime() - new Date(a).getTime()
      : new Date(a).getTime() - new Date(b).getTime());
    d_group.forEach((v) => {
      sentOrderedGroup[v] = sentGroup[v];
    })
    redPacketByDate.value = JSON.parse(JSON.stringify(sentOrderedGroup));
    console.log("redpacket: ", redPacketByDate.value);
  });

  const luckHistoryGroup: any = {};
  // merge two objects together
  Object.keys(sentOrderedGroup).forEach((sog) => {
    if (sog in luckHistoryGroup) {
      sentOrderedGroup[sog].forEach((value: any) => {
        luckHistoryGroup[sog].push(value);
      })
    } else {
      luckHistoryGroup[sog] = sentOrderedGroup[sog];
    }
  })
  Object.keys(claimedOrderedGroup).forEach((cog) => {
    if (cog in luckHistoryGroup) {
      claimedOrderedGroup[cog].forEach((value: any) => {
        luckHistoryGroup[cog].push(value);
      })
    } else {
      luckHistoryGroup[cog] = claimedOrderedGroup[cog];
    }
  })
  luckHistoryByDate.value = JSON.parse(JSON.stringify(luckHistoryGroup));
  console.log("luck history: ", luckHistoryByDate.value);
};

const loading = ref<boolean>(true);
  
onMounted(loadData);
watch(() => useChainStore().current, loadData);

const showDetailsEnabled = ref<boolean>(false);

const route = useRoute();
const copyShareLink = (redPacket: RedPacketDB) => {
  return copy(window.location.origin + route.path + "?claim=" + redPacket.id, 'Successfully copied your red packet share link!');
};

const showDetails = () => {
  showDetailsEnabled.value = showDetailsEnabled.value ? false : true;
};

const normalize = (balance: string | undefined, token: Token) => {
  const normalized = normalizeBalance(balance || "0", token.decimals);
  return normalized.normalized;
}

const normalizedDbBalance = (redPacket: CreatedRedPacket) => {
  return redPacket.redPacket.metadata.tokenAmount
    ? (
      redPacket.redPacket.metadata.balance || 
        normalize(
          redPacket.redPacket.metadata.tokenAmount,
          redPacket.token
        )
    ) : normalize(
      redPacket.redPacket.metadata.balance,
      redPacket.token
    );
}

const normalizeClaimAmount = (claimed: ClaimedRedPacketInfo) => {
  return normalizeBalance(
    claimed.redpacket.claim.claimed?.toString() || '0',
    claimed.token.decimals
  ).normalized;
}

const tokenStore = useTokenStore();
const loadAndSaveERC20Token = async (tokenAddr: string) : Promise<Token> => {
  if (!tokenStore.token(tokenAddr)) {
    tokenStore.set(await loadErc20Token(tokenAddr));
  }
  return tokenStore.token(tokenAddr);
}

const aggregateCreated = async function(
  provider: ethers.providers.Provider,
  redPacket: RedPacketDB
) : Promise<CreatedRedPacket> {
  const tokenAddr = redPacket.metadata.token.toLowerCase();
  const token = await loadAndSaveERC20Token(tokenAddr);

  const redPacketState = async () => {
    const state = await queryRedPacketInfo(redPacket);
    return {
      balance: state.balance.toString(),
      split: state.split,
      createdAt: state.createdAt.toISOString(),
    };
  };

  if (redPacket.status == 'finalized') {
    if (!redPacket.state) {
      redPacket.state = await redPacketState();
      await updateRedPacketStatus({
        id: redPacket.id,
        status: "finalized",
        state: redPacket.state,
      });
    }
    return { redPacket, token };
  }

  const checkIfFinalized = async (forceUpdate: boolean) => {
    redPacket.state = await redPacketState();
    if (EthBigNumber.from(redPacket.state.balance).eq(0) || redPacket.state.split == 0) {
      redPacket.status = "finalized";
      await updateRedPacketStatus({
        id: redPacket.id,
        status: "finalized",
        state: redPacket.state,
      });
    } else if (forceUpdate) {
      await updateRedPacketStatus({
        id: redPacket.id,
        status: "alive",
      });
    }
    return redPacket;
  };

  if (redPacket.status == "alive") {
    redPacket = await checkIfFinalized(false);
    return { redPacket, token };
  }

  const receipt = await provider.getTransactionReceipt(redPacket.tx);
  if (receipt?.status == 1) {
    redPacket.status = "alive";
    redPacket = await checkIfFinalized(true);
    return { redPacket, token };
  }

  // not mined or error
  redPacket.state = {
    balance: tokenAmount(
        redPacket.metadata.balance,
        token
    ).toString(),
    split: redPacket.metadata.split,
    createdAt: redPacket.createdAt,
  };
  if (receipt?.status == 0) {
    redPacket.status = "error";
    await updateRedPacketStatus({
      id: redPacket.id,
      status: "error",
    });
  }
  return { redPacket, token };
};

const iface = new ethers.utils.Interface([
  "event Claimed(bytes32 indexed PacketId, address claimer, uint256 amount)",
]);
const legacyIface = new ethers.utils.Interface([
  "event Claimed(bytes32 indexed PacketId, address indexed claimer, uint256 amount)",
]);

const parseLog = (log: any) => {
  try {
    return iface.parseLog(log);
  } catch(e) {
    return legacyIface.parseLog(log);
  }
}

const validateClaimStatus = async (
  provider: ethers.providers.Provider,
  claim: RedPacketClaim
) : Promise<RedPacketClaim> => {
  if (claim.txStatus == "success" || claim.txStatus == "error") {
    return claim;
  }
  const receipt = await provider.getTransactionReceipt(claim.tx);
  if (!receipt) {
    return claim;
  } // not mined
  if (receipt.status) { // success
    const events = receipt.logs.filter(
      (log: any) => log.address.toLowerCase() == (
        redPacketAddress(useChainStore().chain)
      ).toLowerCase()
    ).map((log: any) => parseLog(log));
    const event = events.find((e: any) => e.name == "Claimed");
    const claimedAmount = event?.args.amount || EthBigNumber.from(0);
    await updateRedPacketTxStatus(
      claim.id,
      "success",
      claimedAmount.toString()
    );
    claim.txStatus = "success";
    claim.claimed = claimedAmount;
  } else { // reverted
    await updateRedPacketTxStatus(claim.id, "error");
    claim.txStatus = "error";
  }
  return claim;
}

const aggregatedClaimed = async function(
  provider: ethers.providers.Provider,
  redpacket: ClaimedRedPacket
) : Promise<ClaimedRedPacketInfo> {
  const tokenAddr = redpacket.redPacket.metadata.token.toLowerCase();
  const token = await loadAndSaveERC20Token(tokenAddr);
  redpacket.claim = await validateClaimStatus(provider, redpacket.claim);
  return { redpacket, token };
}
</script>

<style lang="less" scoped>
.claim-mode {
  display: flex;
  margin: 0px;
  font-weight: 400;
  line-height: 1.5;
  font-size: 12px;
  color: #5b7083; }
i {
  color: rgba(0,0,0,0.3);
  font-size: 18px; }
i:hover {
  color: #076AE0; }
.arrow {
  font-size: .875rem;
  line-height: 1.25rem;
  margin-left: 1rem;
  margin-right: 1rem; }
.from-text {
  font-weight: 600;
  font-size: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: rgb(15, 23, 42); }
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
.record-box {
  display: flex;
  align-items: center;
  border-top: 1px solid #e5e7eb;
  height: 4.5rem;
  padding-top: 0.5rem; }
.info-1 {
  display: flex; }
.no-history {
  display: flex;
  height: 42vh;
  justify-content: center;
  align-items: center; }
.loading-state {
  display: flex;
  padding: 0.5rem;
  align-items: center;
  justify-content: center;
  height: 500px; }
.sent-info {
  display: flex;
  flex-shrink: 1;
  white-space: nowrap;
  font-weight: 600;
  font-size: 12px;
  @media (max-width: 990px) {
    flex-direction: column; } }
.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 55px;
  border-width: 1px;
  background-color: #FD4755; }
.connect-wallet-button {
  display: flex;
  justify-content: center;
  margin-top: 1.5px;
  margin-bottom: 1.5px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  color: #000;
  font-size: 12px;
  font-weight: 800;
  line-height: 0.8rem;
  width: 100px;
  border-radius: 50px;
  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    width: 100px; }
  @media (min-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    width: 100px; }
  opacity: 1;
  background-color: rgb(7, 106, 224);
  // border: 2px solid rgb(7, 106, 224);
  color: white; }
.connect-wallet-button:hover {
  background-color: rgba(7, 106, 224, 0.6); }
.share {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  grid-column: span 1/span 1; }
.share img {
  max-width: 20px; }
.cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  grid-column: span 2/span 2; }
.claimed-number {
  display: flex;
  margin: 0px;
  font-weight: 400;
  line-height: 1.5;
  font-size: 12px;
  color: rgb(91, 112, 131); }
.claimed-number strong {
  font-weight: bold; }
.claimed-data {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  -webkit-box-pack: justify;
  justify-content: space-between;
  margin-top: 10px; }
.box-progress {
  display: block;
  height: 6px;
  border-radius: 6px;
  background-color: rgb(61, 194, 51); }
.progress-bar {
  width: 100%;
  height: 6px;
  border-radius: 6px;
  overflow: hidden;
  background-color: rgba(7, 16, 27, 0.2);
  margin: 8px 0; }
.claim-status {
  display: block;
  grid-column: span 5/span 5;
  @media (max-width: 990px) {
    margin-left: 1rem;
    grid-column: span 5/span 5; } }
.action-and-time {
  display: flex;
  align-items: center;
  grid-column: span 2/span 2;
  margin-bottom: 0;
  @media (max-width: 990px) {
    grid-column: span 1/span 1; } }
.record-detail {
  display: grid;
  padding-left: 1rem;
  overflow-x: visible;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-y: visible;
  align-items: center;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  flex: 1 1;
  width: 100%;
  @media (min-width: 1280px) {
    gap: 1.5rem; }
  @media (min-width: 1024px) {
    gap: 1.25rem; }
  @media (max-width: 990px) {
    grid-template-columns: repeat(7, minmax(0, 1fr)); } }
.history-record {
  position: relative;
  padding-left: 1.5rem;
  padding-bottom: 0.5rem;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  cursor: pointer; }
.history-date {
  top: 0;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  margin-left: 0.875rem; }
tr:hover td {background:rgb(230, 227, 227)}
.token-listDetail {
  border-radius: 0.75rem;
  margin-top: 1rem;
  padding: 0.5rem;
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
