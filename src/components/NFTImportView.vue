<template>
  <a-row>
    <a-col style="text-align: center;">
      <a-button type="primary" block @click="showImportCard">Import NFT</a-button>
    </a-col>
  </a-row>
  <div v-if="importCard" class="popup">
		<div class="popup-inner">
      <a-button class="close-button" @click="closeImportCard">
        <template #icon><CloseOutlined /></template>
      </a-button>
      <a-row>
        <div v-if="showSearchBar" style="width: 100%">
          <div>Please enter the contract address: </div>
          <a-input-search
            placeholder="search by contract address"
            enter-button
            style="margin-top: 10px; margin-bottom: 30px;"
            v-model:value="searchText"
            @search="onSearch"
          />
        </div>
        <a-row v-if="showError" class="alert">
          <a-alert message="It looks like you are not the owner of this collection. Please check the contract address you have entered." type="error" banner />
        </a-row>
        <a-row v-if="showWarning" class="alert">
          <a-alert message="The contract address you have entered is not available. Please check address you have entered." type="warning" banner />
        </a-row>
      </a-row>
      <a-row>
        <div v-if="showTokenIdBar" style="width: 100%;">
          <div style="margin-bottom: 5px">Contract Address</div>
          <a-input :placeholder="importNFT.collection_address" disabled style="margin-bottom: 10px"/>
          <div v-if="!hideTokenSearchBar">
            <div>Please enter the token ID: </div>
            <a-input-search
              placeholder="search by token ID"
              enter-button
              style="margin-top: 10px; margin-bottom: 30px;"
              v-model:value="tokenIdText"
              @search="onSearchTokenId"
            />
            <a-row v-if="showTokenIdSearchError" class="alert">
              <a-alert message="The token ID you have entered is not available. Please check token ID you have entered." type="error" banner />
            </a-row>
            <a-row v-if="showDataExistedWarning" class="alert">
              <a-alert message="The NFT you tried to import has already been imported to your wallet." type="warning" banner />
            </a-row>
          </div>
        </div>
      </a-row>
      <a-row>
        <div v-if="showNFTInfo" style="width: 100%;">
          <div style="margin-bottom: 5px">Token ID</div>
          <a-input :placeholder="importNFT.token_id" disabled style="margin-bottom: 30px"/>
          <div><img :src="importNFT.nft_raw_url" /></div>
          <div v-if="importNFT.nft_title">
            <div style="margin-top:5px">Title: {{importNFT.nft_title}}</div>
          </div>
          <div v-if="importNFT.collection_name">
            <div style="margin-top:5px">Collection Name: {{importNFT.collection_name}}</div>
          </div>
          <div v-if="importNFT.collection_symbol">
            <div style="margin-top:5px">Collection Symbol: {{importNFT.collection_symbol}}</div>
          </div>
          <a-row style="margin-top: 10px">
            <a-button type="primary" @click="importNFTToken(importNFT)">Import</a-button>
            <a-button @click="closeImportCard" style="margin-left: 10px">Cancel</a-button>
          </a-row>
        </div>
      </a-row>
      <a-row style="margin-top: 5px;" v-if="!showNFTInfo">
        <a-button @click="closeImportCard">Cancel</a-button>
      </a-row>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { IAuth } from "@/stores/auth";
import { CloseOutlined } from '@ant-design/icons-vue';
import { getNFTMetadata, isHolderOfCollection } from '@/services/web3/nft';
import { queryNFT, saveNFTForUser } from '@/services/graphql/nft';
import type { NFTInterface, NFTOutput } from '@/services/graphql/nft';

const importCard = ref<boolean>(false);
const searchText = ref<string>("");
const showError = ref<boolean>(false);
const showWarning = ref<boolean>(false);
const showSearchBar = ref<boolean>(true);
const showTokenIdBar = ref<boolean>(false);
const tokenIdText = ref<string>("");
const showTokenIdSearchError = ref<boolean>(false);
const showDataExistedWarning = ref<boolean>(false);
const showNFTInfo = ref<boolean>(false);
const hideTokenSearchBar = ref<boolean>(false);
const importNFT = ref<NFTInterface>({
  collection_address: "",
  token_id: "",
  nft_raw_url: ""
});

const props = defineProps({
  store: {
    type: Object as () => IAuth,
    required: true,
  },
});

const showImportCard = () => {
  showSearchBar.value = true;
  importCard.value = true;
}

const closeImportCard = () => {
  importCard.value = false;
  showSearchBar.value = true;
  showTokenIdBar.value = false;
  searchText.value = "";
  tokenIdText.value = "";
  showError.value = false;
  showWarning.value = false;
  importNFT.value.collection_address = "";
  importNFT.value.token_id = "";
  showTokenIdSearchError.value = false;
  showDataExistedWarning.value = false;
  showNFTInfo.value = false;
  hideTokenSearchBar.value = false;
}

const onSearch = async (text: string) => {
  showError.value = false;
  showWarning.value = false;

  try {
    const isHolderOfAddress = await isHolderOfCollection(props.store.currentUser!.walletAddress!, text);
    if (isHolderOfAddress) {
      importNFT.value.collection_address = text;
      showSearchBar.value = false;
      hideTokenSearchBar.value = false;
      showTokenIdBar.value = true;
    } else {
      showError.value = true;
    }
  } catch (err: any) {
    showWarning.value = true;
    console.log("Failed to fetch collection for the given collection address." + err);
  }
}

const onSearchTokenId = async (text: string) => {
  showTokenIdSearchError.value = false;
  showDataExistedWarning.value = false;

  try {
    const checkNFTExisted = await queryNFT(props.store.currentUser!, importNFT.value.collection_address, text, props.store.idToken!);
    if (checkNFTExisted.length >0) {
      showDataExistedWarning.value = true;
      return;
    }
  } catch(error: any) {
    console.log(error);
  }

  try {
    const nftToken = await getNFTMetadata(importNFT.value.collection_address, text);
    if (nftToken && nftToken.nft_raw_url) {
      importNFT.value = nftToken;
      hideTokenSearchBar.value = true;
      showNFTInfo.value = true;
    } else {
      showTokenIdSearchError.value = true;
    }
  } catch (err: any) {
    showTokenIdSearchError.value = true;
    console.log("Failed to fetch nft information for the given token ID." + err);
  }
}

const emit = defineEmits(['nftAdded']);
const importNFTToken = (nft: NFTInterface) => {
  try {
    saveNFTForUser(props.store.currentUser!, props.store.idToken!, [nft]);
  } catch (error: any) {
    console.error("Failed while storing imported NFT for user.");
  }

  emit('nftAdded', importNFT.value);
  closeImportCard();
}
</script>

<style lang="less" scoped>
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
.alert {
  margin-bottom: 30px;
}
img {
  max-width: 100%;
  max-height: 100%;
}
</style>