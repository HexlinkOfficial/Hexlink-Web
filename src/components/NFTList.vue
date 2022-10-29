<template>
  <div v-for="(nft, index) in props.nfts" :key="index">
    <div class="image-container">
      <div v-if="nft.nft_raw_url">
        <div class="image-box">
          <img :src="nft.nft_raw_url" @click="showPreview(nft.nft_raw_url, nft.collection_address, nft.token_id, nft.nft_title, nft.nft_description, nft.nft_external_url)"/>
        </div>
        <div class="metadata">
          <div class="title">
            <component :is="nft.nft_external_url?'a':'span'" :href="nft.nft_external_url || ''">
              {{nft.nft_title}} 
            </component>
          </div>
          <div class="collection-name" v-if="nft.collection_name">
            {{nft.collection_name}} - #{{nft.token_id}}
          </div>
        </div>
      </div>
      <div v-else>
        <div style="border-style: solid; padding: 5px"> 
          <div style="font-weight: bold;">{{nft.nft_title}}</div> 
          <div style="padding-top: 5px; font-weight: bold;">Collection Address</div>
          <div style="padding-top: 5px; overflow-wrap: break-word;">{{nft.collection_address}}</div>
          <div style="padding-top: 5px; font-weight: bold;">Token ID</div>
          <div style="padding-top: 5; overflow-wrap: break-word;">{{nft.token_id}}</div>
          <div style="padding-top: 5px; padding-bottom: 5px">
            <a-button type="primary" ghost>Transfer</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="preview" class="popup">
		<div class="popup-inner">
      <a-button class="close-button" @click="closePreview">
        <template #icon><CloseOutlined /></template>
      </a-button>
			<div><img :src="previewImageUrl" /></div>
      <component :is="previewTitleRedirectAvailable?'a':'span'" :href="previewTitleRedirectUrl || ''" class="preview-title">{{previewTitleName}}</component>
      <div style="padding-top: 10px">{{previewDescription}}</div>
      <div style="padding-top: 10px; font-weight: bold;">Collection Address</div>
      <div style="padding-top: 5px; overflow-wrap: break-word;">{{previewCollectionAddress}}</div>
      <div style="padding-top: 10px; font-weight: bold;">Token ID</div>
      <div style="padding-top: 5; overflow-wrap: break-word;">{{previewTokenId}}</div>
      <div style="padding-top: 15px; padding-bottom: 15px">
        <a-button type="primary">Transfer</a-button>
      </div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { NFTInterface } from '@/services/graphql/nft';
import { CloseOutlined } from '@ant-design/icons-vue';

const preview = ref<boolean>(false);
const previewImageUrl = ref<string>("");
const previewTitleName = ref<string>("");
const previewDescription = ref<string>("");
const previewCollectionAddress = ref<string>("");
const previewTokenId = ref<string>("");
const previewTitleRedirectAvailable = ref<boolean>(false);
const previewTitleRedirectUrl = ref<string>("");

const props = defineProps({
  nfts: {
    type: Object as () => NFTInterface[],
    required: true,
  },
});

const showPreview = (url: string, collectionAddress: string, tokenId: string, title?: string, description?: string, redirectUrl?: string) => {
  if (!!redirectUrl) {
    previewTitleRedirectAvailable.value = true;
    previewTitleRedirectUrl.value = redirectUrl;
  }
  previewTitleName.value = title || "";
  previewDescription.value = description || "";
  previewCollectionAddress.value = collectionAddress;
  previewTokenId.value = tokenId;
  previewImageUrl.value = url;
  preview.value = true;
}

const closePreview = () => {
  preview.value = false;
}
</script>

<style lang="less" scoped>
.image-container {
  position: relative;
  height: 300px;
  width: 250px; 
  padding: 10px;
  overflow: hidden;
}
.image-box {
  display: inline-block;
  overflow: hidden;
}
.image-box img {
  display: block;
  transition: .3s;
  width: 100%;
  height: 100%;
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
.collection-name {
  font-size: 12px;
}
.preview-title {
  color: black;
  font-size: 18px;
  font-weight: bold;
  padding-top: 15px;
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
  margin-top: -450px;
  margin-left: -50px;
  z-index: 999;
  width: 380px;
	.popup-inner {
		background: rgb(235, 235, 235);
		padding: 25px;
	}
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  color: rgb(124, 121, 121);
  background: none;
}
a {
  color: #FFF;
}
a:hover {
   color: rgb(217, 217, 247);
   text-decoration: underline;
}
img {
  max-width: 100%;
  max-height: 100%;
}
</style>