<template>
  <div v-for="(nft, index) in props.nfts" :key="index">
    <div class="image-container">
      <div v-if="nft.nft_raw_url">
        <div class="image-box">
          <img :src="nft.nft_raw_url" @click="showPreview(nft.nft_raw_url, nft.collection_address, nft.token_id, nft.id, nft.nft_title, nft.nft_description, nft.nft_external_url)"/>
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
      <div v-if="showReceiverBar">
        <a-input style="margin-top: 5px" v-model:value="receiverAddress" placeholder="Please input receiver address here." />
        <a-row style="margin-top: 5px" v-if="receiverValidatorError" class="alert">
          <a-alert message="Please input valid receiver address here." type="error" banner />
        </a-row>
        <a-button type="primary" @click="executeTransfer" style="margin-top: 7px">Transfer</a-button>
      </div>
      <div v-if="!showReceiverBar" style="padding-top: 15px; padding-bottom: 15px">
        <a-button type="primary" @click="initializeTransfer">Transfer</a-button>
      </div>
		</div>
	</div>
  <div v-if="showTransferResponse" class="popup">
    <div class="popup-inner">
      <a-button class="close-button" @click="closeTransferResponse">
        <template #icon><CloseOutlined /></template>
      </a-button>
      <div>Collectible sent. Transaction ID is: {{transferResponse}}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as ethers from "ethers";
import type { NFTOutput } from '@/services/graphql/nft';
import { CloseOutlined } from '@ant-design/icons-vue';
import { transferNFT } from '@/services/web3/nft';
import { validateEmail } from '@/services/validator';
import { useAuthStore } from '@/stores/auth';

const store = useAuthStore();
const preview = ref<boolean>(false);
const previewImageUrl = ref<string>("");
const previewTitleName = ref<string>("");
const previewDescription = ref<string>("");
const previewCollectionAddress = ref<string>("");
const previewTokenId = ref<string>("");
const previewTitleRedirectAvailable = ref<boolean>(false);
const previewTitleRedirectUrl = ref<string>("");
const previewNFTId = ref<number>(-1);
const transferResponse = ref<string>("");
const showReceiverBar = ref<boolean>(false);
const receiverAddress = ref<string>("");
const receiverValidatorError = ref<boolean>(false);
const showTransferResponse = ref<boolean>(false);
const showTransferFailue = ref<boolean>(false);

const props = defineProps({
  nfts: {
    type: Object as () => NFTOutput[],
    required: true,
  },
});

const showPreview = (url: string, collectionAddress: string, tokenId: string, id: number, title?: string, description?: string, redirectUrl?: string) => {
  if (!!redirectUrl) {
    previewTitleRedirectAvailable.value = true;
    previewTitleRedirectUrl.value = redirectUrl;
  }
  previewTitleName.value = title || "";
  previewDescription.value = description || "";
  previewCollectionAddress.value = collectionAddress;
  previewTokenId.value = tokenId;
  previewImageUrl.value = url;
  previewNFTId.value = id;
  preview.value = true;
}

const closePreview = () => {
  preview.value = false;
  showReceiverBar.value = false;
  receiverAddress.value = "";
  receiverValidatorError.value = false;
}

const initializeTransfer = () => {
  showReceiverBar.value = true;
}

const executeTransfer = async function() {
  if (ethers.utils.isAddress(receiverAddress.value) || validateEmail(receiverAddress.value)) {
    receiverValidatorError.value = false;

    transferResponse.value = (await transferNFT(
      store.currentUser!.walletAddress!,
      receiverAddress.value,
      previewCollectionAddress.value,
      previewTokenId.value,
      previewNFTId.value,
      store.idToken!
    )).txHash;
    
    if (transferResponse.value) {
      closePreview();
      showTransferResponse.value = true;
    } else {
      showTransferFailue.value = true;
    }
  } else {
    receiverValidatorError.value = true;
  }
}

const closeTransferResponse = () => {
  transferResponse.value = "";
  showTransferResponse.value = false;
  showTransferFailue.value = false;
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