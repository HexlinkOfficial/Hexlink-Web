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
                <svg v-if="showStatus(v.redPacket.tx, v.redPacket.status) != 'Sent'" version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                  y="0px" width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;"
                  xml:space="preserve">
                  <path fill="#FD4755"
                    d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25"
                      dur="0.6s" repeatCount="indefinite"></animateTransform>
                  </path>
                </svg>
                <div v-if="showStatus(v.redPacket.tx, v.redPacket.status) == 'Sent'" class="icon">
                  <svg style="color:white;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="w-4 h-4 text-subdued">
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
                          {{ showStatus(v.redPacket.tx, v.redPacket.status) }}
                        </div>
                      </div>
                    </div>
                    <div style="color: #6a6d7c; white-space: nowrap; margin-left: 0; font-size: 12px;">
                      <div style="display: flex;">{{ new Date(v.redPacket.createdAt).toLocaleString().split(',')[1] }}</div>
                    </div>
                  </div>
                </div>
                <div class="token-amount">
                  <div class="sent-info">
                    <a-tooltip placement="top">
                      <template #title>
                        <span>
                          Amount: {{ normalizedDbBalance(v) }}
                        </span>
                      </template>
                      <div
                        style="overflow: auto; white-space: nowrap; margin-left: 0.25rem; width: 45px;display: flex;justify-content: flex-end;">
                        - {{ normalizedDbBalance(v).toString().substring(0,5) }}
                      </div>
                    </a-tooltip>
                    <div class="token-icon" style="margin-right: 0.25rem; margin-left: 0.25rem;">
                      <img :src="v.token.logoURI">
                    </div>
                    {{ v.token.symbol }}
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
                      Claimed:&nbsp;
                      <strong>{{
                      v.redPacket.metadata.split - v.redPacket.state.split
                      }}/{{ v.redPacket.metadata.split }}</strong>
                      &nbsp;Share
                    </p>
                    <p class="claim-mode">
                      Mode:&nbsp;
                      <strong>{{ v.redPacket.metadata.mode }}</strong>
                    </p>
                    <p class="claimed-number">
                      Left:&nbsp;
                      <strong>{{ normalize(v.redPacket.state.balance, v.token) }}</strong>
                      &nbsp;{{ v.token.symbol }}
                    </p>
                  </div>
                </div>
                <div class="share">
                  <i v-if="showStatus(v.redPacket.tx, v.redPacket.status) == 'Sent'" class="fa fa-paper-plane share-button" aria-hidden="true" @click="copyShareLink(v.redPacket)"></i>
                  <span v-if="showStatus(v.redPacket.tx, v.redPacket.status) != 'Sent'" class="pending-text">{{ showDetailStatus(v.redPacket.tx, v.redPacket.status) }}</span>
                </div>
                <div v-if="showStatus(v.redPacket.tx, v.redPacket.status) == 'Sent'" class="cta">
                  <!-- <button class="connect-wallet-button" :href="href">
                    Withdraw
                  </button> -->
                  <router-link :to="{ query: { details: v.redPacket ? v.redPacket.id : v.redpacket.id } }">
                    <i class="fa fa-get-pocket" aria-hidden="true"></i>
                  </router-link>
                </div>
              </div>
            </div>
            <div v-if="v.redpacket" class="record-box">
              <div style="display: block; position: relative;">
                <div class="icon" :style="showClaimStatus(v.redpacket.claim) == 'Error' ? 'background-color: #FD4755;' : 'background-color: #4BAE4F;'">
                  <svg v-if="showClaimStatus(v.redpacket.claim) != 'Claimed' && showClaimStatus(v.redpacket.claim) != 'Error'" version="1.1" id="loader-1"
                    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px"
                    height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50; background-color: none;" xml:space="preserve">
                    <path fill="#FFFFFF"
                      d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                      <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25"
                        dur="0.6s" repeatCount="indefinite"></animateTransform>
                    </path>
                  </svg>
                  <svg v-if="showClaimStatus(v.redpacket.claim) == 'Claimed'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 7L17 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M17 7V17H7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <svg v-if="showClaimStatus(v.redpacket.claim) == 'Error'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M7 7L17 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
              </div>
              <div class="record-detail">
                <div class="action-and-time">
                  <div style="display: block; margin-bottom: 0;">
                    <div style="display: flex;">
                      <div class="sent-info">
                        <div class="info-1">
                          {{ showClaimStatus(v.redpacket.claim) }}
                        </div>
                      </div>
                    </div>
                    <div style="color: #6a6d7c; white-space: nowrap; margin-left: 0; font-size: 11px;">
                      <div style="display: flex;">{{ new Date(v.redpacket.claim.createdAt).toLocaleString().split(',')[1] }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="token-amount">
                  <div class="sent-info" v-if="v.redpacket.claim.txStatus == 'success'">
                    <a-tooltip placement="top">
                      <template #title>
                        <span>
                          Amount: {{ normalizeClaimAmount(v) }}
                        </span>
                      </template>
                      <div
                        style="overflow: auto; white-space: nowrap; margin-left: 0.25rem; width: 45px;display: flex;justify-content: flex-end;">
                        + {{ normalizeClaimAmount(v).toString().substring(0,5)}}</div>
                    </a-tooltip>
                    <div class="token-icon" style="margin-right: 0.25rem; margin-left: 0.25rem;">
                      <img :src="v.token.logoURI">
                    </div>
                    {{ v.token.symbol }}
                  </div>
                  <div class="sent-info" v-if="v.redpacket.claim.txStatus != 'success'">
                    <div style="overflow: auto; white-space: nowrap; margin-left: 0.25rem; width: 50px;display: flex;justify-content: flex-end;">
                      {{ showClaimStatus(v.redpacket.claim) }}
                    </div>
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
                        <img
                          :src="v.redpacket.redPacket.creator.logoURI ? v.redpacket.redPacket.creator.logoURI : 'https://i.postimg.cc/15QJZwkN/profile.png'"
                          :size="64" referrerpolicy="no-referrer" 
                        />
                      </span>
                      <div style="display: flex; flex-direction: column; margin-left: 0.5rem;">
                        <span class="from-text">From</span>
                        <span style="font-size: 12px; color: rgb(100,116,139)">@{{ v.redpacket.redPacket.creator.handle }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="share">
                  <i v-if="showClaimStatus(v.redpacket.claim) == 'Claimed'" class="fa fa-paper-plane share-button" aria-hidden="true" @click="copyShareLink(v.redpacket.redPacket)"></i>
                  <span v-if="showClaimStatus(v.redpacket.claim) != 'Claimed' && showClaimStatus(v.redpacket.claim) != 'Error'" class="pending-text">{{ showClaimStatus(v.redpacket.claim) }}</span>
                  <span v-if="showClaimStatus(v.redpacket.claim) == 'Error'" class="pending-text" style="color:#FD4755;">{{ showClaimStatus(v.redpacket.claim) }}</span>
                </div>
                <div class="cta" v-if="showClaimStatus(v.redpacket.claim) == 'Claimed'">
                  <i className="fa fa-twitter"></i>
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
import { getCreatedRedPackets } from '@/graphql/redpacket';
import { getClaimedRedPackets } from '@/graphql/redpacketClaim';
import type {
  RedPacketDB,
  ClaimedRedPacket,
} from '@/types';
import { BigNumber as EthBigNumber } from "ethers";
import { getInfuraProvider } from "@/web3/network";
import Loading from "@/components/Loading.vue";
import { useAccountStore } from '@/stores/account';
import { useTokenStore } from '@/stores/token';
import { copy } from "@/web3/utils";
import type {ethers} from "ethers";

import { normalizeBalance } from "../../functions/common";
import type { Token } from "../../functions/common";
import {redPacketContract} from "../../functions/redpacket";

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
const loadClaimInfo = async () => {
  const claims : ClaimedRedPacket[] = await getClaimedRedPackets();
  claimed.value = await Promise.all(claims.map(c => aggregatedClaimed(c)));
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
    await loadClaimInfo();
    // await loadClaimsForOnePacket(provider, redPackets.value[0]?.redPacket.id);
  }
  loading.value = false;
  extractDate();
};

const pullRedpacketData = async function() {
  if (useAccountStore().account) {
    const provider = getInfuraProvider(useChainStore().chain);
    const rps: RedPacketDB[] = await getCreatedRedPackets();
    redPackets.value = await Promise.all(rps.map(r => aggregateCreated(provider, r)));
    await loadClaimInfo();
  }
  extractDate();
}

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
    var isDescending = false;
    Object.keys(claimGroup).sort((a, b) => isDescending
      ? new Date(b).getTime() - new Date(a).getTime()
      : new Date(a).getTime() - new Date(b).getTime()
    ).forEach((v) => {
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
    var isDescending = false;
    Object.keys(sentGroup).sort((a, b) => isDescending
      ? new Date(b).getTime() - new Date(a).getTime()
      : new Date(a).getTime() - new Date(b).getTime()
    ).forEach((v) => {
      sentOrderedGroup[v] = sentGroup[v];
    });
    redPacketByDate.value = JSON.parse(JSON.stringify(sentOrderedGroup));
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

  const sortedLuckHistory: any = {};
  var isDescending = true;
  Object.keys(luckHistoryGroup).sort((a, b) => isDescending
    ? new Date(b).getTime() - new Date(a).getTime()
    : new Date(a).getTime() - new Date(b).getTime()
  ).forEach((v) => {
    sortedLuckHistory[v] = luckHistoryGroup[v];
  });
  luckHistoryByDate.value = JSON.parse(JSON.stringify(sortedLuckHistory));

  // sort each tx
  const fullysortedHistory: any = {}
  Object.keys(luckHistoryByDate.value).forEach(v => {
    const time: any = [];
    luckHistoryByDate.value[v].forEach((w: any) => {
      if(w.redPacket) {
        time.push(new Date(w.redPacket.createdAt).getTime());
      } else {
        time.push(new Date(w.redpacket.claim.createdAt).getTime());
      }
    })
    const sortedArray: any[] = []
    time.sort((a: number, b: number) => b - a).forEach((t: number) => {
      luckHistoryByDate.value[v].forEach((w: any) => {
        if (w.redPacket) {
          new Date(w.redPacket.createdAt).getTime() == t && sortedArray.push(w);
        } else if (w.redpacket) {
          new Date(w.redpacket.claim.createdAt).getTime() == t && sortedArray.push(w);
        } else {}
      })
    })
    fullysortedHistory[v] = sortedArray;
  })

  luckHistoryByDate.value = JSON.parse(JSON.stringify(fullysortedHistory));
};

const loading = ref<boolean>(true);
const route = useRoute();
onMounted(loadData);
watch(() => useChainStore().current, loadData);
watch(() => route.query?.claim, async() => {
  loading.value = true;
  await loadClaimInfo();
  loading.value = false;
});

const showStatus = (tx: string, status: string) => {
  if(tx == null) {
    return 'Pending';
  };
  if(tx != null && status == null) {
    return 'Pending';
  } else {
    return 'Sent';
  }
}

const showClaimStatus = (claim: any) => {
  if (claim.txState) {
    if (claim.txState.error) {
      return "Error";
    }
    if (claim.txState.status == null) {
      return 'Pending';
    } else if (claim.txState.status == "error") {
      return "Error";
    } else {
      return "Claimed";
    }
  }

  // for legacy check
  if(claim.txStatus == null){
    return 'Pending';
  } else if (claim.txStatus == 'error') {
    return 'Error';
  } else {
    return 'Claimed';
  }
}

const showDetailStatus = (tx: string, status: string) => {
  if (tx == null) {
    return 'Pending Transaction';
  };
  if (tx != null && status == null) {
    return 'Transaction sent, wait mining';
  } else {
    return 'Sent';
  }
}

const showDetailsEnabled = ref<boolean>(false);

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
    EthBigNumber.from(claimed.redpacket.claim.claimed).toString() || '0',
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
  const contract = await redPacketContract(provider);
  const state = contract.getPacket(redPacket.id);
  redPacket.state =  {
    balance: state.balance.toString(),
    split: state.split,
    createdAt: state.createdAt.toISOString(),
  };
  return { redPacket, token };
};

const aggregatedClaimed = async function(
  redpacket: ClaimedRedPacket
) : Promise<ClaimedRedPacketInfo> {
  const tokenAddr = redpacket.redPacket.metadata.token.toLowerCase();
  const token = await loadAndSaveERC20Token(tokenAddr);
  return { redpacket, token };
}
</script>

<style lang="less" scoped>
.loader {
  margin: 0 0 2em;
  height: 100px;
  width: 20%;
  text-align: center;
  padding: 1em;
  margin: 0 auto 1em;
  display: inline-block;
  vertical-align: top; }
.share-button:hover {
  color: #076AE0; }
.pending-text {
  font-size: 12px;
  font-weight: 800;
  margin-left: 5.5rem;
  text-align: center;
  color: #076AE0; }
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
// i:hover {
//   color: #076AE0; }
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
  color: #000;
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
  width: 90px;
  border-radius: 50px;
  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem; }
  @media (min-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem; }
  opacity: 1;
  background-color: rgb(7, 106, 224);
  // border: 2px solid rgb(7, 106, 224);
  color: white; }
.connect-wallet-button:hover {
  background-color: rgba(7, 106, 224, 0.6); }
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
.claimed-number {
  display: flex;
  margin: 0px;
  font-weight: 400;
  line-height: 1.5;
  font-size: 12px;
  width: 100px;
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
  margin-left: 1rem;
  grid-column: span 4/span 4;
  @media (max-width: 990px) {
    margin-left: 1rem;
    grid-column: span 4/span 4; } }
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
.record-detail {
  display: grid;
  padding-left: 1rem;
  padding-right: 1rem;
  overflow-x: visible;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-y: visible;
  align-items: center;
  grid-template-columns: repeat(8, minmax(0, 1fr));
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
.history-record:hover {
  box-shadow: rgb(39 44 49 / 7%) 8px 28px 50px, rgb(39 44 49 / 4%) 1px 6px 12px;
  transform: translate3d(0px, -1px, 0px) scale(1.01);
  transition: all 0.2s ease 0s; }
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
  overflow: visible; }
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
