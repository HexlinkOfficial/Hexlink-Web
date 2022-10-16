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
        <div class="image-box">
          <img :src="nft.tokenMetadata.rawMedia" @click="showPreview(nft.tokenMetadata.rawMedia, nft.tokenMetadata.title, nft.tokenMetadata.externalUrl)"/>
        </div>
        <div class="metadata">
            <div class="title">
                <component :is="nft.tokenMetadata.externalUrl?'a':'span'" :href="nft.tokenMetadata.externalUrl || ''">
                    {{nft.tokenMetadata.title}}
                </component>
            </div>
            <div class="collection-name" v-if="nft.contractMetadata">
                {{nft.contractMetadata?.name}} - #{{nft.tokenId}}
            </div>
        </div>
      </div>
    </div>
  </a-row>
  <div v-if="preview" class="popup">
		<div class="popup-inner">
      <a-button class="close-button" @click="closePreview">
        <template #icon><CloseOutlined /></template>
      </a-button>
			<div><img :src="previewImageUrl" /></div>
      <component :is="previewTitleRedirectAvailable?'a':'span'" :href="previewTitleRedirectUrl || ''" class="preview-title">{{previewTitleName}}</component>
      <div class="preview-button">
        <a-button>Transfer</a-button>
      </div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllOwnedNFT } from '@/services/web3/nft';
import type { NFT } from '@/services/web3/nft';
import { CloseOutlined } from '@ant-design/icons-vue';

const loading = ref<boolean>(true);
const nfts = ref<NFT[]>([]);
const searchText = ref<string>("");
const preview = ref<boolean>(false);
const previewImageUrl = ref<string>("");
const previewTitleName = ref<string>("");
const previewTitleRedirectAvailable = ref<boolean>(false);
const previewTitleRedirectUrl = ref<string>("");

onMounted(async () => {
  const ownedNFTs = await getAllOwnedNFT();
  nfts.value = ownedNFTs;
  loading.value = false;
});

const showPreview = (url: string, title: string, redirectUrl?: string) => {
  if (!!redirectUrl) {
    previewTitleRedirectAvailable.value = true;
    previewTitleRedirectUrl.value = redirectUrl;
  }
  previewTitleName.value = title;
  previewImageUrl.value = url;
  preview.value = true;
}

const closePreview = () => {
  preview.value = false;
}

const onSearch = async(text: string) => {
  await getNFTList(text);
}

const getNFTList = async (text: string) => {

}

</script>

<style lang="less" scoped>
.image-container {
  position: relative;
  width: 250px; 
  padding: 10px;
}
.image-box {
  display: inline-block;
  overflow: hidden;
}
.image-box img {
  display: block;
  transition: .3s;
  width: 100%;
}
.image-box:hover img {
  transform: scale(1.2);
}
.metadata {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  background-color: rgb(124, 121, 121);
  color: white;
  padding: 20px;
}
.title {
  font-size: 14px;
  font-weight: bold;
}
a {
  color: #FFF;
}
a:hover {
   color: rgb(217, 217, 247);
   text-decoration: underline;
}
.collection-name {
  font-size: 12px;
}
.popup {
	margin: 70px auto;
  padding: 20px;
  background: none;
  border-radius: 5px;
  position: relative;
  position: fixed;
  top: 50%;
  left: 50%;
  padding: 10px;
  margin-top: -300px;
  margin-left: -50px;
  z-index: 999;
  width: 380px;
	.popup-inner {
		background: #FFF;
		padding: 35px;
	}
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  color: rgb(124, 121, 121);
  background: none;
}
.preview-title {
  color: black;
  font-size: 18px;
  font-weight: bold;
  padding-top: 15px;
}
.preview-button {
  padding-top: 5px;
}
img {
  max-width: 100%;
  max-height: 100%;
}
</style>