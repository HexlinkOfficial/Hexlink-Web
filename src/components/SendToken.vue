<template>
  <div v-if="claimStatus == ''" class="claim-card transition">
    <router-link to="/">
      <svg class="redpacket_close transition" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4.3949 4.39481C6.84957 1.94033 10.0794 0.412944 13.534 0.0729118C16.9886 -0.267121 20.4542 0.601242 23.3403 2.53003C26.2264 4.45882 28.3544 7.32869 29.3617 10.6506C30.3691 13.9725 30.1933 17.541 28.8645 20.7479C27.5357 23.9547 25.136 26.6016 22.0743 28.2375C19.0127 29.8734 15.4785 30.3971 12.074 29.7193C8.66957 29.0415 5.60545 27.2041 3.40381 24.5204C1.20218 21.8366 -0.000751884 18.4724 6.47942e-06 15.0011C-0.001827 13.0309 0.38547 11.0798 1.13966 9.25966C1.89386 7.43954 3.0001 5.78629 4.3949 4.39481ZM18.8931 9.52218L20.4875 11.119C20.6687 11.3019 20.7703 11.5489 20.7703 11.8063C20.7703 12.0637 20.6687 12.3107 20.4875 12.4936L17.9702 15.0011L20.4875 17.5184C20.6687 17.7013 20.7703 17.9483 20.7703 18.2057C20.7703 18.4632 20.6687 18.7102 20.4875 18.8931L18.8931 20.4874C18.7103 20.6686 18.4633 20.7702 18.2058 20.7702C17.9484 20.7702 17.7014 20.6686 17.5185 20.4874L15.0012 17.9701L12.4839 20.4874C12.3011 20.6686 12.054 20.7702 11.7966 20.7702C11.5392 20.7702 11.2922 20.6686 11.1093 20.4874L9.52227 18.8931C9.34111 18.7102 9.23948 18.4632 9.23948 18.2057C9.23948 17.9483 9.34111 17.7013 9.52227 17.5184L12.0322 15.0011L9.52227 12.4838C9.34111 12.301 9.23948 12.054 9.23948 11.7965C9.23948 11.5391 9.34111 11.2921 9.52227 11.1092L11.1093 9.52218C11.2922 9.34102 11.5392 9.23939 11.7966 9.23939C12.054 9.23939 12.3011 9.34102 12.4839 9.52218L15.0012 12.0321L17.5185 9.52218C17.7014 9.34102 17.9484 9.23939 18.2058 9.23939C18.4633 9.23939 18.7103 9.34102 18.8931 9.52218ZM15.0012 2.57337C12.1254 2.57351 9.33867 3.57077 7.11573 5.39526C4.8928 7.21974 3.37125 9.75854 2.81034 12.5791C2.24942 15.3997 2.68384 18.3274 4.03959 20.8636C5.39533 23.3998 7.58851 25.3874 10.2454 26.4878C12.9024 27.5882 15.8586 27.7333 18.6106 26.8984C21.3625 26.0635 23.7398 24.3002 25.3374 21.9091C26.935 19.5179 27.6541 16.6467 27.3721 13.7848C27.0901 10.9228 25.8246 8.24723 23.791 6.2138C22.6373 5.05871 21.2671 4.14257 19.7588 3.51788C18.2505 2.8932 16.6338 2.57223 15.0012 2.57337Z"
          fill="#076AE0" />
      </svg>
    </router-link>
    <!-- <div style="margin: 16px; margin-top: 5rem;">
      <div class="send-token">
        <p v-if="hasBalanceWarning" class="balance-warning-mobile"><i class="icofont-warning-alt"
            style="margin-right: 0.25rem;"></i>Insufficient balance</p>
        <div class="total-amount">
          <div class="box">
            <p class="total-amount-text">Total Amount</p>
            <div style="display: flex; width: 100%;">
              <input v-model="transaction.balanceInput" :style="hasBalanceWarning ? 'color: #FE646F;' : ''"
                id="red-packet-amount" class="amount-input" autocomplete="off" placeholder="0.0" required="true" type="number"
                autocorrect="off" title="Token Amount" inputmode="decimal" min="0" minlength="1" maxlength="79"
                pattern="^[0-9]*[.,]?[0-9]*$" spellcheck="false">
            </div>
            <div class="input-info-show">
              <p class="token-available-balance">
                Available Balance:
                <span class="balance-amount">{{ redPacketTokenBalance.substring(0,6) }}</span>
              </p>
              <div class="total-choose-token">
                <div class="token-select">
                  <div class="max-amount-button">
                    <span class="button-text" @click="transaction.balanceInput = redPacketTokenBalance">MAX</span>
                    <span class="button-outline"></span>
                  </div>
                </div>
                <div class="token-select">
                  <div class="mode-dropdown" :class="chooseTotalDrop && 'active'"
                    @click.stop="chooseTotalDrop = !chooseTotalDrop;" v-on-click-outside.bubble="chooseTotalHandle">
                    <div class="token-icon">
                      <img :src="token.logoURI" />
                    </div>
                    <div class="mode-text2">{{ token.symbol }}</div>
                    <input class="mode-input" type="text" placeholder="select" readonly>
                    <div class="mode-options">
                      <div class="mode-option" v-for="(token, index) of tokens" :key="index"
                        @click="tokenChoose('token', token)">
                        <div class="token-icon">
                          <img :src="token.logoURI" />
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: flex-start;">
                          <b>{{ token.symbol }}</b>
                          <div style="margin-right:0.5rem;">balance {{ tokenBalance(token.address) }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="gas-station">
        <div class="gas-estimation">
          <p>
            <img style="width: 20px; height: 20px;" src="https://i.postimg.cc/RhXfgJR1/gas-pump.png" />
            Estimated Service Fee:
            <a-tooltip placement="top">
              <template #title>
                <span>The real service fee may differ per network conditions</span>
              </template>
              <b>{{ totalServiceFee.substring(0,6) }}</b>
            </a-tooltip>
          </p>
          <div class="total-choose-token">
            <div class="token-select">
              <div class="mode-dropdown" :class="chooseGasDrop && 'active'" @click.stop="chooseGasDrop = !chooseGasDrop;"
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
        </div>
      </div>
    </div> -->
    <form
      style="background-color: white; position: static; border-radius: 15px; overflow: visible; width: 100%; height: 100%; display: flex; flex-direction: column; padding: 1rem 0 1rem 0; justify-content: space-between;"
      @submit.prevent="onSubmit"
    >
      <div v-if="show" style="display: block; background-color: white; padding: 25px 0px calc(5%);">
        <div style="margin: 0px auto; display: block;">
          <h2
            style="color: #0c0c0d; font-size: 1.75rem; line-height: 2.25rem; font-weight: 500; margin-top: 0px; margin-left: 20px;">
            Send Money</h2>
          <div style="margin-top: 30px;">
            <div style="position: relative;">
              <div
                style="font-size: 1.125rem; line-height: 1.5rem; font-weight: normal; color: black; padding: 0 15px; position: relative; text-align: left;">
                <span
                  style="top: 13.5px; color: #515354; left: 30px; pointer-events: none; z-index: 1; right: auto; text-decoration: none; position: absolute; line-height: 1; display: inline-block;">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="1em" height="1em">
                    <path
                      d="M20.21 17.544l-2.785-2.785a7.752 7.752 0 0 0 1.114-3.986C18.54 6.49 15.05 3 10.77 3S3 6.49 3 10.773c0 4.282 3.489 7.772 7.77 7.772a7.686 7.686 0 0 0 3.985-1.114l2.784 2.785a1.66 1.66 0 0 0 2.34 0l.33-.33a1.645 1.645 0 0 0 0-2.342zM4.723 10.773c0-3.334 2.714-6.05 6.047-6.05 3.332 0 6.047 2.716 6.047 6.05 0 3.333-2.715 6.049-6.047 6.049-3.333 0-6.047-2.716-6.047-6.05z">
                    </path>
                  </svg>
                </span>
                <input
                  class="send-people"
                  type="text"
                  v-model="transaction.to"
                  placeholder="email or wallet address"
                  aria-expanded="false" autocomplete="off" autocorrect="off"
                  oninvalid="try{setCustomValidity(verifySendTo() ? '' : 'your custom message')}" 
                  required
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!show">
        <div style="text-align: center; background: white; padding: 35px 20px 5px;">
          <div
            style="display: flex; text-align: left; -webkit-box-align: center; align-items: center; -webkit-box-pack: center; justify-content: center;">
            <div class="profile-wrapper"
              style="margin-right: 1rem; line-height: 4rem; position: relative; display: flex; justify-content: center; align-items: center;">
              <img style="border-radius: 50px; max-width: 40px;"
                :src="profilePic[Math.floor(Math.random() * profilePic.length)]" :size="64" referrerpolicy="no-referrer"
                rel="preload" />
            </div>
            <div class="name"
              style="display: flex; position: relative; word-break: break-word; -webkit-box-orient: vertical; -webkit-box-direction: normal; flex-direction: column;">
              <div style="color: #0c0c0d; font-size: 1.1rem; font-weight: 500;">
                <span v-if="!isInputAddress">{{ transaction.to }}</span>
                <span v-if="isInputAddress">{{ transaction.to.toString().substring(0,21).toLowerCase() }}<br>{{ transaction.to.toString().substring(21,).toLowerCase() }}</span>
              </div>
            </div>
          </div>
        </div>
        <div style="display: block;">
          <div class="input-wrapper" style="display: flex; justify-content: center;">
            <input 
              class="send-amount"
              v-model="transaction.balanceInput" :style="hasBalanceWarning ? 'color: #FE646F;' : ''" id="red-packet-amount"
              autocomplete="off" placeholder="0.00" type="number" autocorrect="off" title="Token Amount"
              inputmode="decimal" min="0" minlength="1" step="any" maxlength="79" pattern="^[0-9]*[.,]?[0-9]*$" spellcheck="false" required
            >
          </div>
          <div style="display: flex; align-items: center; justify-content: center; margin-top: 10px;">
            <div class="token-select">
              <div class="mode-dropdown" :class="chooseTotalDrop && 'active'" @click.stop="chooseTotalDrop = !chooseTotalDrop;"
                v-on-click-outside.bubble="chooseTotalHandle">
                <div class="token-icon">
                  <img :src="token.logoURI" />
                </div>
                <div class="mode-text2">{{ token.symbol }}</div>
                <input class="mode-input" type="text" placeholder="select" readonly>
                <div class="mode-options" style="right: -48px;">
                  <div class="mode-option" v-for="(token, index) of tokens" :key="index" @click="tokenChoose('token', token)">
                    <div class="token-icon">
                      <img :src="token.logoURI" />
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: flex-start;">
                      <b>{{ token.symbol }}</b>
                      <div style="margin-right:0.5rem;">balance {{ tokenBalance(token.address) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style="display: flex; margin: 0px; justify-content: center; margin-top: 20px;">
            <div class="gas-estimation" style="padding: 0 0.5rem 0 0.5rem;">
              <p>
                <img style="width: 20px; height: 20px;" src="https://i.postimg.cc/RhXfgJR1/gas-pump.png" />
                Estimated Fee:
                <a-tooltip placement="top">
                  <template #title>
                    <span>The real service fee may differ per network conditions</span>
                  </template>
                  <b>{{ totalServiceFee.substring(0,6) }}</b>
                </a-tooltip>
              </p>
              <div class="total-choose-token">
                <div class="token-select">
                  <div class="mode-dropdown" :class="chooseGasDrop && 'active'" @click.stop="chooseGasDrop = !chooseGasDrop;"
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
            </div>
          </div>
          <!-- <div style="display: flex; margin: 0px; justify-content: center; margin-top: 20px;">
                  <p style="background-color: #f2f6fa; padding: 10px 20px; border-radius: 15px; margin-bottom: 0rem;">
                    <span>Total Send:</span>
                    <span style="margin-left: 0.5rem;">
                      <div>
                        <b>{{ totalServiceFee.substring(0,6) }}</b>
                        <div class="token-icon">
                          <img :src="token.logoURI" />
                        </div>
                      </div>
                      <div>
                        <b>{{ totalServiceFee.substring(0,6) }}</b>
                        <div class="token-icon">
                          <img :src="token.logoURI" />
                        </div>
                      </div>
                    </span>
                  </p>
                </div> -->
        </div>
      </div>
      <div style="display: flex; justify-content: center;">
        <button @click="() => {
          if (verifySendTo()) show = !show;
        }"
          style="background-color: rgb(7, 106, 224); color: white; padding: 10px; margin-top: 10px; margin-bottom: 30px; width: 80%; border-radius: 50px; border: none;">Continue</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { getRedPacket } from '@/graphql/redpacket';
import { useRoute } from "vue-router";
import { callClaimRedPacket } from "@/web3/redpacket";
import { loadAndSetErc20Token } from '@/web3/tokens';
import type { BalanceMap } from "@/web3/tokens";
import { switchNetwork } from "@/web3/network";
import { tokenBase } from "@/web3/utils";
import { getChain } from "../../functions/common";
import type { Token } from "../../functions/common";
import type { RedPacketDB } from "@/types";
import { useTokenStore } from "@/stores/token";
import { useRedPacketStore } from '@/stores/redpacket';
import { useAccountStore } from '@/stores/account';
import { useWalletStore } from '@/stores/wallet';
import { useChainStore } from "@/stores/chain";
import { hash } from "../../functions/common";
import type { OnClickOutsideHandler } from '@vueuse/core';
import { onClickOutside } from '@vueuse/core'
import { vOnClickOutside } from '@/services/directive';
import { getBalances } from "@/web3/tokens";
import { getPriceInfo } from "@/web3/network";
import { BigNumber as EthBigNumber } from "ethers";
import { calcGas } from "../../functions/common";
import { BigNumber } from "bignumber.js";
import { profilePic } from "@/assets/imageAssets";
import { ethers } from "ethers";

const estimatedGasAmount = "250000"; // hardcoded, can optimize later
const chooseTotalDrop = ref<boolean>(false);
const chooseGasDrop = ref<boolean>(false);
const redPacket = ref<RedPacketDB | undefined>();
const redPacketTokenIcon = ref<string>("");
const redPacketToken = ref<string>("");
const claimStatus = ref<string>("");
const hasBalanceWarning = ref<boolean>(false);
const tokenStore = useTokenStore();
const redPacketStore = useRedPacketStore();
const hexlAccountBalances = ref<BalanceMap>({});
const walletAccountBalances = ref<BalanceMap>({});
const tokens = ref<Token[]>([]);
const walletStore = useWalletStore();
const show = ref<boolean>(true)
const isInputAddress = ref<boolean>(false);

interface tokenTransaction {
  to: string[],
  salt: string,
  balance: string,
  balanceInput: string,
  token: string,
  gasToken: string,
  estimatedGas: string,
  priceInfo?: {
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    lastBaseFeePerGas: string;
    nativeCurrencyInUsd: string;
    defaultGasPrice: string;
  } | undefined;
}

const transaction = ref<tokenTransaction>({
  to: [],
  salt: hash(new Date().toISOString()),
  balance: "0",
  balanceInput: "0.0001",
  token: tokenStore.nativeCoin.address,
  gasToken: tokenStore.nativeCoin.address,
  estimatedGas: "0",
})

onMounted(async () => {
  redPacket.value = await getRedPacket(useRoute().query.claim!.toString());
  if (redPacket.value) {
    const network = getChain(redPacket.value.chain!);
    await switchNetwork(network);
    const metadata = await loadAndSetErc20Token(
      redPacket.value!.metadata.token
    );
    redPacketToken.value = metadata.symbol;
    redPacketTokenIcon.value = metadata.logoURI || "";
  } else {
    claimStatus.value = "error";
  }
});

const token = computed(() => tokenStore.token(transaction.value.token));
const gasToken = computed(() => tokenStore.token(transaction.value.gasToken));

const hexlAccountBalance = (token: string): string => {
  return hexlAccountBalances.value[token]?.normalized || "0";
}

const walletAccountBalance = (token: string): string => {
  return walletAccountBalances.value[token]?.normalized || "0";
}

const tokenBalance = (token: string) => {
  if (redPacketStore.account == "hexlink") {
    return hexlAccountBalance(token);
  }
  return walletAccountBalance(token);
};

const redPacketTokenBalance = computed(
  () => tokenBalance(transaction.value.token)
);

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
  if (redPacketStore.account == "hexlink") {
    tokens.value = tokenStore.tokens.filter(
      t => Number(hexlAccountBalance(t.address)) > 0
    );
    setDefaultToken(walletAccountBalance);
  } else {
    tokens.value = tokenStore.tokens.filter(
      t => Number(walletAccountBalance(t.address)) > 0
    );
    setDefaultToken(hexlAccountBalance);
  }
}

const setDefaultToken = function (getBalance: (t: string) => string) {
  const nativeCoin = tokenStore.nativeCoin;
  if (Number(getBalance(nativeCoin.address)) > 0 || tokens.value.length == 0) {
    transaction.value.token = nativeCoin.address;
    transaction.value.gasToken = nativeCoin.address;
  } else {
    transaction.value.token = tokens.value[0].address;
    transaction.value.gasToken = tokens.value[0].address
  }
}

async function delay(ms: number) {
  return new Promise((resolve, _reject) => {
    window.setTimeout(() => resolve(null), ms);
  });
}

const refreshGas = async () => {
  const chain = useChainStore().chain;
  const priceInfo = await getPriceInfo(chain);
  transaction.value.priceInfo = priceInfo;
  transaction.value.estimatedGas = calcGas(
    chain,
    tokenStore.token(transaction.value.gasToken),
    EthBigNumber.from(estimatedGasAmount),
    priceInfo,
    false, // prepay
  ).toString();
  await delay(5000);
  await refreshGas();
};

const totalServiceFee = computed(() => {
  return BigNumber(
    transaction.value.estimatedGas
  ).div(
    tokenBase(gasToken.value)
  ).dp(4).toString();
});

const chooseTotalHandle: OnClickOutsideHandler = (event) => {
  chooseTotalDrop.value = false;
}

const chooseGasHandle: OnClickOutsideHandler = (event) => {
  chooseGasDrop.value = false;
}

const tokenChoose =
  async (mode: "token" | "gas", token: Token) => {
    if (mode === "token") {
      transaction.value.token = token.address;
    } else {
      transaction.value.gasToken = token.address;
      refreshGas();
    }
  };

onMounted(genTokenList);
onMounted(refreshGas);
watch(() => useChainStore().current, genTokenList);
watch(() => useWalletStore().connected, genTokenList);
watch([
  () => transaction.value.gasToken
], refreshGas);
watch(
  [() => transaction.value.balanceInput, redPacketTokenBalance],
  ([newBalanceInput, newTokenBalance], _old) => {
    if (Number(newBalanceInput) > Number(newTokenBalance)) {
      hasBalanceWarning.value = true;
    } else {
      hasBalanceWarning.value = false;
    }
  }
);

const verifySendTo = () => {
  isInputAddress.value = false;
  if (transaction.value.to.length > 0) {
    if (validateEmail(transaction.value.to.toString()) || ethers.utils.isAddress(transaction.value.to.toString())) {
      if (ethers.utils.isAddress(transaction.value.to.toString())) isInputAddress.value = true;
      return true;
    } else {
      console.log("Invalid input. Please input an email.")
      return false;
    }
  } else {
    console.log("Empty input.")
    return false;
  }
};

const onSubmit = (e: Event) => {
  console.log(e);
}

const formatEmail = (email: string) => {
  return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

const validateEmail = (input: string) => {
  if (formatEmail(input)) {
    return true;
  } else {
    return false;
  }
};
</script>

<style lang="less" scoped>
.send-people {
  border-color: #909191;
  box-shadow: none;
  border-radius: 4rem;
  padding-left: 3.6875rem;
  padding-right: 3.6875rem;
  padding: 10px 1rem 10px 2.5rem;
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-weight: normal;
  text-overflow: ellipsis;
  display: block;
  box-sizing: border-box;
  width: 100%;
  border: #909697 solid 0.0625rem;
  background-color: #ffffff;
  margin: 0;
  outline: none;
  position: relative;
  -webkit-appearance: none;
}
.send-amount {
  width: auto;
  font-size: 40px;
  font-weight: 700;
  border: 0px;
  box-sizing: content-box;
  background: none;
  -webkit-tap-highlight-color: transparent;
  display: block;
  min-width: 0px;
  text-align: center;
  ::-webkit-input-placeholder {
    text-align: center; }
  input[type=number] {
  -moz-appearance: textfield; }
}
:-moz-placeholder {
  text-align: center; }
input:focus {
  outline: none;
  box-shadow: none; }
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0; }
.gas-estimation {
  display: flex;
  p {
    margin-bottom: 0rem;
    margin-right: 1rem;
    font-weight: 500; } }
.gas-station {
  display: flex;
  margin: 0px;
  justify-content: flex-end; }
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
.max-amount-button {
  position: relative;
  margin: 0px;
  appearance: none;
  max-width: 100%;
  background-color: rgba(28, 104, 243, 0.1);
  color: rgb(28, 104, 243);
  border-radius: 4px;
  font-size: 14px;
  line-height: 18px;
  padding: 3px 12px;
  cursor: pointer;
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  height: 24px;
  white-space: nowrap;
  transition: background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  outline: 0px;
  text-decoration: none;
  border: 0px;
  vertical-align: middle;
  box-sizing: border-box;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  .button-text {
    padding: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: rgb(28, 104, 243);
    font-size: 14px;
    line-height: 18px;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    font-weight: 400; }
  .button-outline {
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    z-index: 0;
    inset: 0px;
    color: rgb(28, 104, 243);
    font-size: 14px;
    line-height: 18px;
    cursor: pointer;
    white-space: nowrap;
    user-select: none;
    -webkit-tap-highlight-color: transparent; } }
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
.balance-amount {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: rgb(7, 16, 27);
  line-height: 20px;
  font-weight: 700;
  margin-left: 4px;
  margin-left: 0.5rem;
  margin-right: 0.5rem; }
.token-available-balance {
  display: flex;
  justify-content: flex-end;
  width: 175px;
  font-size: 13px;
  line-height: 18px;
  color: rgb(118, 127, 141);
  white-space: nowrap;
  font-weight: 400;
  margin: 0px;
  display: flex;
  align-items: center; }
.input-info-show {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: flex-end;
  row-gap: 4px;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4375em;
  color: rgb(7, 16, 27);
  cursor: text; }
.balance-warning-mobile {
  display: flex;
  align-items: center;
  font-weight: 700;
  padding-top: 11px;
  height: 18px;
  margin-bottom: -0.5rem;
  color: #FE646F;
  width: auto; }
.amount-input {
  flex: 2 1 0%;
  font-size: 18px;
  font-weight: 700;
  padding-top: 22px !important;
  padding-bottom: 0px !important;
  padding-left: 0px !important;
  padding: 11px 12px;
  height: 18px;
  border: 0px;
  box-sizing: content-box;
  background: none;
  margin: 0px;
  -webkit-tap-highlight-color: transparent;
  display: block;
  min-width: 0px;
  width: 100%; }
.total-amount-text {
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  color: rgb(118, 127, 141);
  white-space: nowrap;
  margin-bottom: 0rem;
  position: absolute;
  top: 10px;
  left: 12px; }
.box {
  position: relative;
  padding: 10px 12px;
  padding-right: 12px;
  padding-left: 12px;
  font-weight: 400;
  line-height: 1.4375em;
  color: rgb(7, 16, 27);
  box-sizing: border-box;
  cursor: text;
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  border-radius: 8px;
  background-color: rgb(242, 246, 250);
  font-size: 14px;
  overflow: unset !important; }
.total-amount {
  display: flex;
  gap: 16px;
  margin: 16px;
  margin-left: 0rem;
  margin-right: 0rem; }
.send-token {
  visibility: visible;
  height: auto;
  display: block;
  padding: 0px; }
.claim-card {
  background-color: #fff;
  height: 400px;
  width: 90vw;
  max-width: 400px;
  position: fixed;
  margin: auto;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 10px 20px rgb(0 0 0 / 10%);
  border-radius: 15px;
  overflow: visible;
  z-index: 55;
  @media (max-width: 990px) {
    top: 50vh;
    left: 50%; } }
// .claim-card:hover {
//   box-shadow: 0px 30px 30px rgba(0, 0, 0, 0.2);
//   height: 430px;
//   width: 330px;
//   color: white; }
.transition {
  transition: .3s cubic-bezier(.3, 0, 0, 1.3) }
.redpacket_close {
  position: absolute;
  z-index: 50;
  margin: 0.5rem 0;
  right: 0.5rem; }
</style>