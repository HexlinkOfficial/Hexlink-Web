<template>
  <!-- <div v-if="!walletStore.connected" class="connectWallet">
    <button v-if="!walletStore.connected" class="connect-wallet-button" @click="tryConnectWallet">
      <svg style="margin-right: 10px;" width="18" height="18" viewBox="0 0 18 18" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16 2.50025V3.51125C16.5304 3.51125 17.0391 3.72196 17.4142 4.09703C17.7893 4.47211 18 4.98081 18 5.51125V15.5112C18 16.0416 17.7893 16.5504 17.4142 16.9254C17.0391 17.3005 16.5304 17.5112 16 17.5112H2C1.46957 17.5112 0.96086 17.3005 0.58579 16.9254C0.21071 16.5504 0 16.0416 0 15.5112V5.51125C0 4.46625 0.835 3.51825 1.813 3.23925L12.813 0.0962511C13.1851 -0.0100989 13.5768 -0.0286089 13.9573 0.0421711C14.3377 0.112951 14.6966 0.271091 15.0055 0.504141C15.3145 0.737191 15.5651 1.03878 15.7377 1.38516C15.9102 1.73154 16 2.11326 16 2.50025ZM12.5 9.01123C12.1022 9.01123 11.7206 9.16933 11.4393 9.45063C11.158 9.73193 11 10.1134 11 10.5112C11 10.909 11.158 11.2906 11.4393 11.5719C11.7206 11.8532 12.1022 12.0112 12.5 12.0112C12.8978 12.0112 13.2794 11.8532 13.5607 11.5719C13.842 11.2906 14 10.909 14 10.5112C14 10.1134 13.842 9.73193 13.5607 9.45063C13.2794 9.16933 12.8978 9.01123 12.5 9.01123ZM14 2.50025C14.0001 2.42966 13.9852 2.35986 13.9563 2.29544C13.9274 2.23102 13.8853 2.17345 13.8326 2.1265C13.7798 2.07955 13.7178 2.04429 13.6505 2.02305C13.5832 2.00181 13.5121 1.99506 13.442 2.00325L13.362 2.01925L8.14 3.51125H14V2.50025Z"
          fill="white" />
      </svg>
      Connect Wallet
    </button>
  </div> -->
  <div v-if="walletStore.connected">
    <div class="red-packet">
      <p v-if="hasBalanceWarning" class="balance-warning-mobile"><i class="icofont-warning-alt" style="margin-right: 0.25rem;"></i>Insufficient balance</p>
      <div class="total-amount">
        <div class="box">
          <p class="total-amount-text">Total Amount</p>
          <div style="display: flex; width: 100%;">
            <input v-model="redpacket.balanceInput" :style="hasBalanceWarning ? 'color: #FE646F;' : ''" id="red-packet-amount" class="amount-input"
              autocomplete="off" placeholder="0.0" required="true" type="number" autocorrect="off" title="Token Amount"
              inputmode="decimal" min="0" minlength="1" maxlength="79" pattern="^[0-9]*[.,]?[0-9]*$" spellcheck="false">
            <p v-if="hasBalanceWarning" class="balance-warning"><i class="icofont-warning-alt" style="margin-right: 0.25rem;"></i>Insufficient balance</p>
          </div>
          <div class="input-info-show">
            <p class="token-available-balance">
              Available Balance:
              <span class="balance-amount">{{ redPacketTokenBalance.substring(0,6) }}</span>
            </p>
            <div class="total-choose-token">
              <div class="token-select">
                <div class="max-amount-button">
                  <span class="button-text" @click="redpacket.balanceInput = redPacketTokenBalance">MAX</span>
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
      <div class="mode-and-share">
        <div class="game-mode">
          <div class="mode-dropdown" :class="openDropdown && 'active'" @click.stop="openDropdown = !openDropdown;"
            v-on-click-outside.bubble="dropdownHandle">
            <div class="mode-text">{{ modeLabels[redpacket.mode] }}</div>
            <input class="mode-input" type="text" placeholder="select" readonly>
            <div class="mode-options" style="width:100%;">
              <div class="mode-option" @click="modeChoose(2)">Randomly</div>
              <div class="mode-option" @click="modeChoose(1)">Equally</div>
            </div>
          </div>
          <p>Shared among</p>
        </div>
        <div class="share-number">
          <div class="share-input-div">
            <input v-model="redpacket.split" id="red-packet-share" class="shares-input" autocomplete="off" placeholder="1"
              type="number" min="1" step="1" autocorrect="off" inputmode="decimal" pattern="^[0-9]$" spellcheck="false" onkeydown="if(event.key==='.'){event.preventDefault();}"  oninput="event.target.value = event.target.value.replace(/[^0-9]*/g,'');">
          </div>
          <p>People</p>
        </div>
      </div>
    </div>
    <div class="gas-station">
      <div class="enable-switch">
        <p>Enable dynamic share link</p>
        <a-switch v-model:checked="enableDynamic" style="margin-left: 1rem;" />
        <a-tooltip placement="bottomRight">
            <template #title>
              Service gas fee is determined by the market, not by HexLink.
            </template>
            <img style="margin-left: 1rem; width: 16px;" src="@/assets/svg/info.svg" />
          </a-tooltip>
      </div>
      <div class="gas-estimation">
        <p>
          <img style="width: 20px; height: 20px;" src="https://i.postimg.cc/RhXfgJR1/gas-pump.png"/>
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
            <div class="mode-dropdown" :class="chooseGasDrop && 'active'" @click.stop="chooseGasDrop = !chooseGasDrop;" v-on-click-outside.bubble="chooseGasHandle">
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
        <a-tooltip placement="topRight">
          <template #title>
            Service gas fee is determined by the market, not by HexLink.
          </template>
          <img style="margin-left: 1rem; width: 16px;" src="@/assets/svg/info.svg"/>
        </a-tooltip>
      </div>
    </div>
    <div class="choose-account">
      <RedPacketAccount
        account="hexlink"
        :token="redpacket.token"
        :gasToken="redpacket.gasToken"
        :tokenBalance="hexlAccountBalance(redpacket.token)"
        :gasTokenBalance="hexlAccountBalance(redpacket.gasToken)"
        @selected="setAccount"
        :isChosen="redPacketStore.account === 'hexlink'"
      ></RedPacketAccount>
      <RedPacketAccount
        account="wallet"
        :token="redpacket.token"
        :gasToken="redpacket.gasToken"
        :tokenBalance="walletAccountBalance(redpacket.token)"
        :gasTokenBalance="walletAccountBalance(redpacket.gasToken)"
        @selected="setAccount"
        :isChosen="redPacketStore.account === 'wallet'"
      ></RedPacketAccount>
    </div>
    <div class="create">
        <button :disabled="hasBalanceWarning" class="connect-wallet-button" @click="confirmRedPacket" style="width: 90%;">
          <img style="margin-right: 10px;" src="@/assets/svg/redPacket.svg"/>
          Confirm Red Packet
        </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { BigNumber as EthBigNumber } from "ethers";
import { useWalletStore } from '@/stores/wallet';
import { useAccountStore } from '@/stores/account';
import { useChainStore } from "@/stores/chain";
import { useRedPacketStore } from '@/stores/redpacket';
import type { AccountType } from "@/stores/redpacket";
import { connectWallet } from "@/web3/wallet";
import { tokenBase } from "@/web3/utils";
import type { OnClickOutsideHandler } from '@vueuse/core';
import { onClickOutside } from '@vueuse/core'
import { vOnClickOutside } from '@/services/directive';
import { getBalances } from "@/web3/tokens";
import type { BalanceMap } from  "@/web3/tokens";
import { BigNumber } from "bignumber.js";
import { validator } from "@/web3/redpacket";
import { useTokenStore } from "@/stores/token";
import RedPacketAccount from "@/components/RedPacketAccount.vue";
import { getPriceInfo } from "@/web3/network";
import type { Token } from "../../../functions/common";
import { hash, tokenAmount } from "../../../functions/common";
import type { RedPacketInput } from "../../../functions/redpacket";
import { calcGas } from "../../../functions/common";
import { redpacketId } from "../../../functions/redpacket";
import { getGasCost } from "../../../functions/common";
import { createNotification } from "@/web3/utils";

const estimatedGasAmount = "1600000"; // hardcoded, can optimize later
const chooseTotalDrop = ref<boolean>(false);
const openDropdown = ref<boolean>(false);
const chooseGasDrop = ref<boolean>(false);
const tokens = ref<Token[]>([]);
const modalRef = ref<any>(null);
const modal = ref<boolean>(false);
const hasBalanceWarning = ref<boolean>(false);
const enableDynamic = ref<boolean>(false);
const tokenStore = useTokenStore();
const walletStore = useWalletStore();
const redPacketStore = useRedPacketStore();
const hexlAccountBalances = ref<BalanceMap>({});
const hexlAccountBalance = (token: string) : string => {
  return hexlAccountBalances.value[token]?.normalized || "0";
}
const walletAccountBalances = ref<BalanceMap>({});
const walletAccountBalance = (token: string) : string => {
  return walletAccountBalances.value[token]?.normalized || "0";
}
const setAccount = (account: AccountType) => {
  useRedPacketStore().setAccount(account);
}
interface RawRedPacketInput extends RedPacketInput {
  balanceInput: string,
}
const redpacket = ref<RawRedPacketInput>({
  id: "",
  mode: 2,
  salt: "",
  split: 1,
  balance: "0",
  balanceInput: "0",
  token: tokenStore.nativeCoin.address,
  gasToken: tokenStore.nativeCoin.address,
  gasSponsorship: "0",
  estimatedGas: "0",
  validator: validator(),
  validationRules: [],
  creator: useAccountStore().account?.address || "",
  sponsorGas: true,
  type: "erc20",
});
const token = computed(() => tokenStore.token(redpacket.value.token));
const gasToken = computed(() => tokenStore.token(redpacket.value.gasToken));
const tokenBalance = (token: string) => {
  if (redPacketStore.account == "hexlink") {
    return hexlAccountBalance(token);
  }
  return walletAccountBalance(token);
};
const redPacketTokenBalance = computed(
  () => tokenBalance(redpacket.value.token)
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
      redpacket.value.token = nativeCoin.address;
      redpacket.value.gasToken = nativeCoin.address;
    } else {
      redpacket.value.token = tokens.value[0].address;
      redpacket.value.gasToken = tokens.value[0].address
    }
}
async function delay(ms: number) {
    return new Promise( ( resolve, _reject ) => {
        window.setTimeout( () => resolve(null), ms );
    } );
}
const setGas = async() => {
  const chain = useChainStore().chain;
  const price = await getPriceInfo(chain, redpacket.value.gasToken);
  const cost = getGasCost(chain, "claim_erc20_redpacket");
  const sponsorshipAmount =
    EthBigNumber.from(cost).mul(redpacket.value.split || 0);
  redpacket.value.gasSponsorship = calcGas(
    chain,
    tokenStore.token(redpacket.value.gasToken),
    sponsorshipAmount,
    price,
  ).toString();
  redpacket.value.estimatedGas = calcGas(
    chain,
    tokenStore.token(redpacket.value.gasToken),
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
    redpacket.value.gasSponsorship
  ).plus(redpacket.value.estimatedGas).div(
    tokenBase(gasToken.value)
  ).dp(8).toString();
})
const tokenChoose =
  async (mode: "token" | "gas", token: Token) => {
    if (mode === "token") {
      redpacket.value.token = token.address;
    } else {
      redpacket.value.gasToken = token.address;
      setGas();
    }
  };
onMounted(genTokenList);
onMounted(refreshGas);
watch(() => useChainStore().current, genTokenList);
watch(() => useWalletStore().connected, genTokenList);
watch([
  () => redpacket.value.gasToken,
  () => redpacket.value.split
], setGas);
watch(
  [() => redpacket.value.balanceInput, redPacketTokenBalance],
  ([newBalanceInput, newTokenBalance], _old) => {
    if (Number(newBalanceInput) > Number(newTokenBalance)) {
      hasBalanceWarning.value = true;
    } else {
      hasBalanceWarning.value = false;
    }
  }
);
const tryConnectWallet = async function () {
  if (typeof window.ethereum == 'undefined') {
    console.log('MetaMask is not installed!');
  }
  await connectWallet();
};

const modeLabels = ["", "Equally", "Randomly"];
const modeChoose = (gameMode: 1 | 2) => {
  redpacket.value.mode = gameMode;
}
const validateInput = () => {
  if (Number(redpacket.value.balanceInput) == 0) {
    createNotification("Number of tokens to deposit cannot be 0", "error");
    return false;
  }
  if (Number(redpacket.value.split) == 0) {
    createNotification("Number of claimers cannot be 0", "error");
    return false;
  }
  return true;
};

const confirmRedPacket = async function () {
  if (validateInput()) {
    redpacket.value.salt = hash(new Date().toISOString());
    redpacket.value.balance = tokenAmount(
      redpacket.value.balanceInput,
      tokenStore.token(redpacket.value.token).decimals
    ).toString();

    if (enableDynamic.value) {
      redpacket.value.validationRules.push({type: "dynamic_secrets"});
    }
    const chain = useChainStore().chain;
    const account = useAccountStore().account!.address;
    redpacket.value.creator = account;
    redpacket.value.id = redpacketId(chain, redpacket.value);
    await setGas();
    useRedPacketStore().beforeCreate(redpacket.value);
  }
};
const chooseTotalHandle: OnClickOutsideHandler = (event) => {
  chooseTotalDrop.value = false;
}
const dropdownHandle: OnClickOutsideHandler = (event) => {
  openDropdown.value = false;
}
const chooseGasHandle: OnClickOutsideHandler = (event) => {
  chooseGasDrop.value = false;
}
onClickOutside(
  modalRef,
  (event) => {
    modal.value = false
  },
);
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
  align-items: center;
  width: 100%;
  justify-content: flex-end;
  p {
    margin-bottom: 0rem; } }
.connectWallet {
  display: flex;
  width: 100%;
  height: 500px;
  align-items: center;
  justify-content: center; }
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
  background-color: rgba(7, 106, 224,0.9);
}
.connect-wallet-button:disabled {
  background-color: rgb(106, 165, 237);
}
.red-packet {
  visibility: visible;
  height: auto;
  display: block;
  padding: 0px; }
.red-packet .mode-and-share {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 16px;
  margin-left: 0rem;
  margin-right: 0rem; }
.red-packet .mode-and-share .game-mode {
  display: flex;
  flex: 1 1 10%;
  p {
    display: flex;
    align-items: center;
    margin-left: 1rem;
    margin-bottom: 0rem;
    font-weight: 500;
    line-height: 1.5;
    font-size: 14px; } }
.red-packet .mode-and-share .share-number {
  flex: 1 1 0%;
  display: flex;
  p {
    margin-left: 1rem;
    margin-right: 0rem;
    margin-bottom: 0rem;
    font-weight: 500;
    line-height: 1.5;
    font-size: 14px;
    display: flex;
    align-items: center; } }
.red-packet .total-amount {
  display: flex;
  gap: 16px;
  margin: 16px;
  margin-left: 0rem;
  margin-right: 0rem; }
.red-packet .total-amount .box {
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
.red-packet .total-amount .box .amount-input {
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
.red-packet .total-amount .box .input-info-show {
  display: flex;
  // flex: 1 1 0%;
  height: 100%;
  flex-direction: column;
  align-items: flex-end;
  row-gap: 4px;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4375em;
  color: rgb(7, 16, 27);
  cursor: text; }
.red-packet-model {
  margin: 16px; }
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
.total-choose-token {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4375em;
  color: rgb(7, 16, 27);
  cursor: text; }
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
input:focus {
  outline: none; }
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0; }
/* Firefox */
input[type=number] {
  -moz-appearance: textfield; }
.mode-options {
  display: flex;
  align-items: center;
  position: absolute;
  top: 50px;
  width: auto;
  background: #fff;
  box-shadow: 0 30px 30px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  overflow: hidden;
  display: none; }
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
.mode-input {
  bottom: 0px;
  left: 0px;
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 100%;
  box-sizing: border-box; }
.mode-option {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer; }
.mode-option:hover {
  background: rgb(242, 246, 250);
  color: #999; }
.mode-text {
  padding-right: 32px;
  padding: 11px 12px;
  height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  appearance: none;
  user-select: none;
  border-radius: 15px;
  cursor: pointer;
  margin-right: 1.5rem;
  border: 0px;
  box-sizing: content-box;
  background: none;
  -webkit-tap-highlight-color: transparent;
  display: block;
  min-width: 0px;
  width: 100%; }
.shares-input {
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
.share-input-div {
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
  width: 100%;
  border-radius: 8px;
  background-color: rgb(242, 246, 250);
  font-size: 15px;
  overflow: unset !important;
  p {
    display: flex;
    flex-direction: row-reverse;
    margin-right: 1rem;
    width: 50%;
    font-size: 14px;
    font-weight: 400; } }
.token-list {
  display: grid;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem; }
.token-list .title {
  display: grid;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem; }
.token-list .title .title-col {
  display: flex;
  justify-content: space-between;
  grid-column: span 4 / span 4; }
.token-list .title .title-col .content {
  display: flex;
  margin-left: 0.75rem;
  margin-left: 0.875rem;
  align-items: center; }
.token-list .title .title-col .content .text {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  width: 9rem; }
.token-list .title .title-col .content svg {
  display: inline-flex;
  transition-property: background-color, border-color, color, fill, stroke;
  justify-content: center;
  align-items: center;
  width: 1rem;
  height: 1rem;
  margin-left: 0.75rem; }
.token-list .views {
  margin-top: 0.75rem;
  grid-column: span 4 / span 4;
  @media (min-width: 640px) {
    display: flex;
    margin-top: 0; } }
.token-list .views .detail-view {
  padding: 0.125rem;
  transition-property: background-color, border-color, color, fill, stroke;
  border-radius: 50px;
  border-style: solid;
  border-width: 1px;
  border-color: rgb(71, 85, 105); }
.token-list .views .detail-view button {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  color: #000;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 800;
  line-height: 1.25rem;
  width: 50%;
  border-radius: 50px; }
.token-list .views .detail-view .listView-button {
  opacity: 1;
  background-color: rgba(7, 106, 224, 0);
  color: rgb(71, 85, 105); }
.token-list .views .detail-view .listView-button.show {
  opacity: 1;
  background-color: rgb(7, 106, 224);
  color: white; }
.gas-station {
  display: flex;
  flex-direction: column;
  margin: 0px;
  padding: 0px 10px 20px 10px; }
.gas-estimation {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  p {
    margin-bottom: 0rem;
    margin-right: 1rem;
    font-weight: 500; } }
.choose-account {
  display: flex;
  flex-direction: column;
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
.create {
  display: flex;
  justify-content: center;
  flex-direction: row-reverse; }
.balance-warning {
  display: none;
  justify-content: flex-end;
  align-items: center;
  flex: 2 1 0%;
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
  color: #FE646F;
  width: auto; }
.balance-warning-mobile {
  display: flex;
  align-items: center;
  font-weight: 700;
  padding-top: 11px;
  height: 18px;
  margin-bottom: -0.5rem;
  color: #FE646F;
  width: auto; }
</style>