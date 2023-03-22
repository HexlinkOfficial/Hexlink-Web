<template>
  <div class="claim-card transition">
    <router-link to="/">
      <img class="redpacket_close transition" src="@/assets/svg/closeButton.svg" alt="close button" />
    </router-link>
    <form v-if="sendStatus === '' && !showStep2" class="form-send" @submit.prevent>
      <div style="display: block;">
        <h2 class="people-title">Send Token</h2>
        <div style="margin-top: 15px; position: relative;">
          <div class="people-input-box">
            <span class="input-search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="1em" height="1em">
                <path
                  d="M20.21 17.544l-2.785-2.785a7.752 7.752 0 0 0 1.114-3.986C18.54 6.49 15.05 3 10.77 3S3 6.49 3 10.773c0 4.282 3.489 7.772 7.77 7.772a7.686 7.686 0 0 0 3.985-1.114l2.784 2.785a1.66 1.66 0 0 0 2.34 0l.33-.33a1.645 1.645 0 0 0 0-2.342zM4.723 10.773c0-3.334 2.714-6.05 6.047-6.05 3.332 0 6.047 2.716 6.047 6.05 0 3.333-2.715 6.049-6.047 6.049-3.333 0-6.047-2.716-6.047-6.05z">
                </path>
              </svg>
            </span>
            <input v-model="transaction.to" class="send-people" type="text" placeholder="email or wallet address" aria-expanded="false" autocomplete="off" autocorrect="off">
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: center; width: 100%; padding: 0 15px;">
        <button class="cta-button" @click="goToStep2">Continue</button>
      </div>
    </form>
    <form v-if="showStep2 && sendStatus == ''" class="form-send" @submit.prevent="onSubmit">
      <div style="text-align: center; background: white; padding: 35px 20px 5px;">
        <div class="profile-info">
          <div class="profile-wrapper">
              <i v-if="!isInputAddress" class="fa-solid fa-circle-check fa-2x"></i>
              <i v-if="isInputAddress" class="fa-solid fa-circle-check fa-2x"></i>
          </div>
          <div class="name" style="">
            <div class="confirmAddress">
              <span v-if="!isInputAddress">{{ transaction.to }}</span>
              <span v-if="isInputAddress">{{ transaction.to.toString().substring(0,21).toLowerCase() }}<br>{{
              transaction.to.toString().substring(21,).toLowerCase() }}</span>
            </div>
          </div>
          <div @click="goToStep1" class="gotoStep1">
            <img src="@/assets/svg/corssBlack.svg" style="width: 1.5rem; height: 1.5rem;"/> 
          </div>
        </div>
      </div>
      <div v-if="verifySendTo()" style="display: block;">
        <div class="input-wrapper">
          <input class="send-amount" type="number" v-model="transaction.amountInput"
            :style="hasBalanceWarning ? 'color: #FE646F;' : ''" autocomplete="off" placeholder="0.00" autocorrect="off"
            title="Token Amount" inputmode="decimal" min="0" minlength="1" step="any" maxlength="79"
            pattern="^[0-9]*[.,]?[0-9]*$" spellcheck="false" required>
        </div>
        <p v-if="hasBalanceWarning" class="balance-warning-mobile">
          <i style="margin-right: 0.25rem;"></i>Insufficient balance
        </p>
        <div class="token-selection-section">
          <div class="token-select">
            <div class="mode-dropdown" :class="chooseTotalDrop && 'active'"
              @click.stop="chooseTotalDrop = !chooseTotalDrop;" v-on-click-outside.bubble="chooseTotalHandle">
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
                  <div class="token-box">
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
                <b>{{ totalServiceFee}}</b>
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
                    <div class="mode-option" v-for="(token, index) of tokens" :key="index"
                      @click="tokenChoose('gas', token)">
                      <div class="token-icon">
                        <img :src="token.logoURI" />
                      </div>
                      <div class="token-box">
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
      </div>
      <div style="display: flex; justify-content: center; width: 100%; padding: 0 15px;">
        <button :disabled="hasBalanceWarning" class="cta-button">Send</button>
      </div>
    </form>
    <div v-if="sendStatus != ''" class="form-send">
      <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
        <h2 class="transition" style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
          <div class="spinner-lg" :class="sendStatus">
            <div class="check"></div>
          </div>
          <span style="font-size: 20px; margin: 20px 10px; text-align: center;">{{ message }}</span>
        </h2>
      </div>
      <div style="display: flex; justify-content: center; width: 100%; padding: 0 15px;">
        <button @click="closeModal" class="cta-button">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import type { BalanceMap } from "@/web3/tokens";
import { tokenBase } from "@/web3/utils";
import type { Token } from "../../../functions/common";
import { useTokenStore } from "@/stores/token";
import { useAccountStore } from '@/stores/account';
import { useChainStore } from "@/stores/chain";
import { hash } from "../../../functions/common";
import type { OnClickOutsideHandler } from '@vueuse/core';
import { vOnClickOutside } from '@/services/directive';
import { getBalances } from "@/web3/tokens";
import { getPriceInfo } from "@/web3/network";
import { BigNumber as EthBigNumber } from "ethers";
import { calcGas, tokenAmount } from "../../../functions/common";
import { BigNumber } from "bignumber.js";
import { ethers } from "ethers";
import { sendToken } from "@/web3/operation";
import { useRouter } from "vue-router";
import { createNotification } from "@/web3/utils";

const estimatedGasAmount = "150000"; // hardcoded, can optimize later
const chooseTotalDrop = ref<boolean>(false);
const chooseGasDrop = ref<boolean>(false);
const sendStatus = ref<string>("");
const hasBalanceWarning = ref<boolean>(false);
const tokenStore = useTokenStore();
const hexlAccountBalances = ref<BalanceMap>({});
const tokens = ref<Token[]>([]);
const isInputAddress = ref<boolean>(false);
const message = ref<string>("Let's go!");
const showStep2 = ref<boolean>(false);

interface TokenTransaction {
  to: string,
  salt: string,
  amount: string,
  amountInput: string,
  token: string,
  gasToken: string,
  estimatedGas: string,
}

const transaction = ref<TokenTransaction>({
  to: "",
  salt: hash(new Date().toISOString()),
  amount: "0",
  amountInput: "0.1",
  token: tokenStore.nativeCoin.address,
  gasToken: tokenStore.nativeCoin.address,
  estimatedGas: "0",
})

const token = computed(() => tokenStore.token(transaction.value.token));
const gasToken = computed(() => tokenStore.token(transaction.value.gasToken));

const tokenBalance = (token: string): string => {
  return hexlAccountBalances.value[token]?.normalized || "0";
}

const transactionTokenBalance = computed(
  () => tokenBalance(transaction.value.token)
);

const genTokenList = async function () {
  hexlAccountBalances.value = await getBalances(
    useAccountStore().account!.address,
    hexlAccountBalances.value,
  );
  tokens.value = tokenStore.tokens.filter(
    t => Number(tokenBalance(t.address)) > 0
  );
  setDefaultToken(tokenBalance);
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

const setGas = async () => {
  const chain = useChainStore().chain;
  const price = await getPriceInfo(chain, transaction.value.gasToken);
  transaction.value.estimatedGas = calcGas(
    chain,
    tokenStore.token(transaction.value.gasToken),
    EthBigNumber.from(estimatedGasAmount),
    price,
  ).toString();
}

const refreshGas = async () => {
  await setGas();
  await delay(5000);
  await refreshGas();
};

const totalServiceFee = computed(() => {
  return BigNumber(
    transaction.value.estimatedGas
  ).div(
    tokenBase(gasToken.value)
  ).dp(10).toString();
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
watch([() => transaction.value.gasToken], setGas);
watch(
  [() => transaction.value.amountInput, transactionTokenBalance],
  ([newAmountInput, newTokenBalance], _old) => {
    if (Number(newAmountInput) > Number(newTokenBalance)) {
      hasBalanceWarning.value = true;
    } else {
      hasBalanceWarning.value = false;
    }
  }
);

const verifySendTo = () => {
  if (transaction.value.to.length > 0) {
    if (ethers.utils.isAddress(transaction.value.to)) {
      isInputAddress.value = true;
      return true;
    } else if (validateEmail(transaction.value.to)) {
      isInputAddress.value = false;
      return true;
    } else {
      createNotification("Invalid Input", "error");
      return false;
    }
  } else {
    createNotification("Empty Input", "error");
    return false;
  }
};

const onSubmit = async (_e: Event) => {
  if (verifySendTo()) {
    transaction.value.amount = tokenAmount(
      transaction.value.amountInput,
      tokenStore.token(transaction.value.token).decimals
    ).toString();
    try {
      sendStatus.value = "processing";
      message.value = "Check your wallet to confirm the operation...";
      const status = await sendToken(
        transaction.value.token,
        [{
          schema: isInputAddress.value ? undefined : "mailto",
          name: transaction.value.to,
        }],
        transaction.value.amount,
        transaction.value.gasToken,
        false // dryrun
      );
      message.value = "Done!";
      sendStatus.value = "success";
    } catch(error) {
      console.log(error);
      sendStatus.value = "error";
      message.value = "Something went wrong...";
      createNotification("Error: " + error as string, "error");
    }
  }
}

const goToStep2 = () => {
  showStep2.value = false;
  if (verifySendTo()) {
    showStep2.value = true;
  }
}

const goToStep1 = () => {
  showStep2.value = false;
  transaction.value.to = "";
}

const router = useRouter();
const closeModal = () => {
  if (sendStatus.value == 'success') {
    router.push("/");
  }
  sendStatus.value = "";
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
.confirmAddress {
  color: #076AE0;
  font-size: 1rem;
  font-weight: 600;
  @media (max-width: 640px) {
    font-size: 0.75rem; } }
.gotoStep1 {
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center; }
.profile-info {
  display: flex;
  text-align: left;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  padding: 0.75rem 0.5rem;
  border-radius: 0.5rem;
  border: 1.5px solid #076AE0;
  transition: border-color 150ms ease-in-out; }
.name {
  display: flex;
  position: relative;
  word-break: break-word;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column; }
.spinner-lg {
  .generate-spinner(); }
.generate-spinner(
  @radius: 60px,
  @border-width: 12px,
  @check-thickness: 12px,
  @success-color: #4BAE4F,
  @error-color: #FD4755,
  @default-color: #076AE0,
  @background-color: white,
) {
  @check-size: @radius * .57;
  display: inline-block;
  // background-color: @background-color;
  width: (@radius * 2);
  height: (@radius * 2);
  position: relative;
  box-sizing: border-box;
  border: @border-width solid @default-color;
  border-radius: @radius;
  transition: border-color 200ms;
  &.success {
    .context-class('success'); }
  &.error {
    .context-class('error'); }
  &.processing {
    border-color: @background-color;
    &:before {
      opacity: 1; }
    > div {
      opacity: 0; } }
  @check-height: 1.8837209302 * @check-size;
  .check {
    opacity: 1;
    transition: opacity 200ms;
    position: absolute;
    top: @radius - (@check-height / 1.8) - @border-width;
    left: @radius - (@check-size / 2) - @border-width;
    height: @check-height;
    width: @check-size;
    transform: rotate(45deg);
    transition-property: transform, height, width, top, left;
    transition-duration: 200ms, 200ms, 200ms, 200ms, 200ms;
    &:before, &:after {
      .pseudo-block();
      position: absolute;
      background-color: @default-color;
      transition-property: left, top, height, width;
      transition-duration: 200ms, 200ms, 200ms, 200ms;
      border-radius: 20px; }
    &:before {
      width: @check-thickness;
      height: @check-height;
      left: @check-size - @check-thickness;
      top: 0; }
    &:after {
      width: @check-size;
      height: @check-thickness;
      left: 0;
      top: @check-height - @check-thickness; } }
  &.error .check {
    transform: rotate(-135deg);
    height: @check-height;
    width: @check-height;
    top: @radius - (@check-height / 2) - @border-width;
    left: @radius - (@check-height / 2) - @border-width;
    &:before {
      height: @check-height;
      left: 25.7116279064px; }
    &:after {
      width: @check-height;
      top: 25.7116279064px; } }
  // spinning part
  &:before {
    .pseudo-block();
    opacity: 0;
    background: none;
    padding: 0;
    margin: 0;
    position: absolute;
    top: -@border-width;
    left: -@border-width;
    box-sizing: border-box;
    height: @radius;
    width: @radius;
    border-radius: @radius 0 0 0;
    border: @border-width solid @default-color;
    border-bottom: none;
    border-right: none;
    transform: rotate(0deg);
    transform-origin: bottom right;
    transition: opacity 200ms;
    animation-name: check-loading-spinner;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-timing-function: linear; }
  // @mixin
  .context-class(@name) {
    @color: color(~"@{@{name}-color}");
    border-color: @color;
    &:before {
      border-color: @color; }
    > div {
      &:before, &:after {
        background-color: @color; } } } }
@keyframes check-loading-spinner {
  from {
    transform: rotate(0deg); }
  to {
    transform: rotate(360deg); } }
.pseudo-block() {
  content: '';
  display: block; }
.cta-button {
  background-color: rgb(7, 106, 224);
  color: white;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  width: 100%;
  border-radius: 50px;
  border: none; }
.cta-button:disabled {
  background-color: rgb(106, 165, 237);
}
.token-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start; }
.token-selection-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px; }
.input-wrapper {
  display: flex;
  justify-content: center; }
.send-to-name {
  display: flex;
  position: relative;
  word-break: break-word;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column; }
.profile-wrapper {
  margin-right: 1rem;
  line-height: 4rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #28a745;
  margin-left: 1rem; }
.send-to-wrapper {
  display: flex;
  text-align: left;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center; }
.transaction-section {
  text-align: center;
  background: white;
  padding: 35px 20px 5px; }
.input-search-icon {
  top: 13.5px;
  color: #515354;
  left: 30px;
  pointer-events: none;
  z-index: 1;
  right: auto;
  text-decoration: none;
  position: absolute;
  line-height: 1;
  display: inline-block; }
.people-input-box {
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-weight: normal;
  color: black;
  padding: 0 15px;
  position: relative;
  text-align: left; }
.people-title {
  color: #0c0c0d;
  font-size: 1.75rem;
  line-height: 2.25rem;
  font-weight: 500;
  margin-top: 0px;
  margin-left: 20px;
  margin-top: 10px; }
.people-section {
  display: block;
  background-color: white;
  padding: 25px 0px calc(5%); }
.form-send {
  background-color: white;
  position: static;
  border-radius: 15px;
  overflow: visible;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem 0 1rem 0;
  justify-content: space-between; }
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
  -webkit-appearance: none; }
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
  margin-top: -10px;
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
.balance-warning-mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  height: 18px;
  color: #FE646F;
  width: auto; }
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
.transition {
  transition: .3s cubic-bezier(.3, 0, 0, 1.3) }
.redpacket_close {
  position: absolute;
  z-index: 50;
  margin: 0.5rem 0;
  right: 0.5rem; }
</style>