<template>
  <div v-if="loading" class="loading-state">
    <Loading />
  </div>
  <div v-if="createdRpOps.length == 0 && !loading" class="no-history">
    <div style="text-align: center;">You have no luck history yet! Go send some luck~</div>
  </div>
  <div v-if="!loading" class="token-listDetail">
    <div class="token-table">
      <div style="overflow: visible; border-radius: 0.75rem;">
        <div v-for="(value, name, index) in luckHistoryByDate" :key="index" style="position: relative; ">
          <div class="history-date">
            <div style="font-size: 0.875rem; line-height: 1.25rem;">{{ new Date(name).toLocaleString("en-US", options) }}</div>
          </div>
          <div v-for="(op, i) in value" :key="i" class="history-record">
            <div v-if="op.type == 'create_redpacket'" class="record-box">
              <div class="sending-status" style="display: block; position: relative;">
                <img v-if="showStatus(op) == 'Pending'" src="@/assets/svg/createRedpacketPending.svg"/>
                <div v-if="showStatus(op) == 'Sent'" class="icon">
                  <img src="@/assets/svg/createRedpacketSent.svg"/>
                </div>
                <div v-if="showStatus(op) == 'Error'" class="icon" style="background-color: rgb(253, 71, 85);">
                  <img src="@/assets/svg/createRedpacketError.svg" />
                </div>
              </div>
              <div class="record-detail">
                <div class="action-and-time">
                  <div style="display: block; margin-bottom: 0;">
                    <div style="display: flex;">
                      <div class="sent-info">
                        <div class="info-1">
                          {{ showStatus(op) == 'Sent' ? 'Created' : 'Error' }}
                        </div>
                      </div>
                    </div>
                    <div style="color: #6a6d7c; white-space: nowrap; margin-left: 0; font-size: 12px;">
                      <div style="display: flex;">{{ new Date(op.createdAt).toLocaleString().split(',')[1] }}</div>
                    </div>
                  </div>
                </div>
                <div class="token-amount" v-if="op.redpacket">
                  <div v-if="op.redpacket.type === 'erc20'" class="sent-info">
                    <a-tooltip placement="top">
                      <template #title>
                        <span>
                          Amount: {{ normalizedDbBalance(op) }}
                        </span>
                      </template>
                      <div style="overflow: auto; white-space: nowrap; margin-left: 0.25rem; width: 50px;display: flex;justify-content: flex-end;">
                        - {{ prettyPrintNumber(normalizedDbBalance(op).toString()) }}
                      </div>
                    </a-tooltip>
                    <div class="token-icon" style="margin-right: 0.25rem; margin-left: 0.25rem;">
                      <img :src="op.redpacket.token.logoURI">
                    </div>
                    {{ op.redpacket.token.symbol }}
                  </div>
                  <div v-if="op.redpacket.type === 'erc721'" style="display: flex; align-items: center;" >
                    <a-tooltip placement="top">
                      <template #title>
                          <img :src="ipfsUrl(op.redpacket.metadata.tokenURI)" style="max-width: 100px;" :size="64"
                            referrerpolicy="no-referrer" rel="preload" />
                      </template>
                      <span class="thumb">
                        <img :src="ipfsUrl(op.redpacket.metadata.tokenURI)" style="border: 2px solid #D9D9D9;" :size="64" referrerpolicy="no-referrer" rel="preload" />
                      </span>
                    </a-tooltip>
                    <div style="display: flex; flex-direction: column; margin-left: 0.5rem;">
                      <span class="from-text">{{ op.redpacket.metadata.name }}</span>
                      <span style="font-size: 12px; color: rgb(100,116,139)">
                        {{ op.redpacket.metadata.symbol }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="claim-status" v-if="op.redpacket && op.txStatus == 'success'">
                  <div class="progress-bar">
                    <span v-if="op.redpacket.type === 'erc20'" class="box-progress" :style="{width: progress(op.redpacket) + '%' }"></span>
                    <span v-if="op.redpacket.type === 'erc721'" class="box-progress" :style="{ width: progressErc721(op.redpacket.metadata.token, op.redpacket.metadata.maxSupply) + '%' }"></span>
                  </div>
                  <div class="claimed-data">
                    <p class="claimed-number" v-if="op.redpacket.type === 'erc20'">
                      Claimed:&nbsp;
                      <strong>{{ split(op.redpacket) }}/{{ op.redpacket.metadata.split }}</strong>
                      &nbsp;Share
                    </p>
                    <p class="claimed-number" v-if="op.redpacket.type === 'erc721'">
                      Claimed:&nbsp;
                      <strong>{{ findTokenId(op.redpacket.metadata.token) }}/{{ op.redpacket.metadata.maxSupply }}</strong>
                      &nbsp;Share
                    </p>
                    <p class="claim-mode" v-if="op.redpacket.type === 'erc20'">
                      Mode:&nbsp;
                      <strong>{{ op.redpacket.metadata.mode == 2 ? 'Random' : 'Equal' }}</strong>
                    </p>
                    <p class="claimed-number-left" v-if="op.redpacket.type === 'erc20'">
                      Left:&nbsp;
                      <strong>{{ normalize(op.redpacket.state?.balance || op.redpacket.metadata.balance, op.redpacket.token) }}</strong>
                      &nbsp;{{ op.redpacket.token.symbol }}
                    </p>
                    <p class="claimed-number-left" v-if="op.redpacket.type === 'erc721'">
                      Left:&nbsp;
                      <strong>{{ parseInt(op.redpacket.metadata.maxSupply) - findTokenId(op.redpacket.metadata.token) }}</strong>
                      &nbsp;
                    </p>
                  </div>
                </div>
                <div class="claim-status" v-if="op.redpacket && op.txStatus != 'success'"></div>
                <div class="share" v-if="op.redpacket">
                  <i v-if="showStatus(op) == 'Sent'" class="fa fa-paper-plane share-button" aria-hidden="true" @click="share(op.redpacket)"></i>
                  <span v-if="showStatus(op) != 'Sent'" class="pending-text" :style="showStatus(op) == 'Pending' ? 'margin-left: 5.5rem;' : ''">{{ showDetailStatus(op) }}</span>
                </div>
                <div class="cta">
                  <router-link :to="{ query: { details: op.redpacket.id } }" v-if="showStatus(op) == 'Sent'">
                    <i class="fa fa-get-pocket" aria-hidden="true"></i>
                  </router-link>
                  <a-tooltip v-if="showStatus(op) != 'Sent' && showStatus(op) != 'Pending'" placement="top">
                    <template #title>
                      <span>
                        Check on blockchain explorer
                      </span>
                    </template>
                    <a :href="useChainStore().chain.blockExplorerUrls[0]+'/tx/'+op.tx" target="_blank">
                      <i class="fa-solid fa-arrow-up-from-bracket"></i>
                    </a>
                  </a-tooltip>
                </div>
              </div>
            </div>
            <div v-if="op.type == 'claim_redpacket'" class="record-box">
              <div class="status-icon" style="display: block; position: relative;">
                <div class="icon" :style="showClaimStatus(op) == 'Error' ? 'background-color: #FD4755;' : ''">
                  <img v-if="showClaimStatus(op) != 'Claimed' && showClaimStatus(op) != 'Error'" src="@/assets/svg/claimRedpacketPending.svg"/>
                  <img v-if="showClaimStatus(op) == 'Claimed'" src="@/assets/svg/claimRedpacketClaimed.svg"/>
                  <img v-if="showClaimStatus(op) == 'Error'" src="@/assets/svg/claimRedpacketError.svg"/>
                </div>
              </div>
              <div class="record-detail">
                <div class="action-and-time">
                  <div style="display: block; margin-bottom: 0;">
                    <div style="display: flex;">
                      <div class="sent-info">
                        <div class="info-1">
                          {{ showClaimStatus(op) }}
                        </div>
                      </div>
                    </div>
                    <div style="color: #6a6d7c; white-space: nowrap; margin-left: 0; font-size: 11px;">
                      <div style="display: flex;">{{ new Date(op.createdAt).toLocaleString().split(',')[1] }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="token-amount" v-if="op.claim">
                  <div class="sent-info" v-if="op.redpacket.type === 'erc20' && showClaimStatus(op) == 'Claimed'">
                    <a-tooltip placement="top">
                      <template #title>
                        <span>
                          Amount: {{ normalizeClaimAmount(op) }}
                        </span>
                      </template>
                      <div
                        style="overflow: auto; white-space: nowrap; margin-left: 0.25rem; width: 50px;display: flex;justify-content: flex-end;">
                        + {{ prettyPrintNumber(normalizeClaimAmount(op).toString()) }}
                      </div>
                    </a-tooltip>
                    <div class="token-icon" style="margin-right: 0.25rem; margin-left: 0.25rem;">
                      <img :src="op.redpacket.token?.logoURI || ipfsUrl(op.redpacket.metadata.tokenURI)">
                    </div>
                    {{ op.redpacket.token?.symbol || op.redpacket.metadata.symbol}}
                  </div>
                  <div v-if="op.redpacket.type === 'erc721' && showClaimStatus(op) == 'Claimed'" style="display: flex; align-items: center;">
                    <a-tooltip placement="top">
                      <template #title>
                        <img :src="ipfsUrl(op.redpacket.metadata.tokenURI)" style="max-width: 100px;" :size="64"
                          referrerpolicy="no-referrer" rel="preload" />
                      </template>
                      <span class="thumb">
                        <img :src="ipfsUrl(op.redpacket.metadata.tokenURI)" style="border: 2px solid #D9D9D9;" :size="64"
                          referrerpolicy="no-referrer" rel="preload" />
                      </span>
                    </a-tooltip>
                    <div style="display: flex; flex-direction: column; margin-left: 0.5rem;">
                      <span class="from-text">{{ op.redpacket.metadata.name }}</span>
                      <span style="font-size: 12px; color: rgb(100,116,139)">
                        {{ op.redpacket.metadata.symbol }}#{{ op.claim?.claimed }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="claim-status" v-if="op.claim">
                  <div v-if="showClaimStatus(op) != 'Error'" style="display: flex; align-items: center;">
                    <div class="arrow">
                      <img src="@/assets/svg/backwardArrow.svg"/>
                    </div>
                    <div style="display: flex; align-items: center;">
                      <span class="thumb">
                        <img
                          :src="op.redpacket.creator.logoURI ? op.redpacket.creator.logoURI : 'https://i.postimg.cc/15QJZwkN/profile.png'"
                          :size="64" referrerpolicy="no-referrer" 
                        />
                      </span>
                      <div style="display: flex; flex-direction: column; margin-left: 0.5rem;">
                        <span class="from-text">From</span>
                        <span style="font-size: 12px; color: rgb(100,116,139)">@{{ op.redpacket.creator.handle }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="share" v-if="op.claim">
                  <i v-if="showClaimStatus(op) == 'Claimed'" class="fa fa-paper-plane share-button" aria-hidden="true" @click="share(op.redpacket)"></i>
                  <span v-if="showClaimStatus(op) != 'Claimed' && showClaimStatus(op) != 'Error'" class="pending-text">{{ showClaimStatus(op) }}</span>
                  <span v-if="showClaimStatus(op) == 'Error'" class="pending-text" style="color:#FD4755;">{{ showClaimStatus(op) }}</span>
                </div>
                <div class="cta">
                  <i v-if="showClaimStatus(op) == 'Claimed'" className="fa fa-twitter"></i>
                  <i v-if="showClaimStatus(op) != 'Claimed'" className="fa-solid fa-arrow-up-from-bracket"></i>
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
import { ref, watch, onMounted, computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { loadErc20Token } from '@/web3/tokens';
import { useChainStore } from "@/stores/chain";
import { getCreatedRedPackets } from '@/graphql/redpacket';
import { getClaimedRedPackets } from '@/graphql/redpacketClaim';
import type { ClaimRedPacketOp, CreateRedPacketOp, RedPacketDB } from '@/types';
import Loading from "@/components/Loading.vue";
import { useAccountStore } from '@/stores/account';
import { useTokenStore } from '@/stores/token';
import { copy } from "@/web3/utils";
import { queryRedPacketInfo, queryErc721TokenId } from "@/web3/redpacket";
import { normalizeBalance } from "../../functions/common";
import type { Token } from "../../functions/common";
import type { RedPacket } from "../../functions/redpacket";
import { options } from "@/assets/imageAssets";
import { ipfsUrl } from "@/web3/storage";
import { prettyPrintNumber } from "@/web3/utils";

const createdRpOps = ref<CreateRedPacketOp[]>([]);
const claimedRpOps = ref<ClaimRedPacketOp[]>([]);
const loadClaimInfo = async () => {
  const claims : ClaimRedPacketOp[] = await getClaimedRedPackets();
  claimedRpOps.value = await Promise.all(claims.map(c => aggregatedClaimed(c)));
}
const redPacketByDate = ref<any>([]);
const claimedByDate = ref<any>([]);
const luckHistoryByDate = ref<any>([]);
const tokenIdAddress = ref<string[]>([]);
const createdCount = ref<number>(0);
const claimedCount = ref<number>(0);

interface tokenIDMap {
  address: string,
  tokenId: number
}
const tokenIdtable = ref<tokenIDMap[]>([]);

const emit = defineEmits(["expressStatus"])

const loadData = async function() {
  loading.value = true;
  if (useAccountStore().account) {
    const rps : CreateRedPacketOp[] = await getCreatedRedPackets();
    createdRpOps.value = await Promise.all(rps.map(r => aggregateCreated(r)));
    await loadClaimInfo();
    // await loadClaimsForOnePacket(provider, redPackets.value[0]?.redPacket.id);
  }
  loading.value = false;
  extractDate();
  extractTokenId();
  console.log(luckHistoryByDate.value);
  emit("expressStatus", [createdCount, claimedCount]);
};

const extractTokenId = () => {
  tokenIdAddress.value.forEach(async address => {
    tokenIdtable.value.push({
      address: address,
      tokenId: await queryErc721TokenId(address)
    });
  })
}

const extractDate = () => {
  const sentGroup: any = {};
  const claimGroup: any = {};
  const sentOrderedGroup: any = {}
  const claimedOrderedGroup: any = {}
  claimedRpOps.value.forEach((op) => {
    if(op.error == null) {
      claimedCount.value += 1;
    }
    const date = new Date(op.createdAt).toLocaleString().split(',')[0];
    if (date in claimGroup) {
      claimGroup[date].push(op);
    } else {
      claimGroup[date] = new Array(op);
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

  createdRpOps.value.forEach((op) => {
    if (op.error == null) {
      createdCount.value += 1;
    }
    if(op.redpacket?.type == 'erc721' && op.txStatus != 'error') {
      tokenIdAddress.value.push(op.redpacket.metadata.token);
    }
    const date = new Date(op.createdAt).toLocaleString().split(',')[0];
    if (date in sentGroup) {
      sentGroup[date].push(op);
    } else {
      sentGroup[date] = new Array(op);
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
    luckHistoryByDate.value[v].forEach((op: any) => {
      time.push(new Date(op.createdAt).getTime());
    })
    const sortedArray: any[] = [];
    time.sort((a: number, b: number) => b - a).forEach((t: number) => {
      luckHistoryByDate.value[v].forEach((op: any) => {
          new Date(op.createdAt).getTime() == t && sortedArray.push(op);
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

const split = (redPacket: RedPacketDB) => {
  return redPacket.state?.split === undefined
    ? 0 : redPacket.metadata.split - redPacket.state?.split ;
}

const progress = (redpacket: RedPacketDB) => {
  return split(redpacket) / redpacket.metadata.split*100
}

const progressErc721 = (address: string, maxSupply: string) => {
  const id: number = findTokenId(address);
  if (id > 0) {
    return id / parseInt(maxSupply) * 100;
  } else {
    return 0;
  }
}

const findTokenId = (address : string) => {
  var id = 0;
  tokenIdtable.value.forEach(t => {
    if (t.address == address) {
      id =  t.tokenId;
    }
  })
  return id;
}

const showStatus = (op: any) => {
  if (op.error) { return "Error"; }
  if (!op.tx || !op.txStatus) { return "Pending"; }
  return op.txStatus == "success" ? "Sent" : "Error";
}

const showDetailStatus = (op: any) => {
  if (op.error) { return "Error"; }
  if (!op.tx) { return "Queued"; }
  if (!op.txStatus) { return 'Transaction sent, wait mining'; }
  return op.txStatus == "success" ? "Sent" : "Error";
}

const showClaimStatus = (op: any) => {
  if (op.error) { return "Error"; }
  if (!op.tx || !op.txStatus) { return "Pending"; }
  return op.txStatus == "success" ? "Claimed" : "Error";
}

const share = (redPacket: RedPacketDB | undefined) => {
  if (redPacket?.metadata.validationRules && redPacket?.metadata.validationRules?.length > 0) {
    window.open(location.origin + "/airdrop/share/" + redPacket?.id);
  } else {
    return copy(
      window.location.origin + route.path + "?claim=" + redPacket?.id,
      'Successfully copied your red packet share link!'
    );
  }
};

const normalize = (balance: string | undefined, token: Token) : string => {
  return normalizeBalance(balance || "0", token.decimals).normalized;
}

const normalizedDbBalance = (op: CreateRedPacketOp) : string => {
  if (op.redpacket && op.redpacket.type === "erc20") {
    const metadata = op.redpacket.metadata as RedPacket | undefined;
    if (metadata?.balance) {
      return normalize(metadata.balance, op.redpacket.token!);
    }
  }
  return "0";
}

const normalizeClaimAmount = (op: ClaimRedPacketOp) => {
  return op.claim?.claimed &&op.redpacket?.token ? normalize(
    op.claim.claimed, op.redpacket.token
  ) : 0;
}

const tokenStore = useTokenStore();
const loadAndSaveERC20Token = async (tokenAddr: string) : Promise<Token> => {
  if (!tokenStore.token(tokenAddr)) {
    tokenStore.set(await loadErc20Token(tokenAddr));
  }
  return tokenStore.token(tokenAddr);
}

const aggregateCreated = async function(
  op: CreateRedPacketOp
) : Promise<CreateRedPacketOp> {
  if (op.redpacket && op.redpacket.type === 'erc20') {
    const metadata = op.redpacket!.metadata as RedPacket;
    const tokenAddr = metadata.token.toLowerCase();
    op.redpacket.token = await loadAndSaveERC20Token(tokenAddr);
    if (op.tx && op.txStatus === 'success') {
      op.redpacket.state = await queryRedPacketInfo(op.redpacket);
    }
  }
  return op;
};

const aggregatedClaimed = async function(
  op: ClaimRedPacketOp
) : Promise<ClaimRedPacketOp> {
  if (op.redpacket && op.redpacket.type === "erc20") {
    const metadata = op.redpacket!.metadata as RedPacket;
    const tokenAddr = metadata.token.toLowerCase();
    const token = await loadAndSaveERC20Token(tokenAddr);
    op.redpacket.token = token;
  }
  return op;
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
  // margin-left: 5.5rem;
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
  width: 30px;
  height: 30px; }
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
  background-color: #4BAE4F; }
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
  justify-content: flex-start;
  margin: 0px;
  font-weight: 400;
  line-height: 1.5;
  font-size: 12px;
  width: 100px;
  color: rgb(91, 112, 131); }
.claimed-number-left {
  display: flex;
  justify-content: flex-end;
  margin: 0px;
  font-weight: 400;
  line-height: 1.5;
  font-size: 12px;
  width: 100px;
  color: rgb(91, 112, 131); }
.claimed-number-left strong {
  font-weight: bold; }
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
  justify-content: flex-start;
  align-items: center;
  grid-column: span 2/span 2;
  margin-bottom: 0;
  margin-left: 1.5rem; }
.record-detail {
  display: grid;
  padding-left: 1rem;
  padding-right: 1rem;
  overflow-x: visible;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-y: visible;
  align-items: center;
  grid-template-columns: repeat(9, minmax(0, 1fr));
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
  border-radius: 1rem;
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
  margin-left: 0.875rem;
  color: #6a6d7c; }
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
</style>
