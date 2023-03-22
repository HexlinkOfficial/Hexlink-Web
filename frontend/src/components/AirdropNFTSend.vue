<template>
  <div class="collection-file">
    <span class="title">Upload file</span>
    <div class="upload-box">
      <div class="upload-box-wrap" v-if="!nftAirdrop.file">
        <input 
          hidden
          id="nftUpload"
          accept="image/png,image/jpeg,image/gif,image/webp,video/mp4,video/webm,audio/mp3,audio/webm,audio/mpeg"
          name="primary-attachment" 
          type="file" 
          data-marker="Upload file" 
          @change="chooseFile"
          class="upload-input"
        >
        <div class="input-content">
          <span class="input-title">PNG, GIF, WEBP, MP4 or MP3. Max 100mb.</span>
          <button type="button" class="file-upload-button" @click="showFileSelection">
            <span class="button-text">Choose File</span>
          </button>
        </div>
      </div>
      <div class="upload-box-wrap" style="justify-content: space-evenly; border: 0px; padding: 16px 16px;" v-if="nftAirdrop.file">
        <div v-if="!showPreview">
          <span class="title">NFT</span>
          <div class="nft-pic">
            <img :src="createObjectURL(nftAirdrop.file)" />
          </div>
        </div>
        <div v-if="showPreview">
          <span class="title">Preview</span>
          <div class="nft-preview">
            <Loading v-if="getColorStatus === ''" style="padding-bottom: 45px;" />
            <NFTCard 
              v-if="getColorStatus === 'Done'"
              :nftImage="{
                nft: {
                  name: 'Preview Name',
                  symbol: 'PV',
                  id: '666',
                  rawUrl: createObjectURL(nftAirdrop.file)
                },
                color: imageColor,
                hasOpensea: false
              }"
              :style="'background:' + imageColor" 
            ></NFTCard>
          </div>
        </div>
        <div style="display: flex; padding: 10px; width: 150px; justify-content: space-between; align-items: center;">
          <button type="button" @click="removeFile" class="changePicButton">
            <svg style="color: rgb(22, 22, 26);" viewBox="0 0 24 24" fill="none" width="24" height="24" xlmns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M17.5303 7.53033C17.8232 7.23744 17.8232 6.76256 17.5303 6.46967C17.2374 6.17678 16.7626 6.17678 16.4697 6.46967L12 10.9393L7.53033 6.46967C7.23744 6.17678 6.76256 6.17678 6.46967 6.46967C6.17678 6.76256 6.17678 7.23744 6.46967 7.53033L10.9393 12L6.46967 16.4697C6.17678 16.7626 6.17678 17.2374 6.46967 17.5303C6.76256 17.8232 7.23744 17.8232 7.53033 17.5303L12 13.0607L16.4697 17.5303C16.7626 17.8232 17.2374 17.8232 17.5303 17.5303C17.8232 17.2374 17.8232 16.7626 17.5303 16.4697L13.0607 12L17.5303 7.53033Z"
                fill="currentColor"></path>
            </svg>
          </button>
          <button type="button" @click="showPreview = !showPreview" class="changePicButton" style="width: auto; color: black; padding: 10px;" :style="showPreview ? 'background: #076ae0; color: white;' : ''">Preview</button>
        </div>
      </div>
    </div>
  </div>
  <div id="name" class="collection-details">
    <span class="title">Collection Name</span>
    <div style="width: 100%; padding: 0 0.87rem;">
      <div class="input-box-wrap">
        <div class="input-box">
          <input v-model="nftAirdrop.name" class="text-input" placeholder="e. g. &quot;Redeemable T-Shirt with logo&quot;" type="text" data-marker="Name">
        </div>
    </div>
    </div>
  </div>
  <div id="symbol" class="collection-details">
    <span class="title">Collection Symbol</span>
    <div style="width: 100%; padding: 0 0.87rem;">
      <div class="input-box-wrap">
        <div class="input-box">
          <input v-model="nftAirdrop.symbol" class="text-input" placeholder="e. g. &quot;Redeemable T-Shirt with logo&quot;" type="text" data-marker="Name">
        </div>
      </div>
    </div>
  </div>
  <div id="amount" class="collection-details">
    <span class="title">Max Supply</span>
    <div style="width: 100%; padding: 0 0.87rem;">
      <div class="input-box-wrap">
        <div class="input-box">
          <input
            v-model="nftAirdrop.splitInput"
            class="text-input"
            placeholder="e. g. &quot;100,200,300&quot;"
            type="number"
            data-marker="Name">
        </div>
      </div>
    </div>
  </div>
  <div class="gas-station">
    <div class="enable-switch">
      <p>Enable dynamic share link</p>
      <a-switch v-model:checked="enableDynamic" style="margin-left: 1rem;" />
      <div class="tooltip fade" data-title="Service gas fee is determined by the market, not Hexlink">
        <img style="margin-left: 1rem; width: 16px;" src="@/assets/svg/info.svg" />
      </div>
    </div>
    <div class="gas-estimation">
      <p>
        <img style="width: 20px; height: 20px;" src="https://i.postimg.cc/RhXfgJR1/gas-pump.png" />
        <span class="estimated-fee">Estimated Fee:&nbsp;</span>
        <a-tooltip placement="top">
          <template #title>
            <span>The real service fee may differ per network conditions</span>
          </template>
          <b>&nbsp; {{ totalServiceFee }}</b>
        </a-tooltip>
      </p>
      <div class="total-choose-token">
        <div class="token-select">
          <div class="mode-dropdown" 
            :class="chooseGasDrop && 'active'" 
            @click.stop="chooseGasDrop = !chooseGasDrop;"
            v-on-click-outside.bubble="chooseGasHandle">
            <div class="token-icon">
              <img :src="gasToken.logoURI" />
            </div>
            <div class="mode-text2">{{ gasToken.symbol }}</div>
            <input class="mode-input" type="text" placeholder="select" readonly>
            <div class="mode-options">
              <div class="mode-option" v-for="(token, index) of tokens" :key="index" @click="tokenChoose('gas', token)">
                <div class="token-icon">
                  <img :src="token.logoURI" />
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-start;">
                  <b>{{ token.symbol }}</b>
                  <div style="margin-right:0.5rem;">
                    Balance {{ tokenBalance(token.address) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tooltip fade" data-title="Service gas fee is determined by the market, not Hexlink">
        <img style="margin-left: 1rem; width: 16px;" src="@/assets/svg/info.svg" />
      </div>
    </div>
  </div>
  <div class="choose-account">
    <RedPacketAccount
      account="hexlink"
      :token="nftAirdrop.gasToken"
      :gasToken="nftAirdrop.gasToken"
      :tokenBalance="hexlAccountBalance(nftAirdrop.gasToken)"
      :gasTokenBalance="hexlAccountBalance(nftAirdrop.gasToken)"
      @selected="setAccount"
      :isChosen="useRedPacketStore().account === 'hexlink'"
    >
    </RedPacketAccount>
    <RedPacketAccount
      account="wallet"
      :token="nftAirdrop.gasToken"
      :gasToken="nftAirdrop.gasToken"
      :tokenBalance="walletAccountBalance(nftAirdrop.gasToken)"
      :gasTokenBalance="walletAccountBalance(nftAirdrop.gasToken)"
      @selected="setAccount"
      :isChosen="useRedPacketStore().account === 'wallet'"
    >
    </RedPacketAccount>
  </div>
  <div class="create">
    <button class="connect-wallet-button" @click="confirmNFT" style="width: 90%;">
      <img style="margin-right: 10px;" src="@/assets/svg/redPacket.svg"/>
      Confirm Red Packet
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useTokenStore } from "@/stores/token";
import { BigNumber } from "bignumber.js";
import { BigNumber as EthBigNumber } from "ethers";
import { tokenBase } from "@/web3/utils";
import type { OnClickOutsideHandler } from '@vueuse/core';
import { vOnClickOutside } from '@/services/directive';
import type { Token } from "../../../functions/common";
import { useChainStore } from "@/stores/chain";
import { getPriceInfo } from "@/web3/network";
import { hash, calcGas } from "../../../functions/common";
import { redpacketErc721Id, predictErc721Address } from "../../../functions/redpacket";
import type { RedPacketErc721Input } from "../../../functions/redpacket";
import type { BalanceMap } from "@/web3/tokens";
import { getBalances } from "@/web3/tokens";
import { useAccountStore } from '@/stores/account';
import { useWalletStore } from '@/stores/wallet';
import RedPacketAccount from "@/components/RedPacketAccount.vue";
import { validator} from "@/web3/redpacket";
import { uploadToIPFS } from "@/web3/storage";
import {BigNumber as EhtBigNumber} from "ethers";
import { createNotification } from "@/web3/utils";
import { useRedPacketStore } from '@/stores/redpacket';
import type { AccountType } from "@/stores/redpacket";
import NFTCard from "./NFTCard.vue";
import { getBackcgroundColor } from '@/web3/utils';
import type { nftImage } from '@/web3/tokens';
import Loading from "@/components/Loading.vue";
import { getGasCost } from "../../../functions/common";

const FILE_SIZE_LIMIT = 1024 * 1024 * 5;
const estimatedGasAmount = "550000"; // hardcoded, can optimize later
const tokenStore = useTokenStore();
const walletStore = useWalletStore();
const chooseGasDrop = ref<boolean>(false);
const tokens = ref<Token[]>([]);
const imageColor = ref<string>("");
const getColorStatus = ref<string>("");
const enableDynamic = ref<boolean>(false);
const showPreview = ref<boolean>(false);

const hexlAccountBalances = ref<BalanceMap>({});
const hexlAccountBalance = (token: string): string => {
  return hexlAccountBalances.value[token]?.normalized || "0";
}

const walletAccountBalances = ref<BalanceMap>({});
const walletAccountBalance = (token: string): string => {
  return walletAccountBalances.value[token]?.normalized || "0";
}

function createObjectURL(file: File) {
    return window.URL
      ? window.URL.createObjectURL(file)
      : window.webkitURL.createObjectURL(file);
}

interface RawRedPacketErc721Input extends RedPacketErc721Input {
  splitInput: string;
  file?: File,
}

const nftAirdrop = ref<RawRedPacketErc721Input>({
  id: "",
  name: "",
  symbol: "",
  splitInput: "",
  split: 0,
  tokenURI: "",
  salt: "",
  gasToken: tokenStore.nativeCoin.address,
  gasSponsorship: "0",
  estimatedGas: "0",
  validator: validator(),
  validationRules: [],
  transferrable: true,
  creator: useAccountStore().account?.address || "",
  sponsorGas: true,
  type: "erc721",
  token: "",
  maxSupply: 0,
});

const setAccount = (account: AccountType) => {
  useRedPacketStore().setAccount(account);
}

const gasToken = computed(
  () => tokenStore.token(nftAirdrop.value.gasToken)
);

const tokenBalance = (token: string) => {
  if (useRedPacketStore().account === "hexlink") {
    return hexlAccountBalance(token);
  }
  return walletAccountBalance(token);
};

const totalServiceFee = computed(() => {
  return BigNumber(
    nftAirdrop.value.gasSponsorship
  ).plus(nftAirdrop.value.estimatedGas).div(
    tokenBase(gasToken.value)
  ).dp(8).toString();
})

const genTokenList = async function () {
  hexlAccountBalances.value = await getBalances(
    useAccountStore().account!.address,
    hexlAccountBalances.value,
  );
  if (walletStore.connected) {
    walletAccountBalances.value = await getBalances(
      walletStore.account!.address,
      walletAccountBalances.value,
    );
  }
  if (useRedPacketStore().account === "hexlink") {
    tokens.value = tokenStore.tokens.filter(
      t => Number(hexlAccountBalance(t.address)) > 0
    );
    setDefaultToken(hexlAccountBalance);
  } else {
    tokens.value = tokenStore.tokens.filter(
      t => Number(walletAccountBalance(t.address)) > 0
    );
    setDefaultToken(walletAccountBalance);
  }
}

const setDefaultToken = function (getBalance: (t: string) => string) {
  const nativeCoin = tokenStore.nativeCoin;
  if (Number(getBalance(nativeCoin.address)) > 0 || tokens.value.length == 0) {
    nftAirdrop.value.gasToken = nativeCoin.address;
  } else {
    nftAirdrop.value.gasToken = tokens.value[0].address
  }
}

async function delay(ms: number) {
  return new Promise((resolve, _reject) => {
    window.setTimeout(() => resolve(null), ms);
  });
}

const setGas = async () => {
  const chain = useChainStore().chain;
  const price = await getPriceInfo(chain, nftAirdrop.value.gasToken);
  const cost = getGasCost(chain, "claim_erc721_redpacket");
  const sponsorshipAmount =
    EthBigNumber.from(cost).mul(nftAirdrop.value.splitInput || 0);
  nftAirdrop.value.gasSponsorship = calcGas(
    chain,
    tokenStore.token(nftAirdrop.value.gasToken),
    sponsorshipAmount,
    price,
  ).toString();
  nftAirdrop.value.estimatedGas = calcGas(
    chain,
    tokenStore.token(nftAirdrop.value.gasToken),
    EthBigNumber.from(estimatedGasAmount),
    price,
  ).toString();
}

const refreshGas = async () => {
  await setGas();
  await delay(5000);
  await refreshGas();
};

const chooseGasHandle: OnClickOutsideHandler = (event) => {
  chooseGasDrop.value = false;
}

const tokenChoose =
  async (mode: "token" | "gas", token: Token) => {
    if (mode === "gas") {
      nftAirdrop.value.gasToken = token.address;
      setGas();
    }
  };

onMounted(genTokenList);
onMounted(refreshGas);

watch(() => useChainStore().current, genTokenList);
watch(() => useWalletStore().connected, genTokenList);
watch([
  () => nftAirdrop.value.gasToken,
  () => nftAirdrop.value.splitInput
], setGas);

const showFileSelection = () => {
  document.getElementById("nftUpload")?.click()
}

const removeFile = () => {
  nftAirdrop.value.file = undefined;
  getColorStatus.value = "";
}

const chooseFile = async (e: any) => {
  nftAirdrop.value.file = e.target.files[0];
  if (nftAirdrop.value.file!.size <= FILE_SIZE_LIMIT) {
    nftAirdrop.value.tokenURI = await uploadToIPFS(nftAirdrop.value.file!);
  }
  imageColor.value = (await getColor({
    name: 'Preview Name',
    symbol: 'PV',
    id: '666',
    rawUrl: createObjectURL(e.target.files[0])
  })).color;
}

const validateInput = () => {
  if (nftAirdrop.value.file == undefined) {
    createNotification("Please select a file first", "error");
    return false;
  }
  if (nftAirdrop.value.file.size > FILE_SIZE_LIMIT) {
    createNotification("File too large, maximum 5MB accepted", "error");
    return false;
  }
  if (nftAirdrop.value.name.length === 0) {
    createNotification("Name cannot be empty", "error");
    return false;
  }
  if (nftAirdrop.value.symbol.length === 0) {
    createNotification("Symbol cannot be empty", "error");
    return false;
  }
  if (EhtBigNumber.from(nftAirdrop.value.splitInput).eq(0)) {
    createNotification("Supply cannot be 0", "error");
    return false;
  }
  return true;
}

const confirmNFT = async () => {
  if (validateInput()) {
    nftAirdrop.value.salt = hash(new Date().toISOString());
    nftAirdrop.value.split = Number(nftAirdrop.value.splitInput);
    nftAirdrop.value.creator = useAccountStore().account!.address;
    nftAirdrop.value.id = redpacketErc721Id(
      useChainStore().chain,
      nftAirdrop.value
    );
    if (!nftAirdrop.value.tokenURI) {
      nftAirdrop.value.tokenURI = await uploadToIPFS(
        nftAirdrop.value.file!
      );
      createNotification("Waiting to upload your NFT picture", "error");
    }
    if (enableDynamic.value) {
      nftAirdrop.value.validationRules.push({type: "dynamic_secrets"});
    }
    nftAirdrop.value.token = await predictErc721Address(
      useChainStore().provider, nftAirdrop.value
    );
    nftAirdrop.value.maxSupply = nftAirdrop.value.split;
    useRedPacketStore().beforeCreate(nftAirdrop.value);
  }
}

const getColor = async (nft: nftImage) => {
  getColorStatus.value = "";
  const result = await getBackcgroundColor(nft);
  getColorStatus.value = "Done";
  return result;
}
</script>

<style lang="less" scoped>
.estimated-fee {
  @media (max-width: 640px) {
    display: none; } }
.ant-switch-handle {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 20px;
  height: 20px;
  transition: all 0.2s ease-in-out; }
.ant-switch {
  min-width: 40px; }
.enable-switch {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  p {
    margin-bottom: 0rem; } }
.nft-preview {
  border: 2px dashed rgba(22, 22, 26, 0.1);
  border-radius: 16px;
  padding: 16px; }
.changePicButton {
  background: rgb(255, 255, 255);
  height: 40px;
  width: 40px;
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(22, 22, 26, 0.1);
  border-radius: 12px;
  transition: all 0.15s ease-in-out 0s;
  transform-origin: center center; }
.nft-pic {
  width: 300px;
  height: 300px;
  border: 2px dashed rgba(22, 22, 26, 0.1);
  border-radius: 16px;
  padding: 16px; }
.nft-pic img {
  height: 100%;
  width: 100%;
  border-radius: 16px; }
.choose-account {
  display: flex;
  flex-direction: column;
  margin: 16px;
  justify-content: center;
  align-items: center;
  svg {
    display: inline-flex;
    transition-property: background-color, border-color, color, fill, stroke;
    justify-content: center;
    align-items: center;
    width: 1rem;
    height: 1rem;
    margin-left: 0.75rem; } }
.mode-options {
  display: flex;
  align-items: center;
  position: absolute;
  top: 50px;
  width: auto;
  background: #fff;
  box-shadow: 0px 10px 20px rgb(0 0 0 / 10%);
  border-radius: 10px;
  overflow: hidden;
  display: none; }
.tooltip {
  position: relative; }
.tooltip:before,
.tooltip:after {
  display: block;
  opacity: 0;
  pointer-events: none;
  position: absolute; }
.tooltip:after {
  border-right: 6px solid transparent;
  border-bottom: 6px solid rgba(0, 0, 0, .75);
  border-left: 6px solid transparent;
  content: '';
  height: 0;
  top: 20px;
  left: 20px;
  width: 0; }
.tooltip:before {
  background: rgba(0, 0, 0, .75);
  border-radius: 15px;
  color: #fff;
  content: attr(data-title);
  font-size: 12px;
  padding: 6px 10px;
  top: 26px;
  right: -15px;
  white-space: nowrap; }
.tooltip.fade:after,
.tooltip.fade:before {
  transform: translate3d(0,-10px,0);
  transition: all .15s ease-in-out; }
.tooltip.fade:hover:after,
.tooltip.fade:hover:before {
  opacity: 1;
  transform: translate3d(0,3px,0); }
.mode-option {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer; }
.mode-option:hover {
  background: rgb(242, 246, 250);
  color: #999; }
.mode-input {
  bottom: 0px;
  left: 0px;
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 100%;
  box-sizing: border-box; }
.mode-text2 {
  padding-right: 32px;
  padding: 11px 0px 11px 0px;
  height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  border-radius: 15px;
  cursor: pointer;
  border: 0px;
  box-sizing: content-box;
  background: none;
  -webkit-tap-highlight-color: transparent;
  display: block;
  font-size: 14px;
  line-height: 18px;
  font-weight: 700;
  color: #07101b;
  -webkit-user-select: none;
  -moz-user-select: none;
  margin-right: 1.5rem; }
.mode-dropdown {
  flex: 1 1 0%;
  font-weight: 400;
  line-height: 1.4375em;
  color: rgb(7, 16, 27);
  box-sizing: border-box;
  position: relative;
  cursor: text;
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  justify-content: flex-end;
  width: auto;
  border-radius: 8px;
  background-color: rgb(242, 246, 250);
  font-size: 14px;
  overflow: unset !important; }
.mode-dropdown::before {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border: 2px solid #333;
  border-top: 2px solid rgb(242, 246, 250);
  border-right: 2px solid rgb(242, 246, 250);
  transform: rotate(-45deg);
  right: 10px;
  top: 14px;
  z-index: 0;
  transition: 0.5s;
  pointer-events: none; }
.mode-dropdown.active::before {
  top: 19px;
  transform: rotate(-225deg); }
.mode-dropdown.active .mode-options {
  display: block;
  z-index: 60; }
.token-select {
  position: relative;
  appearance: none;
  max-width: 100%;
  font-family: -apple-system, system-ui, sans-serif;
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  height: 24px;
  border-radius: 16px;
  white-space: nowrap;
  transition: background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  outline: 0px;
  text-decoration: none;
  vertical-align: middle;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  margin-bottom: 0.2rem;
.token-name {
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 8px;
  padding-right: 8px;
  white-space: nowrap;
  cursor: pointer;
  font-size: 14px;
  line-height: 18px;
  font-weight: 700;
  color: rgb(7, 16, 27);
  user-select: none;
  -webkit-tap-highlight-color: transparent; }
.token-dropdown {
  -webkit-tap-highlight-color: transparent;
  font-size: 16px;
  cursor: pointer;
  margin: 0px 4px 0px -4px;
  color: rgb(118, 127, 141) !important;
  display: inline-block;
  background-repeat: no-repeat;
  background-position: center center;
  flex-shrink: 0;
  aspect-ratio: 1 / 1;
  height: 24px;
  width: 24px;
  line-height: 18px;
  font-weight: 700;
  user-select: none; } }
.total-choose-token {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4375em;
  color: rgb(7, 16, 27);
  cursor: text; }
.gas-station {
  display: flex;
  flex-direction: column;
  margin: 0px;
  padding: 20px 10px; }
.gas-estimation {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  p {
    margin-bottom: 0rem;
    margin-right: 1rem;
    font-weight: 500; } }
.text-input {
  overflow: hidden;
  padding: 0px;
  opacity: 1;
  color: rgba(22, 22, 26, 0.8);
  outline: none;
  -webkit-appearance: none;
  background: transparent;
  border: #909697 solid 0; }
.input-box {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 0px 8px;
  align-items: stretch; }
.input-box-wrap {
  display: flex;
  justify-content: center;
  background: #f2f6fa;
  border: 1px solid transparent;
  transition: all 0.15s ease-in-out 0s;
  overflow: hidden;
  min-height: 48px;
  padding: 8px 14px;
  border-radius: 16px;
  font-size: 14px;
  align-items: center;
  padding: 0 0.87rem;
  margin-top: 8px; }
.collection-details {
  align-items: flex-start;
  flex-direction: column;
  max-width: 100%;
  min-height: 0px;
  min-width: 0px;
  flex-shrink: 0;
  flex-basis: auto;
  display: flex;
  margin-top: 16px; }
.button-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 100%; }
.file-upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border: 1px solid transparent;
  font-size: 0.875rem;
  border-radius: 50px;
  padding: 6px 16px;
  font-weight: 900;
  transition: all 0.15s ease-in-out 0s;
  transform-origin: center center;
  user-select: none;
  border-color: transparent;
  color: white;
  background: #076ae0;
  appearance: button; }
.file-upload-button:hover {
  background-color: rgba(7, 106, 224, 0.9); }
.input-title {
  margin-bottom: 16px;
  color: rgba(22, 22, 26, 0.6);
  font-size: 14px;
  line-height: 20px;
  text-align: center; }
.input-content {
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center; }
.upload-input {
  display: none;
  position: fixed;
  left: -100vw;
  overflow: visible; }
.upload-box-wrap {
  border: 2px dashed rgba(22, 22, 26, 0.1);
  min-height: 150px;
  padding: 32px 60px;
  position: relative;
  border-radius: 16px;
  -webkit-box-align: center;
  display: flex;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  flex-direction: column; }
.upload-box {
  margin-top: 8px;
  padding: 0 0.87rem;
  width: 100%; }
.title {
  margin-left: 0.875rem;
  font-size: 14px;
  line-height: 20px;
  font-weight: 700; }
.collection-file {
  align-items: flex-start;
  flex-direction: column;
  max-width: 100%;
  min-height: 0px;
  min-width: 0px;
  flex-shrink: 0;
  flex-basis: auto;
  display: flex;
  margin-top: 25px; }
.connect-wallet-button {
  display: flex;
  justify-content: center;
  padding: 10px;
  line-height: 1.25rem;
  border-radius: 50px;
  opacity: 1;
  background-color: rgb(7, 106, 224);
  margin-top: 30px;
  margin-bottom: 20px;
  color: white; }
.connect-wallet-button:hover {
  background-color: rgba(7, 106, 224,0.9); }
.create {
  display: flex;
  justify-content: center;
  flex-direction: row-reverse; }
input:focus {
  outline: none;
  box-shadow: none; }
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0; }
</style>