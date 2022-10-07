<template>
  <a-row justify="center" style="margin-top: 20px; margin-bottom: 20px;">
    <a-col style="text-align: center;">
      <a-input-search
        placeholder="search items, collections, and accounts"
        enter-button
        style="margin-top: 10px; margin-bottom: 30px; width: 100%; min-width: 400px;"
      />
    </a-col>
  </a-row>
  <a-row v-if="loading" justify="center"></a-row>
  <a-row v-if="!loading" justify="center" style="margin-top: 20px; margin-bottom: 20px;">
    <div v-for="(nft, index) in nfts" :key="index">
      <div class="image-container">
        <img class="image" :src="nft.tokenMetadata.rawMedia" />
        <div class="metadata">
            {{nft.tokenMetadata.title}}
        </div>
      </div>
    </div>
  </a-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllOwnedNFT } from '@/services/web3/nft';
import type { NFT } from '@/services/web3/nft';

const loading = ref<boolean>(true);
const nfts = ref<NFT[]>([]);

onMounted(async () => {
  const ownedNFTs = await getAllOwnedNFT();
  nfts.value = ownedNFTs;
  loading.value = false;
});
</script>

<style lang="less" scoped>
.image-container {
  position: relative;
  width: 250px; 
}
.image {
  padding: 10px;
  width: 100%;
}
.metadata {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  background-color: rgb(55, 52, 52);
  color: white;
  padding: 20px;
}
</style>