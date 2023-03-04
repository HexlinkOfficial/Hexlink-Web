<template>
  <div class="nfts">
    <header class="nft_header">
      <img :src="getImageSource()" width="540"
        height="540" />
    </header>
    <footer class="nft_footer">
      <div class="card_footer">
        <div class="card_details">
          <div class="card_details_box">
            <div style="width: 100%;">
              <div class="box-content">
                <div class="collection_name_text">{{ props.nftImage!.nft.symbol }}</div>
                <a :href="getOpenseaUrl(props.nftImage!.nft)" target="_blank">
                  <img src="https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.svg"
                    style="width: 20px;" />
                </a>
              </div>
              <p class="nft_title">{{ props.nftImage!.nft.name }} #{{ props.nftImage!.nft.id }}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { nftImage } from '@/web3/tokens';
import { useChainStore } from '@/stores/chain';

const props = defineProps({
  nftImage: Object
});

const getImageSource = () => {
  if (props.nftImage!.hasOpensea) {
    return props.nftImage!.nft.openSea.imageUrl;
  } else {
    if (props.nftImage!.nft.rawUrl != "") {
      return props.nftImage!.nft.rawUrl;
    } else {
      return props.nftImage!.nft.url;
    }
  }
}

const getOpenseaUrl = (nft: nftImage) => {
  if (useChainStore().chain.name == "goerli") {
    return 'https://testnets.opensea.io/assets/goerli/' + nft.contract + '/' + nft.id;
  } else if (useChainStore().chain.name == "polygon") {
    return 'https://opensea.io/assets/matic/' + nft.contract + '/' + nft.id;
  } else if (useChainStore().chain.name == "arbitrum") {
    return 'https://opensea.io/assets/arbitrum/' + nft.contract + '/' + nft.id;
  }
}
</script>

<style lang="less" scoped>
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
.nft_footer {
  padding: 0 16px 16px;
  display: block;
  position: relative;
  box-sizing: border-box;
  margin-top: 1rem;
  @media (max-width: 640px) {
    padding: 0 8px 8px;
    margin-top: 0.5rem; } }
.card_details {
  position: relative;
  z-index: 1;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 0 500px 0px rgb(0 0 0 / 10%);
  transform: scale(1);
  transition: transform .3s cubic-bezier(.195, 1.085, .575, 1.555); }
.card_details_box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 20px;
  transition: opacity .3s ease-out; }
.box-content {
  font-size: 1rem;
  line-height: 1rem;
  color: #6a6d7c;
  display: flex;
  align-items: center;
  justify-content: space-between; }
.collection_name_text {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap; }
.nft_title {
  display: block;
  font-size: 1rem;
  line-height: 1.25rem;
  color: #262833;
  font-weight: 500;
  overflow: scroll;
  white-space: nowrap;
  white-space: pre;
  margin-bottom: 0rem;
  margin-top: 0.5rem;
  @media (max-width: 640px) {
    font-size: 0.75rem;
    line-height: 1rem; } }
.nfts {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 14px;
  overflow: hidden;
  transition: transform .2s cubic-bezier(.5, 1, .89, 1);
  box-shadow: 0 0 15px 1px rgb(0 0 0 / 10%); }
::-webkit-scrollbar {
  display: none; }
</style>