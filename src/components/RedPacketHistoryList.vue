<template>
  <!-- <a-list>
<template #renderItem="{ item }"> -->
  <div v-if="useRoute().params.action?.toString() == 'claim'" class="token-listDetail">
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
              <td>{{ redPacket.token.symbol }}</td>
              <td>{{
                normalizedDbBalance(redPacket)
              }} / {{
                normalize(redPacket.state.balance, redPacket.token)
              }}</td>
              <td>{{ redPacket.redPacket.metadata.split }} / {{ redPacket.state.split }}</td>
              <td>{{ redPacket.redPacket.metadata.mode }}</td>
              <td>{{ redPacket.state.createdAt.toLocaleString() }}</td>
              <td>
                <a-typography-paragraph :copyable="{ text: claimLink(redPacket.redPacket) }">
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
import { getCreatedRedPackets, updateRedPacketStatus } from '@/graphql/redpacket';
import { getClaimedRedPackets, updateRedPacketTxStatus } from '@/graphql/redpacketClaim';
import type { TokenMetadata, Token, RedPacketDB, ClaimedRedPacket, RedPacketClaim } from '@/types';
import { BigNumber as EthBigNumber } from "ethers";
import { queryRedPacketInfo } from "@/web3/redpacket";
import { normalizeBalance } from '@/web3/tokens';
import { getInfuraProvider } from "@/web3/network";
import { ethers } from "ethers";

interface RedPacketAggregated {
  redPacket: RedPacketDB,
  token: TokenMetadata,
  state: {
    balance: EthBigNumber,
    split: number,
    createdAt: Date
  }
};

const profileStore = useProfileStore();

const redPackets = ref<RedPacketAggregated[]>([]);
const claimed = ref<ClaimedRedPacket[]>([]);
const loadClaimInfo = async (provider: ethers.providers.Provider) => {
  const claims : ClaimedRedPacket[] = await getClaimedRedPackets();
  claimed.value = await Promise.all(
    claims.map(c => aggregatedClaimed(provider, c))
  );
}

const loadData = async function() {
  if (useProfileStore().profile?.initiated) {
    const provider = getInfuraProvider();
    const rps : RedPacketDB[] = await getCreatedRedPackets();
    redPackets.value = await Promise.all(rps.map(r => aggregateCreated(provider, r)));
    await loadClaimInfo(provider);
  }
};

onMounted(loadData);
watch(() => useNetworkStore().network, loadData);

const showDetailsEnabled = ref<boolean>(false);

const claimLink = (redPacket: RedPacketDB) => {
  return window.location.origin + useRoute().path + "?id=" + redPacket.id
};

const showDetails = async function() {
  showDetailsEnabled.value = showDetailsEnabled.value ? false : true;
};

const normalize = (balance: EthBigNumber | undefined, token: TokenMetadata) => {
  balance = balance || EthBigNumber.from(0);
  const normalized = normalizeBalance(balance, token.decimals);
  return normalized.normalized;
}

const normalizedDbBalance = (redPacket: RedPacketAggregated) => {
  return redPacket.redPacket.metadata.tokenAmount
    ? (
      redPacket.redPacket.metadata.balance || 
        normalize(
          EthBigNumber.from(redPacket.redPacket.metadata.tokenAmount),
          redPacket.token
        )
    ) : normalize(
      EthBigNumber.from(redPacket.redPacket.metadata.balance),
      redPacket.token
    );
}

const loadAndSaveERC20Token = async (tokenAddr: string) : Promise<Token> => {
  if (!profileStore.profile!.tokens[tokenAddr]) {
    profileStore.addToken({metadata: await getERC20Metadata(tokenAddr)});
  }
  return profileStore.profile!.tokens[tokenAddr]!;
}

const aggregateCreated = async function(
  provider: ethers.providers.Provider,
  redPacket: RedPacketDB
) : Promise<RedPacketAggregated> {
  redPacket.claims = await Promise.all((redPacket.claims || []).map(c => validateClaimStatus(provider, c)));
  const state = await queryRedPacketInfo(redPacket);
  const tokenAddr = redPacket.metadata.token.toLowerCase();
  const token = await loadAndSaveERC20Token(tokenAddr);
  const oldStatus = redPacket.status;
  if (!redPacket.status || redPacket.status == "pending") {
    const receipt = await provider.getTransactionReceipt(redPacket.tx);
    if (receipt?.status == 0) {
      redPacket.status = "error";
    } else if (receipt?.status == 1) {
      redPacket.status = "alive";
    }
  }
  if (redPacket.status == "alive") {
    if (state.balance.eq(0) || state.split == 0) {
      redPacket.status = "finalized";
    }
  }
  if (oldStatus !== redPacket.status) {
    await updateRedPacketStatus({
      id: redPacket.id,
      status: redPacket.status!
    });
  }
  return {
    redPacket,
    token: token.metadata,
    state,
  } as RedPacketAggregated;
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
      (log: any) => log.address.toLowerCase() == (useNetworkStore().network!.address.redpacket as string).toLowerCase()
    ).map(
      (log: any) => parseLog(log)
    );
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
