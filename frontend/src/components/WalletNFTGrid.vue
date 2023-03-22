<template>
  <div v-if="loading" class="loading-state">
    <Loading />
  </div>
  <div v-if="!loading && totalNfts === 0">
    <EmptyContent 
      title="Start by receiving the first NFT"
      message="Unlocking the potential of Hexlink by depositing your first NFT or claim your first airdrop"
    >
    </EmptyContent>
  </div>
  <div v-if="!loading && totalNfts != 0" class="box">
    <div class="nft_grid">
      <NFTCard 
        v-for="(value, index) in nftImages" 
        :key="index"
        :style="'background:' + value.color" 
        :nftImage="value" >
      </NFTCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { loadErc721Token } from '@/web3/tokens';
import { useAccountStore } from "@/stores/account";
import { useNftStore } from '@/stores/nft';
import Loading from "@/components/Loading.vue";
import type { nftImage, bindedNFT } from '@/web3/tokens';
import NFTCard from './NFTCard.vue';
import { getBackcgroundColor } from '@/web3/utils';
import EmptyContent from '@/components/EmptyContent.vue';
import { hexlinkErc721Contract, hexlinkErc721Metadata } from "../../../functions/redpacket";
import { useChainStore } from '@/stores/chain';

const nftImages = ref<bindedNFT[]>([]);
const loading = ref<boolean>(false);
const nftPics = ref<nftImage[]>([]);
const totalNfts = ref<number>(0);

const loadNfts = async () => {
  loading.value = true;
  const data: any = await loadErc721Token(useAccountStore().account!.address);
  nftPics.value = data[0];
  totalNfts.value = data[1];
  preloadColors();
  loading.value = false;
}

const preloadColors = () => {
  var contracts: string[] = [];
  var symbols: string[] = [];
  var names: string[] = [];
  var nftIds: string[] = [];
  var images: string[] = [];
  var metadata: any = "";
  nftPics.value.map(async (nft: any) => {
    if (nft.name == "") {
      metadata = await hexlinkErc721Metadata(
        await hexlinkErc721Contract(
          nft.contract,
          useChainStore().provider
        )
      );
      symbols.push(metadata.symbol);
      names.push(metadata.name);
    } else {
      symbols.push(nft.symbol);
      names.push(nft.name);
    }
    contracts.push(nft.contract);
    nftIds.push(nft.id);
    images.push(nft.rawUrl == "" ? nft.url : nft.rawUrl);
    nftImages.value.push(await getBackcgroundColor({
      contract: nft.contract,
      name: nft.name == "" ? metadata.name : nft.name,
      symbol: nft.symbol == "" ? metadata.symbol : nft.symbol,
      id: nft.id,
      tokenType: nft.tokenType,
      openSea: nft.openSea,
      totalSupply: nft.totalSupply,
      url: nft.url,
      rawUrl: nft.rawUrl,
      thumbnail: nft.thumbnail,
      attributes: nft.attributes,
    }));
  })
  useNftStore().set(contracts, symbols, names, nftIds, images);
};

onMounted(async () => {
  await loadNfts();
})
</script>

<style lang="less" scoped>
.box-content {
  font-size: 0.75rem;
  line-height: 1rem;
  color: #6a6d7c;
  display: flex;
  align-items: center;
  justify-content: space-between; }
.no-history {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 450px;
  @media (max-width: 990px) {
    height: 150px; } }
.loading-state {
  display: flex;
  padding: 0.5rem;
  align-items: center;
  justify-content: center;
  height: 485px;
  @media (max-width: 990px) {
    height: 150px; } }
.card_details_box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 20px;
  transition: opacity .3s ease-out;
  @media (max-width: 640px) {
    padding: 10px 10px; } }
.card_details {
  position: relative;
  z-index: 1;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 0 500px 0px rgb(0 0 0 / 10%);
  transform: scale(1);
  transition: transform .3s cubic-bezier(.195, 1.085, .575, 1.555); }
.nft_footer {
  padding: 0 16px 16px;
  display: block;
  position: relative;
  box-sizing: border-box;
  margin-top: 1rem; }
.nft_header {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  border-radius: 14px; }
.nft_header img {
  width: 100%;
  opacity: 1;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  transition: opacity .3s ease-out;
  border-radius: 14px }
.nfts {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 14px;
  overflow: hidden;
  transition: transform .2s cubic-bezier(.5, 1, .89, 1);
  box-shadow: 0 0 15px 1px rgb(0 0 0 / 10%); }
.box {
  // padding: 1rem;
  @media (min-width: 640px) {
    padding: 1.5rem; } }
.amountOwned {
  display: flex;
  margin-bottom: 1.5rem;
  margin-left: 0.75rem;
  margin-left: 0.875rem; }
.nft_tab_shown {
  display: flex;
  padding-bottom: 0.25rem;
  align-items: center;
  border-bottom: 1px solid #262833;
  color: #262833;
  cursor: pointer; }
  .nft_tab_shown .amount {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    font-size: 0.75rem;
    line-height: 1rem;
    border-radius: 0.375rem;
    color: #fff;
    background-color: #262833; }
.nft_grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 1rem;
  row-gap: 1.5rem;
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 1.5rem; }
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: 1.5rem; }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, minmax(0, 1fr)); }
  // @media (min-width: 1280px) {
  //   grid-template-columns: repeat(5, minmax(0, 1fr));
  //   column-gap: 2rem; }
  @media (min-width: 1536px) {} }
.nft_card {
  position: relative;
  background-color: inherit;
  border-radius: 0.5rem;
  border: 1px solid #d9d9d9;
  cursor: pointer; }
.nft_card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-0.125rem);
  transition-property: all;
}
  .nft_card .nft_pic {
    display: flex;
    flex-shrink: 0;
    aspect-ratio: 1/1;
    background-color: #ecedef;
    overflow: hidden;
    align-items: center;
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem; }
    .nft_card .nft_pic .default-pic {
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgb(203,213,225);
      width: 100%;
      height: 100%; }
  .nft_card .nft_wallet_chain {
    display: flex;
    margin-right: 0.75rem;
    margin-top: -0.75rem;
    justify-content: flex-end; }
    .nft_card .nft_wallet_chain .items {
      display: flex;
      margin-left: -0.25rem;
      align-items: center; }
      .nft_card .nft_wallet_chain .items img {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 999px;
        object-fit: cover;
        --ring-color: #ffffff;
        box-shadow: 0 0 0 4px #fff; }
      .nft_card .nft_wallet_chain .items:hover {
        img {
          transform: translateY(-0.5rem); }
        .items_tag {
          display: inline-block; }
      }
  .nft_card .nft-info {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    margin-top: 0.75rem;
    margin-top: 0.875rem; }
    .nft_card .nft-info .collection_name {
      display: flex;
      font-size: 0.75rem;
      line-height: 1rem;
      color: #6a6d7c;
      justify-content: space-between;
      align-items: center; }
      .nft_card .nft-info .collection_name .collection_name_text {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap; }
.nft_title {
  display: block;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #262833;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  white-space: pre;
  margin-bottom: 0rem;
  margin-top: 0.5rem; }
.items_tag {
  visibility: visible;
  margin-bottom: 6rem;
  margin-left: -2.5rem;
  color: #fff;
  background: #222;
  border: 1px solid transparent;
  border-radius: 3px;
  display: none;
  font-size: 13px;
  padding: 8px 21px;
  position: fixed;
  pointer-events: none;
  transition: opacity 0.3s ease-out;
  z-index: 999; }
</style>