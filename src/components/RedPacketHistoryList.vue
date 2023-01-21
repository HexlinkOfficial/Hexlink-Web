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
        <div v-for="(value, name, index) in redPacketByDate" :key="index" style="position: relative; ">
          <div class="history-date">
            <div style="font-size: 0.875rem; line-height: 1.25rem;">{{ name }}</div>
          </div>
          <div v-for="(v, i) in value" :key="i" class="history-record">
            <div style="display: flex; align-items: center;">
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
                        Sent 
                        <a-tooltip placement="top">
                          <template #title>
                            <span>
                              Amount: {{ normalizedDbBalance(v) }}
                            </span>
                          </template>
                          <div style="overflow: auto; white-space: nowrap; margin-left: 0.25rem; max-width: 40px;">{{ normalizedDbBalance(v) }}</div>
                        </a-tooltip>
                        <div class="token-icon" style="margin-right: 0.25rem; margin-left: 0.25rem;">
                          <img :src="v.token.logoURI">
                        </div>
                        {{ v.redPacket.metadata.mode }}ly
                      </div>
                    </div>
                    <div style="color: #6a6d7c; white-space: nowrap; margin-left: 0; font-size: 12px;">
                      <div style="display: flex;">{{ v.redPacket.createdAt.toLocaleString().split(',')[1] }}</div>
                    </div>
                  </div>
                </div>
                <div class="claim-status">
                  <div class="progress-bar">
                    <span class="box-progress" :style="{ width: (v.redPacket.metadata.split - v.state.split)/v.redPacket.metadata.split*100 + '%' }"></span>
                  </div>
                  <div class="claimed-data">
                    <p class="claimed-number">
                      Claimed: 
                      <strong>{{ v.redPacket.metadata.split - v.state.split }}/{{ v.redPacket.metadata.split }}</strong>
                       Share
                    </p>
                    <p class="claimed-number">
                      Left:
                      <strong>{{ normalize(v.state.balance, v.token) }}</strong>
                      <div class="token-icon" style="margin-right: 0.25rem; margin-left: 0.25rem;">
                        <img :src="v.token.logoURI">
                      </div>
                      {{ v.token.symbol }}
                    </p>
                  </div>
                </div>
                <div class="cta">
                  <button class="connect-wallet-button" @click="(claimLink(v.redPacket))">
                    Share
                  </button>
                  <button class="connect-wallet-button">
                    Withdraw
                  </button>
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
import { useNetworkStore } from '@/stores/network';
import { getCreatedRedPackets, updateRedPacketStatus } from '@/graphql/redpacket';
import { getClaimedRedPackets, updateRedPacketTxStatus, getRedPacketClaims } from '@/graphql/redpacketClaim';
import type {
  Token,
  RedPacketDB,
  ClaimedRedPacket,
  RedPacketClaim,
  RedPacketOnchainState
} from '@/types';
import { BigNumber as EthBigNumber } from "ethers";
import { queryRedPacketInfo } from "@/web3/redpacket";
import { normalizeBalance } from '@/web3/tokens';
import { getInfuraProvider, getProvider } from "@/web3/network";
import { ethers } from "ethers";
import Loading from "@/components/Loading.vue";
import { useAccountStore } from '@/stores/account';
import { useTokenStore } from '@/stores/token';

interface CreatedRedPacket {
  redPacket: RedPacketDB,
  token: Token,
  state: RedPacketOnchainState
};

const redPackets = ref<CreatedRedPacket[]>([]);
const claimed = ref<ClaimedRedPacket[]>([]);
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

const loadData = async function() {
  loading.value = true;
  if (useAccountStore().account) {
    const provider = getInfuraProvider();
    const rps : RedPacketDB[] = await getCreatedRedPackets();
    redPackets.value = await Promise.all(rps.map(r => aggregateCreated(provider, r)));
    await loadClaimInfo(provider);
    // await loadClaimsForOnePacket(provider, redPackets.value[0]?.redPacket.id);
  }
  loading.value = false;
  extractDate();
};

const extractDate = () => {
  const group: any = {};
  redPackets.value.forEach(async (val) => {
    let txn_test = await getProvider().getTransaction(val.redPacket.tx);
    if (txn_test) {
      const date = new Date(val.redPacket.createdAt).toLocaleString().split(',')[0];
      if (date in group) {
        group[date].push(val);
      } else {
        group[date] = new Array(val);
      }

      // sort the object
      const ordered_group: any = {}
      var isDescending = true;
      const d_group = Object.keys(group).sort((a, b) => isDescending
        ? new Date(b).getTime() - new Date(a).getTime()
        : new Date(a).getTime() - new Date(b).getTime());
      d_group.forEach((v) => {
        ordered_group[v] = group[v];
      })
      redPacketByDate.value = ordered_group;
    }
  });
}

const loading = ref<boolean>(true);
  
onMounted(loadData);
watch(() => useNetworkStore().network, loadData);

const showDetailsEnabled = ref<boolean>(false);

const route = useRoute();
const claimLink = (redPacket: RedPacketDB) => {
  return (window.location.origin + route.path + "?claim=" + redPacket.id);
};

const showDetails = () => {
  showDetailsEnabled.value = showDetailsEnabled.value ? false : true;
};

const normalize = (balance: string | undefined, token: Token) => {
  const normalized = normalizeBalance(
    EthBigNumber.from(balance || 0),
    token.decimals
  );
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
  const update : {
    status?: string,
    state?: RedPacketOnchainState
  } = {status: redPacket.status};
  if (!redPacket.status || redPacket.status == "pending") {
    const receipt = await provider.getTransactionReceipt(redPacket.tx);
    if (receipt?.status == 0) {
      redPacket.status = "error";
    } else if (receipt?.status == 1) {
      redPacket.status = "alive";
    }
  }
  if (redPacket.status == "alive") {
    const state = await queryRedPacketInfo(redPacket);
    update.state = {
      balance: state.balance.toString(),
      split: state.split,
      createdAt: state.createdAt.toISOString(),
    }
    if (state.balance.eq(0) || state.split == 0) {
      redPacket.status = "finalized";
    }
  }
  if (update.status != redPacket.status) {
    await updateRedPacketStatus({
      id: redPacket.id,
      status: redPacket.status!,
      state: redPacket.status == "finalized" ? update.state : undefined,
    });
  }
  return {
    redPacket,
    token,  
    state: update.state
  } as CreatedRedPacket;
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
        useNetworkStore().network.address.redpacket as string
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
) : Promise<ClaimedRedPacket> {
  redpacket.claim = await validateClaimStatus(provider, redpacket.claim);
  return redpacket;
}
</script>

<style lang="less" scoped>
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
  height: 42vh; }
.sent-info {
  display: flex;
  flex-shrink: 1;
  white-space: nowrap;
  font-weight: 600;
  font-size: 12px; }
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
  grid-column: span 6/span 6; }
.action-and-time {
  display: flex;
  align-items: center;
  grid-column: span 2/span 2;
  margin-bottom: 0; }
.record-detail {
  display: grid;
  gap: 1.5rem;
  padding-left: 1rem;
  overflow-x: visible;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-y: visible;
  align-items: center;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  flex: 1 1;
  width: 100%; }
.history-record {
  position: relative;
  border-top: 1px solid #e5e7eb;
  padding-left: 1.5rem;
  padding-right: 0.5rem;
  padding-top: 0.5rem;
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
