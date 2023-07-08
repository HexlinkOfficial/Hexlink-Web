<template>
  <div v-if="step === 'input_email'" class="form-send">
    <div style="display: block;">
      <img src="@/assets/svg/send-logo.svg" style="width: 50px; height: 50px; margin: 1rem 0;" alt="send icon" />
      <h2 class="people-title">Send Token</h2>
      <div class="people-text">Enter receiver's email address or public address(0x)</div>
      <div class="people-input-box">
        <div class="phoneNumber">
          <div style="display: flex; align-items: center;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="1em" height="1em">
              <path
                d="M20.21 17.544l-2.785-2.785a7.752 7.752 0 0 0 1.114-3.986C18.54 6.49 15.05 3 10.77 3S3 6.49 3 10.773c0 4.282 3.489 7.772 7.77 7.772a7.686 7.686 0 0 0 3.985-1.114l2.784 2.785a1.66 1.66 0 0 0 2.34 0l.33-.33a1.645 1.645 0 0 0 0-2.342zM4.723 10.773c0-3.334 2.714-6.05 6.047-6.05 3.332 0 6.047 2.716 6.047 6.05 0 3.333-2.715 6.049-6.047 6.049-3.333 0-6.047-2.716-6.047-6.05z">
              </path>
            </svg>
          </div>
          <input v-model="transaction.toInput" placeholder="email or wallet address" class="border-0 outline-none appearance-none flex-shrink w-full bg-transparent" type="text" name="phone-number-input" id="phone-number-input" autocomplete="off" spellcheck="false" style="padding-left: 10px; width: 100%;">
        </div>
        <div style="display: flex; justify-content: center; margin: 5px 0; font-weight: 600;">or</div>
        <div class="phone-login" style="margin-top: 10px;">
          <phone-input
            @phone="phone = $event"
            @country="country = $event"
            @phoneData="phoneData = $event"
            name="phone-number-input"
            required
            :value="'1'"
            style="margin-bottom: 15px;"
          />
        </div>
      </div>
    </div>
    <button class="cta-button" @click="inputToken">Continue</button>
  </div>
  <div v-if="step === 'input_token'" class="form-send">
    <div style="text-align: center; padding: 35px 10px 0px;">
      <div class="profile-info">
        <div class="profile-wrapper">
            <i class="fa-solid fa-circle-check fa-2x"></i>
        </div>
        <div class="name" style="">
          <div class="confirmAddress">
            <span>{{ prettyPrint(transaction.receiver.value, 14, 7) }}</span>
          </div>
        </div>
        <div @click="reset" class="confirmButton">
          <img src="@/assets/svg/corssBlack.svg" style="width: 1.5rem; height: 1.5rem;"/> 
        </div>
      </div>
    </div>
    <div style="display: block;">
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
            <div class="mode-options" style="right: -25.375px;">
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
    </div>
    <div style="display: flex; justify-content: center; width: 100%; padding: 0 15px;">
      <button :disabled="processing || hasBalanceWarning" class="cta-button" @click="checkOut">
        {{ processing ? 'Processing' : 'Continue' }}
      </button>
    </div>
  </div>
  <div v-if="step === 'checkout'" class="form-send">
    <div style="display: block;">
      <img src="@/assets/svg/checkout.svg" style="width: 50px; height: 50px; margin: 1rem 0;" alt="send icon" />
      <h2 class="people-title">Confirm</h2>
      <div class="people-text">Confirm your transaction details</div>
      <div class="token-amount" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: block; color: #737577;">Receiver</div>
        <a-tooltip placement="top">
            <template #title>
              <span>Address {{ transaction.to }}</span>
            </template>
            <div style="display: flex;">
              {{ transaction.toInput }}
            </div>
        </a-tooltip>
      </div>
      <div class="token-amount" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: block; color: #737577;">Amount</div>
        <div style="display: flex;">
          {{ transaction.amountInput }}
          <div style="display: flex; align-items: center;">
            <div class="token-icon">
              <img :src="gasToken.logoURI" />
            </div>
            <div class="token-box">
              <b>{{ gasToken.symbol }}</b>
            </div>
          </div>
        </div>
      </div>
      <div class="token-amount" style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: block; color: #737577;">Estimated Gas Fee</div>
          <div style="display: flex;">
            {{ totalServiceFee }}
            <div style="display: flex; align-items: center;">
              <div class="token-icon">
                <img :src="gasToken.logoURI" />
              </div>
              <div class="token-box">
                <b>{{ gasToken.symbol }}</b>
              </div>
            </div>
          </div>
        </div>
    </div>
    <button class="cta-button" @click="sendOtp" :disabled='processing'>
      {{ processing ? 'Processing': 'Checkout' }}
    </button>
  </div>
  <UserOpExecuteModal v-if="step == 'process_userop'" @close="reset"></UserOpExecuteModal>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, type Ref } from "vue";
import { BigNumber as EthBigNumber } from "ethers";
import { BigNumber } from "bignumber.js";
import { ethers } from "ethers";
import type { OnClickOutsideHandler } from '@vueuse/core';
import { vOnClickOutside } from '@/services/directive';
import type { BalanceMap } from "@/web3/tokens";
import { getBalances } from "@/web3/tokens";
import { tokenBase, createNotification, prettyPrint } from "@/web3/utils";
import { useChainStore } from "@/stores/chain";
import { useTokenStore } from "@/stores/token";
import { getAccountAddress } from "@/web3/account";
import { getPriceInfo } from "@/web3/network";
import type { Token } from "../../../../functions/common";
import { calcGas, tokenAmount, hash } from "../../../../functions/common";

import { isValidEmail } from "@/web3/utils";
import PhoneInput from "@/components/PhoneInput.vue";
import type { PhoneData } from "../types";
import { buildTokenTransferUserOp, getHexlinkAccountApi } from "@/web3/userOp";
import { getPimlicoProvider } from "@/accountAPI/PimlicoBundler";
import { hexlify } from "ethers/lib/utils"
import { ENTRYPOINT } from "@/web3/constants";
import { useUserOpStore } from "@/stores/userOp";
import UserOpExecuteModal from "@/components/UserOpExecuteModal.vue";

interface TokenTransaction {
  to: string,
  toInput: string,
  receiver: {
    schema: string,
    value: string,
  },
  salt: string,
  amount: EthBigNumber,
  amountInput: string,
  token: string,
  gasToken: string,
  estimatedGas: string,
}

const chooseTotalDrop = ref<boolean>(false);
const tokenStore = useTokenStore();
const hexlAccountBalances = ref<BalanceMap>({});
const tokens = ref<Token[]>([]);
const phone: Ref<string> = ref("");
const country: Ref<string> = ref("");
const phoneData: Ref<PhoneData> = ref({});
const step = ref<string>("input_email");
const processing = ref<boolean>(false);
const shouldRefreshGas = ref<boolean>(false);

const transaction = ref<TokenTransaction>({
  to: "",
  toInput: "",
  receiver: {schema: "", value: ""},
  salt: hash(new Date().toISOString()),
  amount: EthBigNumber.from(0),
  amountInput: "0.01",
  token: tokenStore.nativeCoin.address,
  gasToken: tokenStore.nativeCoin.address,
  estimatedGas: "0",
});

const genTokenList = async function () {
  hexlAccountBalances.value = await getBalances(
    await getAccountAddress(),
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

onMounted(genTokenList);
watch(() => useChainStore().current, genTokenList);

const token = computed(() => tokenStore.token(transaction.value.token));
const gasToken = computed(() => tokenStore.token(transaction.value.gasToken));

const tokenBalance = (token: string): string => {
  return hexlAccountBalances.value[token]?.normalized || "0";
};

const hasBalanceWarning = computed(() => {
  return Number(
    transaction.value.amountInput
  ) > Number(tokenBalance(transaction.value.token));
});

async function delay(ms: number) {
  return new Promise((resolve, _reject) => {
    window.setTimeout(() => resolve(null), ms);
  });
}

const checkOut = async function() {
  processing.value = true;
  transaction.value.amount = tokenAmount(
    transaction.value.amountInput,
    token.value.decimals
  );
  const api = getHexlinkAccountApi();
  const op = await buildTokenTransferUserOp(transaction.value, api);
  const bundler = getPimlicoProvider(useChainStore().chain);
  const result = await bundler.send(
    'eth_estimateUserOperationGas',
    [op, ENTRYPOINT]
  );
  const { callGasLimit, preVerificationGas, verificationGas } = result as any;
  op.preVerificationGas = preVerificationGas;
  op.callGasLimit = callGasLimit;
  op.verificationGasLimit = verificationGas;
  useUserOpStore().reset();
  useUserOpStore().updateOp(op);
  useUserOpStore().updateOpInfo({
    txType: 'erc20Transfer',
    txMetadata: {
      receipt: transaction.value.toInput,
      to: transaction.value.to,
      amount: transaction.value.amountInput,
      token: token.value,
    }
  });
  step.value = 'checkout';
  processing.value = false;
  shouldRefreshGas.value = true;
  setGas();
}

const sendOtp = async () => {
  shouldRefreshGas.value = false;
  step.value = "process_userop";
}

const setGas = async () => {
  const chain = useChainStore().chain;
  const {maxFeePerGas, maxPriorityFeePerGas}
    = await useChainStore().provider.getFeeData();
  useUserOpStore().updateOp({
    maxFeePerGas: hexlify(maxFeePerGas ?? 0),
    maxPriorityFeePerGas: hexlify(maxPriorityFeePerGas ?? 0),
  });
  const price = await getPriceInfo(chain, maxFeePerGas, transaction.value.gasToken);
  const token = tokenStore.token(transaction.value.gasToken);
  const op = useUserOpStore().op;
  const totalGas = EthBigNumber.from(op.verificationGasLimit)
    .add(op.callGasLimit as number)
    .add(op.preVerificationGas as number);
  transaction.value.estimatedGas
    = calcGas(chain, token, totalGas, price).toString();
  if (shouldRefreshGas.value) {
    await delay(3000);
    await setGas();
  }
}

const totalServiceFee = computed(() => {
  if (EthBigNumber.from(transaction.value.estimatedGas).gt(0)) {
    return BigNumber(
      transaction.value.estimatedGas
    ).div(
      tokenBase(gasToken.value)
    ).dp(10).toString().substring(0,8)
  } else {
    return "calculating...";
  }
});

const chooseTotalHandle: OnClickOutsideHandler = (event) => {
  chooseTotalDrop.value = false;
}

const tokenChoose =
  async (mode: "token" | "gas", token: Token) => {
    if (mode === "token") {
      transaction.value.token = token.address;
    } else {
      transaction.value.gasToken = token.address;
      setGas();
    }
  };

const reset = () => {
  step.value = 'input_email';
  transaction.value.toInput = "";
  shouldRefreshGas.value = false;
}

const inputToken = async () => {
  transaction.value.toInput = transaction.value.toInput.toLowerCase().trim();
  if (ethers.utils.isAddress(transaction.value.toInput)) {
    transaction.value.receiver = {
      schema: "address",
      value: transaction.value.toInput
    };
    transaction.value.to = transaction.value.toInput;
    step.value = 'input_token';
  } else if (isValidEmail(transaction.value.toInput)) {
    transaction.value.receiver = {
      schema: "mailto",
      value: transaction.value.toInput
    };
    transaction.value.to = await getAccountAddress(
      "mailto",
      transaction.value.toInput
    );
    step.value = 'input_token';
  } else if (phoneData.value.isValid) {
    transaction.value.receiver = {
      schema: "tel",
      value: phoneData.value.number!
    };
    transaction.value.to = await getAccountAddress(
      "tel",
      phoneData.value.number,
    );
    step.value = 'input_token';
  } else {
    createNotification(
      "invalid receiver, only address, email or phone number are accepted",
      "error"
    );
  }
}
</script>

<style lang="less" scoped>
.phoneNumber {
  padding: 10px 0 10px 12px;
  border-radius: 0.5rem;
  border: 2px solid transparent;
  background: #eee;
  flex-direction: row;
  display: flex;
  width: 100%; }
.phoneNumber:focus-visible {
  border-color: black;
  background-color: white; }
.confirmAddress {
  color: #076AE0;
  font-size: 1rem;
  font-weight: 600;
  @media (max-width: 640px) {
    font-size: 0.75rem; } }
.confirmButton {
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
  border: 2px solid #076AE0;
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
  @background-color: #fffc,
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
  width: 100%;
  border-radius: 0.5rem;
  white-space: nowrap;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1),outline 0s;
  justify-content: center;
  outline-offset: 0.125rem;
  outline: 2px solid transparent;
  border: none; }
.cta-button:hover {
  background-color: rgb(106, 165, 237); }
.cta-button:disabled {
  background-color: rgb(106, 165, 237); }
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
  color: #515354;
  left: 15px;
  pointer-events: none;
  z-index: 1;
  right: auto;
  text-decoration: none;
  position: absolute;
  line-height: 1;
  display: inline-block; }
.people-input-box {
  margin-top: 5px;
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-weight: normal;
  color: black;
  position: relative;
  text-align: left; }
.people-title {
  color: #0c0c0d;
  font-size: 1.5rem;
  line-height: 1.2;
  font-weight: 600;
  margin-top: 0px; }
.people-text {
  color: rgba(19,21,23,0.64);
  margin-bottom: 0.5rem;
  font-size: 1rem; }
.people-section {
  display: block;
  background-color: white;
  padding: 25px 0px calc(5%); }
.form-send {
  position: static;
  border-radius: 15px;
  overflow: visible;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1.25rem;
  justify-content: space-between; }
.send-people {
  transition: all 0.3 cubic-bezier(0.4,0,0.2,1);
  color: rgb(19,21,23);
  line-height: 1;
  border-radius: 0.5rem;
  border: 1px solid #ebeced;
  background-color: #fff;
  box-shadow: none;
  padding-left: 3.6875rem;
  padding-right: 3.6875rem;
  padding: 10px 1rem 10px 2.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  text-overflow: ellipsis;
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  outline: none;
  position: relative;
  -webkit-appearance: none; }
.send-people:hover {
  background-color: #fff;
  border-color: rgb(19,21,23);
  outline: 0; }
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
  margin-left: auto;
  margin-right: auto;
  p {
    margin-bottom: 0rem;
    margin-right: 0rem;
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
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0; }
input[type="number"] {
  -moz-appearance: textfield; }
</style>
