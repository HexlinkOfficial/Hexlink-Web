<template>
  <a-row justify="center" style="margin-top: 20px; margin-bottom: 20px;">
    <NFTImportView
      @nftAdded="handleNFTAdded"
    ></NFTImportView>
  </a-row>
  <a-row justify="center">
    <a-button disabled>{{viewType}}</a-button>
  </a-row>
  <a-row v-if="loading" justify="center"></a-row>
  <a-row v-if="!loading && isCollectionViewType == false" justify="center" style="margin-top: 5px; margin-bottom: 20px;">
    <NFTList
      :nfts="nfts"
    ></NFTList>
  </a-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllOwnedNFT } from '@/services/web3/nft';
import type { NFTOutput } from '@/services/graphql/nft';
import { useAuthStore } from '@/stores/auth';
import NFTList from './NFTList.vue';
import NFTImportView from './NFTImportView.vue';

const store = useAuthStore();
const loading = ref<boolean>(true);
const nfts = ref<NFTOutput[]>([]);

const isCollectionViewType = ref<boolean>(false);
const viewType = ref<string>("Switch to Collection View");

onMounted(async () => {
  const ownedNFTs = await getAllOwnedNFT(store);
  nfts.value = ownedNFTs;
  loading.value = false;
});

const handleNFTAdded = async function(nft: NFTOutput) {
  nfts.value.push(nft);
}

const switchType = () => {
  if (isCollectionViewType.value == false) {
    isCollectionViewType.value = true;
    viewType.value = "Switch to Flat View";
  } else {
    isCollectionViewType.value = false;
    viewType.value = "Switch to Collection View";
  }
}
</script>

<style lang="less" scoped>
img {
  max-width: 100%;
  max-height: 100%;
}
</style>