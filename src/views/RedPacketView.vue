<template>
  <layout :active="1">
    <h1 style="margin-bottom: 1rem;">Red Packet</h1>
    <div class="row">
      <div className="row invoice-card-row">
        <div class="col-xxl-6">
          <div class="card">
            <div class="card-body">
              <div class="token-list">
                <div class="title">
                  <div class="title-col">
                    <div class="content">
                      <div class="text">Share your love</div>
                      <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M2 9C2.55228 9 3 8.55228 3 8C3 7.44772 2.55228 7 2 7C1.44772 7 1 7.44772 1 8C1 8.55228 1.44772 9 2 9Z"
                          fill="black" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                          d="M2 3C2.55228 3 3 2.55228 3 2C3 1.44772 2.55228 1 2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3Z"
                          fill="black" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                          d="M2 15C2.55228 15 3 14.5523 3 14C3 13.4477 2.55228 13 2 13C1.44772 13 1 13.4477 1 14C1 14.5523 1.44772 15 2 15Z"
                          fill="black" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="views">
                  <div class="detail-view">
                    <button class="listView-button" @click="luckHistory = true; sendLuck = false" :class="luckHistory && 'show'">Luck
                      History</button>
                    <button class="listView-button" @click="sendLuck = true; luckHistory = false"
                      :class="sendLuck && 'show'">Send Luck</button>
                  </div>
                </div>
              </div>
              <div v-if="luckHistory" class="sent-history">
                <h1>No Red Packet Sent Yet!</h1>
              </div>
              <div v-if="!walletStore.connected && sendLuck" class="connectWallet">
                <button v-if="walletStore.connected == false" class="connect-wallet-button" @click="connectOrDisconnectWallet">
                  <svg style="margin-right: 10px;" width="18" height="18" viewBox="0 0 18 18" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M16 2.50025V3.51125C16.5304 3.51125 17.0391 3.72196 17.4142 4.09703C17.7893 4.47211 18 4.98081 18 5.51125V15.5112C18 16.0416 17.7893 16.5504 17.4142 16.9254C17.0391 17.3005 16.5304 17.5112 16 17.5112H2C1.46957 17.5112 0.96086 17.3005 0.58579 16.9254C0.21071 16.5504 0 16.0416 0 15.5112V5.51125C0 4.46625 0.835 3.51825 1.813 3.23925L12.813 0.0962511C13.1851 -0.0100989 13.5768 -0.0286089 13.9573 0.0421711C14.3377 0.112951 14.6966 0.271091 15.0055 0.504141C15.3145 0.737191 15.5651 1.03878 15.7377 1.38516C15.9102 1.73154 16 2.11326 16 2.50025ZM12.5 9.01123C12.1022 9.01123 11.7206 9.16933 11.4393 9.45063C11.158 9.73193 11 10.1134 11 10.5112C11 10.909 11.158 11.2906 11.4393 11.5719C11.7206 11.8532 12.1022 12.0112 12.5 12.0112C12.8978 12.0112 13.2794 11.8532 13.5607 11.5719C13.842 11.2906 14 10.909 14 10.5112C14 10.1134 13.842 9.73193 13.5607 9.45063C13.2794 9.16933 12.8978 9.01123 12.5 9.01123ZM14 2.50025C14.0001 2.42966 13.9852 2.35986 13.9563 2.29544C13.9274 2.23102 13.8853 2.17345 13.8326 2.1265C13.7798 2.07955 13.7178 2.04429 13.6505 2.02305C13.5832 2.00181 13.5121 1.99506 13.442 2.00325L13.362 2.01925L8.14 3.51125H14V2.50025Z"
                      fill="white" />
                  </svg>
                  Connect Wallet
                </button>
              </div>
              <div v-if="walletStore.connected && sendLuck">
                <div class="red-packet">
                  <div class="total-amount">
                    <div class="box">
                      <p class="total-amount-text">Total Amount</p>
                      <input v-model="redpacket.balance" id="red-packet-amount" class="amount-input" autocomplete="off"
                        placeholder="0.0" required="true" type="number" autocorrect="off" title="Token Amount"
                        inputmode="decimal" min="0" minlength="1" maxlength="79" pattern="^[0-9]*[.,]?[0-9]*$"
                        spellcheck="false">
                      <div class="input-info-show">
                        <p class="token-available-balance">
                          Available Balance: 
                          <span class="balance-amount">{{ redpacket.token.balance?.normalized }}</span>
                        </p>
                        <div class="total-choose-token">
                          <div class="token-select">
                            <div class="max-amount-button">
                              <span class="button-text" @click="setMaxAmount">MAX</span>
                              <span class="button-outline"></span>
                            </div>
                          </div>
                          <div class="token-select">
                            <div class="mode-dropdown" :class="chooseTotalDrop && 'active'" @click.stop="chooseTotalDrop = !chooseTotalDrop;" v-on-click-outside.bubble="chooseTotalHandle">
                              <div class="token-icon">
                                <img :src="redpacket.token.metadata.logoURI" />
                              </div>
                              <div class="mode-text2">{{ redpacket.token.metadata.symbol }}</div>
                              <input class="mode-input" type="text" placeholder="select" readonly>
                              <div class="mode-options">
                                <div class="mode-option"
                                  v-for="(token, index) of tokens"
                                  :key="index"
                                  @click="tokenChoose('token', token)">
                                  <div class="token-icon">
                                    <img :src="token.metadata.logoURI"/>
                                  </div>
                                  <div style="display: flex; flex-direction: column; align-items: flex-start;">
                                    <b>{{ token.metadata.symbol }}</b>
                                    <div style="margin-right:0.5rem;">{{ token.balance?.normalized }} available</div>
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
                      <div class="mode-dropdown" :class="openDropdown && 'active'" @click.stop="openDropdown = !openDropdown;" v-on-click-outside.bubble="dropdownHandle">
                        <div class="mode-text">{{ modeLabels[redpacket.mode] }}</div>
                        <input class="mode-input" type="text" placeholder="select" readonly>
                        <div class="mode-options" style="width:100%;">
                          <div class="mode-option" @click="modeChoose('random')">Randomly</div>
                          <div class="mode-option" @click="modeChoose('equal')">Equally</div>
                        </div>
                      </div>
                      <p>Shared among</p>
                    </div>
                    <div class="share-number">
                      <div class="share-input-div">
                        <input v-model="redpacket.split" id="red-packet-share" class="shares-input" autocomplete="off" placeholder="0"
                          type="number" autocorrect="off" inputmode="decimal" pattern="^[0-9]$" spellcheck="false">
                      </div>
                      <p>People</p>
                    </div>
                  </div>
                </div>
                <div class="token-list gas-station">
                  <div class="enable-switch">
                    <p>Pay service fee for your claimers</p>
                    <a-switch style="margin-left: 1rem; height: 25px; width: 45px;" v-model:checked="enableGas" />
                  </div>
                  <div class="gas-estimation-parent">
                    <div class="gas-estimation">
                      <p>
                        <img style="width: 20px; height: 20px;" src="https://i.postimg.cc/RhXfgJR1/gas-pump.png"/>
                        Service Fee: XXXXXX
                      </p>
                      <div class="total-choose-token">
                        <div class="token-select">
                          <div class="mode-dropdown" :class="chooseGasDrop && 'active'" @click.stop="chooseGasDrop = !chooseGasDrop;" v-on-click-outside.bubble="chooseGasHandle">
                            <div class="token-icon">
                              <img :src="redpacket.gasToken.metadata.logoURI" />
                            </div>
                            <div class="mode-text2">{{ redpacket.gasToken.metadata.symbol }}</div>
                            <input class="mode-input" type="text" placeholder="select" readonly>
                            <div class="mode-options">
                              <div class="mode-option" v-for="(token, index) of tokens" :key="index"
                                @click="tokenChoose('gas', token)">
                                <div class="token-icon">
                                  <img :src="token.metadata.logoURI" />
                                </div>
                                <div style="display: flex; flex-direction: column; align-items: flex-start;">
                                  <b>{{ token.metadata.symbol }}</b>
                                  <div style="margin-right:0.5rem;">{{ token.balance?.normalized }} available</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="tooltip fade" data-title="Hypertext Markup Language">
                        <svg style="margin-left: 1rem; width: 16px;" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z"
                            stroke="#898989" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M11 15V11" stroke="#898989" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M11 8V7" stroke="#898989" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </div>
                      
                    </div>
                  </div>
                </div>
                <div class="choose-account">
                  <div class="HexlinkAccount">
                    <div style="position: relative; top: 35px; left: -10px; display: flex; justify-content: flex-end; z-index: 50;">
                      <img style="width: 20px; height: 20px; opacity:1;" src="https://i.postimg.cc/SRjdzYHP/check.png" />
                    </div>
                    <!-- <div class="checked-wrapper" style="position: relative; top: -13px; left: 25px;">Hello</div> -->
                    <div style="box-shadow: 8px 28px 50px rgb(39 44 49 / 7%), 1px 6px 12px rgb(39 44 49 / 4%); transform: translate3D(0, -1px, 0) scale(1.02); transition: all 0.2s ease; border: 2px solid #4BAE4F;" 
                      class="account-card"
                    >
                      <div class="left">
                        <div>
                          <img class="wallet-image" src="https://i.postimg.cc/kXgZCB4L/hexlink.png">
                          <div class="chain_wrapper">
                            <img class="chain" :src="useNetworkStore().network.logoUrl" />
                          </div>
                        </div>
                      </div>
                      <div class="right">
                        <div style="min-width: 100px; margin-left: 0.5rem;">
                          <h2>Hexlink</h2>
                          <p>Available Balance</p>
                        </div>
                        <div class="balances">
                          <span style="display: flex; align-items: center; margin-bottom: 5px;">
                            <a-tooltip placement="top">
                              <template #title>
                                <span>
                                  Balance: 
                                  <b>{{ tokenBalance?.normalized }}</b> 
                                  <copy-outlined style="margin-left: 0.5rem; margin-right: 0.5rem;" @click="copy(String(tokenBalance?.normalized))"/>
                                </span>
                              </template>
                              <span class="balance_item">
                                <p style="font-weight:600; display: flex; justify-content: flex-end;">
                                  {{ tokenBalance?.normalized.toString().substring(0,6) }}
                                </p>
                              </span>
                            </a-tooltip>
                            <img style="width:20px; height: 20px; margin-left: 5px; margin-right: 5px;" :src="redpacket.token.metadata.logoURI" />
                            <span style="font-size: 12px;"><b>{{ redpacket.token.metadata.symbol }}</b></span>
                          </span>
                          <!-- gas -->
                          <span v-if="showGasToken()" style="display: flex; align-items: center;">
                            <a-tooltip placement="bottom">
                              <template #title>
                                <span>
                                  Balance: 
                                  <b>{{ gasTokenBalance?.normalized }}</b>
                                  <copy-outlined style="margin-left: 0.5rem; margin-right: 0.5rem;" @click="copy(String(gasTokenBalance?.normalized))" />
                                </span>
                              </template>
                              <span class="balance_item">
                                <p style="font-weight:600; display: flex; justify-content: flex-end;">
                                  {{ gasTokenBalance?.normalized.toString().substring(0, 6) }}
                                </p>
                              </span>
                            </a-tooltip>
                            <img style="width:20px; height: 20px; margin-left: 5px; margin-right: 5px;" :src="redpacket.gasToken.metadata.logoURI" />
                            <span style="font-size: 12px;"><b>{{ redpacket.gasToken.metadata.symbol }}</b></span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="ExternalAccount">
                    <div style="position: relative; top: 35px; left: -10px; display: flex; justify-content: flex-end; z-index: 50;">
                      <img :style="accountChosen == 1 ? 'opacity: 1' : 'opacity: 0' " style="width: 20px; height: 20px;" src="https://i.postimg.cc/SRjdzYHP/check.png"/>
                    </div>
                    <!-- <div class="checked-wrapper" style="position: relative; top: -13px; left: 25px;">Hello</div> -->
                    <div :style="accountChosen == 1 && 'box-shadow: 8px 28px 50px rgb(39 44 49 / 7%), 1px 6px 12px rgb(39 44 49 / 4%); transform: translate3D(0, -1px, 0) scale(1.02); transition: all 0.2s ease; border: 2px solid #4BAE4F;'" 
                      class="account-card" 
                      @click="chooseAccount()"
                    >
                      <div class="left">
                        <div>
                          <img class="wallet-image" :src="useWalletStore().wallet?.walletIcon">
                          <div class="chain_wrapper">
                            <img class="chain" :src="useNetworkStore().network.logoUrl" />
                          </div>
                        </div>
                      </div>
                      <div class="right">
                        <div style="min-width: 100px; margin-left: 0.5rem;">
                          <h2>Metamask</h2>
                          <p>Available Balance</p>
                        </div>
                        <div class="balances">
                          <span style="display: flex; align-items: center; margin-bottom: 5px;">
                            <a-tooltip placement="top">
                              <template #title>
                                <span>
                                  Balance: 
                                  <b>{{ eoaTokenBalance?.normalized }}</b>
                                  <copy-outlined style="margin-left: 0.5rem; margin-right: 0.5rem;" @click="copy(String(eoaTokenBalance?.normalized))" />
                                </span>
                              </template>
                              <span class="balance_item">
                                <p style="font-weight:600; display: flex; justify-content: flex-end;">
                                  {{ eoaTokenBalance?.normalized.toString().substring(0, 6) }}
                                </p>
                              </span>
                            </a-tooltip>
                            <img style="width:20px; height: 20px; margin-left: 5px; margin-right: 5px;" :src="redpacket.token.metadata.logoURI" />
                            <span style="font-size: 12px;"><b>{{ redpacket.token.metadata.symbol }}</b></span>
                          </span>
                          <!-- gas -->
                          <span v-if="showGasToken()" style="display: flex; align-items: center;">
                            <a-tooltip placement="bottom">
                              <template #title>
                                <span>
                                  Balance: 
                                  <b>{{ eoaGasTokenBalance?.normalized }}</b>
                                  <copy-outlined style="margin-left: 0.5rem; margin-right: 0.5rem;" @click="copy(String(eoaGasTokenBalance?.normalized))" />
                                </span>
                              </template>
                              <span class="balance_item">
                                <p style="font-weight:600; display: flex; justify-content: flex-end;">
                                  {{eoaGasTokenBalance?.normalized.toString().substring(0,6) }}
                                </p>
                              </span>
                            </a-tooltip>
                            <img style="width:20px; height: 20px; margin-left: 5px; margin-right: 5px;" :src="redpacket.gasToken.metadata.logoURI" />
                            <span style="font-size: 12px;"><b>{{ redpacket.gasToken.metadata.symbol }}</b></span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="create">
                  <button class="connect-wallet-button" @click="modal = true" style="width: auto;">
                    <svg style="margin-right: 10px;" width="18" height="18" viewBox="0 0 18 18" fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M16 2.50025V3.51125C16.5304 3.51125 17.0391 3.72196 17.4142 4.09703C17.7893 4.47211 18 4.98081 18 5.51125V15.5112C18 16.0416 17.7893 16.5504 17.4142 16.9254C17.0391 17.3005 16.5304 17.5112 16 17.5112H2C1.46957 17.5112 0.96086 17.3005 0.58579 16.9254C0.21071 16.5504 0 16.0416 0 15.5112V5.51125C0 4.46625 0.835 3.51825 1.813 3.23925L12.813 0.0962511C13.1851 -0.0100989 13.5768 -0.0286089 13.9573 0.0421711C14.3377 0.112951 14.6966 0.271091 15.0055 0.504141C15.3145 0.737191 15.5651 1.03878 15.7377 1.38516C15.9102 1.73154 16 2.11326 16 2.50025ZM12.5 9.01123C12.1022 9.01123 11.7206 9.16933 11.4393 9.45063C11.158 9.73193 11 10.1134 11 10.5112C11 10.909 11.158 11.2906 11.4393 11.5719C11.7206 11.8532 12.1022 12.0112 12.5 12.0112C12.8978 12.0112 13.2794 11.8532 13.5607 11.5719C13.842 11.2906 14 10.909 14 10.5112C14 10.1134 13.842 9.73193 13.5607 9.45063C13.2794 9.16933 12.8978 9.01123 12.5 9.01123ZM14 2.50025C14.0001 2.42966 13.9852 2.35986 13.9563 2.29544C13.9274 2.23102 13.8853 2.17345 13.8326 2.1265C13.7798 2.07955 13.7178 2.04429 13.6505 2.02305C13.5832 2.00181 13.5121 1.99506 13.442 2.00325L13.362 2.01925L8.14 3.51125H14V2.50025Z"
                        fill="white" />
                    </svg>
                    Create Red Packet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="modal" ref="modalRef" class="confirmation">
        <button class="close-button" title="Close" @click="modal = false">
          𝖷
        </button>
      </div>
    </div>
  </layout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import Layout from "../components/Layout.vue";
import { connectWallet, disconnectWallet } from "@/services/web3/wallet";
import { updateProfileBalances, updateWalletBalances } from "@/services/web3/tokens";
import { useProfileStore } from '@/stores/profile';
import { useWalletStore } from '@/stores/wallet';
import { BigNumber } from "bignumber.js";
import { useNetworkStore } from '@/stores/network';
import type { OnClickOutsideHandler } from '@vueuse/core'
import { onClickOutside } from '@vueuse/core'
import { vOnClickOutside } from '@/services/directive';
import type { Token } from "@/types";
import useClipboard from 'vue-clipboard3';
import { createToaster } from "@meforma/vue-toaster";
import { normalizeBalance } from '@/services/web3/tokens';
import { CopyOutlined } from '@ant-design/icons-vue';

interface RedPacket {
  mode: "random" | "equal";
  split: Number,
  balance: BigNumber | undefined,
  token: Token,
  gasToken: Token,
  expiredAt: Number,
}

const sendLuck = ref<boolean>(false);
const luckHistory = ref<boolean>(true);
const openDropdown = ref<boolean>(false);
const chooseTotalDrop = ref<boolean>(false);
const chooseGasDrop = ref<boolean>(false);
const enableGas = ref<boolean>(false);
const accountChosen = ref<number>(0);
const modal = ref<boolean>(false);
const modalRef = ref<any>(null);

const { toClipboard } = useClipboard()
const nativeToken = useProfileStore().nativeToken;

const tokens = ref<Token[]>([]);
const redpacket = ref<RedPacket>({
  mode: "random",
  split: 0,
  balance: BigNumber(0),
  token: nativeToken,
  gasToken: nativeToken,
  expiredAt: 0 // do not expire
});

const genLocalTokens = function() : Token[] {
  // merge balances
  if (accountChosen.value) {
    const profileTokens = useProfileStore().profile.tokens;
    const walletTokenBalances = useWalletStore().balances;
    return Object.values(profileTokens).map(token => {
      const address = token.metadata.address.toLowerCase();
      const decimals = token.metadata.decimals;
      const defaultBalance = new BigNumber(0);
      const walletBalance = walletTokenBalances[address]?.value || defaultBalance;
      const profileBalance = profileTokens[address].balance?.value || defaultBalance;
      const newBalance = walletBalance.plus(profileBalance);
      return {
        metadata: token.metadata,
        balance: normalizeBalance(newBalance, decimals)
      }
    }).filter(t => t.balance.value.gt(0));
  } else {    
    // construct new token list so it's not affecting the store
    return useProfileStore().feasibleTokens.map(t => ({
      metadata: t.metadata,
      balance: normalizeBalance(
        new BigNumber(t.balance?.value || 0),
        t.metadata.decimals
      )
    }))
  }
}

function defaultToken(token: Token) {
  return {
    metadata: token.metadata,
    balance: normalizeBalance(
      new BigNumber(0),
      token.metadata.decimals
    )
  };
}

const refresh = async function() {
  if (useProfileStore().profile?.initiated) {
    await updateProfileBalances();
    if (useWalletStore().connected) {
      await updateWalletBalances();
    }
    tokens.value = genLocalTokens();

    // set default token
    const nativeCoinAddr = useNetworkStore().nativeCoinAddress;
    const nativeToken = tokens.value.find(
      t => t.metadata.address == nativeCoinAddr
    ) || defaultToken(useProfileStore().nativeToken);
    const toSelect = Object.values(tokens.value);
    if (nativeToken.balance?.value.gt(0) || toSelect.length == 0) {
      redpacket.value.token = nativeToken!;
      redpacket.value.gasToken = nativeToken!;
    } else {
      redpacket.value.token = toSelect[0];
      redpacket.value.gasToken = toSelect[0];
    }
  }
}

const tokenChoose = (mode: "token" | "gas", token: Token) => {
  if (mode === "token") {
    redpacket.value.token = token;
  } else {
    redpacket.value.gasToken = token;
  }
}

const chooseAccount = function() {
  if (accountChosen.value == 0) {
    accountChosen.value = 1;
  } else {
    accountChosen.value = 0;
  }
  tokens.value = genLocalTokens();

  // reset redpacket token balance
  const token = tokens.value.find(
    t => t.metadata.address == redpacket.value.token.metadata.address
  );
  if (token?.balance) {
    redpacket.value.token.balance = token.balance;
  } else {
    redpacket.value.token = defaultToken(redpacket.value.token as Token);
  }

  // reset redpacket gas token balance
  const gasToken = tokens.value.find(
    t => t.metadata.address == redpacket.value.gasToken.metadata.address
  );
  if (gasToken?.balance) {
    redpacket.value.gasToken.balance = gasToken.balance;
  } else {
    redpacket.value.gasToken = defaultToken(redpacket.value.gasToken as Token);
  }
}

const tokenBalance = computed(() => {
  return useProfileStore().balance(
    redpacket.value.token.metadata.address.toLowerCase()
  );
});

const gasTokenBalance = computed(() => {
  return useProfileStore().balance(
    redpacket.value.gasToken.metadata.address.toLowerCase()
  );
});

const eoaTokenBalance = computed(() => {
  return useWalletStore().balance(
    redpacket.value.token.metadata.address.toLowerCase()
  );
});

const eoaGasTokenBalance = computed(() => {
  return useWalletStore().balance(
    redpacket.value.gasToken.metadata.address.toLowerCase()
  );
});

onMounted(refresh);
watch(() => useNetworkStore().network, refresh);

onClickOutside(
  modalRef,
  (event) => {
    console.log(event)
    modal.value = false
  },
);

const connectOrDisconnectWallet = async function () {
  if (walletStore.connected) {
    await disconnectWallet();
  } else {
    if (typeof window.ethereum == 'undefined') {
      console.log('MetaMask is not installed!');
    }
    await connectWallet();
  }
};

const modeLabels = {
  "random": "Randomly",
  "equal": "Equally",
};

const modes = ["random", "equal", "what"];

const modeChoose = (gameMode: "random" | "equal") => {
  redpacket.value.mode = gameMode;
}

const createRedPacket = async function () {

};

const showGasToken = () => {
  const token = redpacket.value.token.metadata.address;
  const gasToken = redpacket.value.gasToken.metadata.address;
  if (token.toLowerCase() == gasToken.toLowerCase()) return false;
  return true;
}

const walletStore = useWalletStore();
if (walletStore.connected) {
  walletStore.wallet;
}

const setMaxAmount = () => {
  redpacket.value.balance = redpacket.value.token.balance?.normalized;
  // TODO Need to put out gas fee from the total amount
}

const showAvailableBalance = (hexlinkValue: BigNumber | undefined, externalValue: BigNumber) => {
  // if external not chosen, return hexlinkValue
  // if external is chosen, return hexlinValue + externalValue
  return hexlinkValue;
}

const chooseTotalHandle: OnClickOutsideHandler = (event) => {
  chooseTotalDrop.value = false; }
const dropdownHandle: OnClickOutsideHandler = (event) => {
  openDropdown.value = false; }
const chooseGasHandle: OnClickOutsideHandler = (event) => {
  chooseGasDrop.value = false; }

const copy = async (text: string) => {
  try {
    await toClipboard(text);
    const toaster = createToaster({ position: "top", duration: 2000 });
    toaster.success(`Copied`);
  } catch (e) {
    console.error(e)
    const toaster = createToaster({ position: "top", duration: 2000 });
    toaster.error(`Can not copy`);
  }
}
</script>

<style lang="less" scoped>
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
.confirmation {
  background-color: white;
  position: fixed;
  left: 55%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 40vh;
  max-width: 90vw;
  z-index: 60;
  border-radius: 15px;
  box-shadow: 0px 10px 20px rgb(0 0 0 / 10%);
  @media (max-width: 990px) {
    left: 50%;
  }
}
.close-button {
  padding: 0.25em 0.7em 0.2em;
  position: absolute;
  top: -0.9rem;
  right: -0.5rem;
  font-weight: 700;
  background-color: #308AF5;
  border: none;
  outline: none;
  color: #fff;
  margin: 0.5rem 0;
  border-bottom: 2px solid #076AE0;
  text-shadow: 1px 1px 1px #1D4ED8;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  vertical-align: middle;
  cursor: pointer;
}

.token-available-balance {
  font-size: 13px;
  line-height: 18px;
  color: rgb(118, 127, 141);
  white-space: nowrap;
  font-weight: 400;
  margin: 0px;
  display: flex;
  align-items: center;
}
.balance-amount {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: rgb(7, 16, 27);
  line-height: 20px;
  font-weight: 700;
  margin-left: 4px;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
.balance-token-name {
  @media (max-width: 990px) {
    display: none; } }
.chain_wrapper {
  width: 15px;
  height: 15px;
  background-color: #f2f2f2;
  border-radius: 100%;
  position: relative;
  top: -13px;
  left: 25px; }
  .chain_wrapper .chain {
    width:15px;
    height: 15px;
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto auto; }
.account-card {
  background-color: #fff;
	box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
	border-radius: 15px;
	display: flex;
	flex-direction: row;
	padding: 30px;
	max-width: 400px;
	min-height: 130px;
	margin: 20px;
  margin-right: 1rem;
	transition: all 0.2s ease; }
.account-card:hover {
  box-shadow: 8px 28px 50px rgba(39, 44, 49, 0.07),
		1px 6px 12px rgba(39, 44, 49, 0.04);
	transform: translate3D(0, -1px, 0) scale(1.02);
	transition: all 0.2s ease; }
.left {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  margin-top: 10px; }
.right {
  display: flex;
  align-items: center;
  h2 {
    font-weight: 500;
    font-size: 16px;
    margin: 3px 0; }
  p {
    font-size: 12px;
    color: black;
    margin-bottom: 0rem; }
  .balances {
    display: flex;
    flex-direction: column; } }
.balance_item {
  width: 4rem;
  overflow: auto;
  white-space: nowrap;
  // padding-left: 10px;
  line-height: 30px;

  p {
    margin-bottom: 0rem;
    overflow: auto;
    font-size: 14px;
  }
}
.wallet-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  object-position: 50% 50%; }
.content-body {
  margin-left: 9.5rem;
}

@media only screen and (max-width: 990px) {
  .content-body {
    margin-left: 0px;
    margin-bottom: 50px;
  }
}

.wallet-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px;
  margin-top: 1rem;
}

.connect-wallet-button {
  display: flex;
  justify-content: center;
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
  border-radius: 50px;

  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    width: 200px;
  }

  @media (min-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    width: 200px;
  }

  opacity: 1;
  background-color: rgb(7, 106, 224);
  color: white;
}

.connection-status {
  display: flex;

  p {
    margin-right: 1rem;
    margin-bottom: 0rem;
  }
}

.checkmark {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px #7ac142;
  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
}

.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #7ac142;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark__check .animateElement {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes scale {

  0%,
  100% {
    transform: none;
  }

  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}

@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 30px #7ac142;
  }
}

.crossmark {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  stroke-width: 2;
  stroke: #ff0000;
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px #ff0000;
  animation: fillred .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
}

.crossmark__circle.animateElement {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #ff0000;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.cross__path {
  stroke: #ffffff;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  transform-origin: 50% 50% 0;
}

.cross__path--right {
  animation: 0.3s ease 0.8s normal forwards 1 running stroke;
}

.cross__path--left {
  animation: 1s ease 0.8s normal forwards 1 running stroke;
}

@keyframes fillred {
  100% {
    box-shadow: inset 0px 0px 0px 30px #ff0000;
  }
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  height: calc(100% - 30px);
  margin-bottom: 1.875rem;
  transition: all .5s ease-in-out;
  border: 0px solid transparent;
  border-radius: 1rem;
  box-shadow: 0px 5px 5px 0px rgba(82, 63, 105, 0.05);
}

.card-body {
  flex: 1 1 auto;
  padding: 20px;
  background: transparent;
  border-radius: 15px;
}

@media only screen and (max-width: 575px) {
  .card {
    margin-bottom: 0.938rem;
    height: calc(100% - 0.938rem);
  }

  .card-body {
    padding: 1rem;
  }
}

.token-list {
  display: grid;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;

  @media (min-width: 640px) {
    display: flex;
  }
}

.token-list .title {
  display: grid;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;

  @media (min-width: 640px) {
    display: flex;
  }
}

.token-list .title .title-col {
  display: flex;
  justify-content: space-between;
  grid-column: span 4 / span 4;
}

.token-list .title .title-col .content {
  display: flex;
  margin-left: 0.75rem;
  margin-left: 0.875rem;
  align-items: center;
}

.token-list .title .title-col .content .text {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;

  @media (max-width: 768px) {
    width: 9rem;
  }
}

.token-list .title .title-col .content svg {
  display: inline-flex;
  transition-property: background-color, border-color, color, fill, stroke;
  justify-content: center;
  align-items: center;
  width: 1rem;
  height: 1rem;
  margin-left: 0.75rem;
}

.token-list .views {
  margin-top: 0.75rem;
  grid-column: span 4 / span 4;

  @media (min-width: 640px) {
    display: flex;
    margin-top: 0;
  }
}

.token-list .views .detail-view {
  display: flex;
  padding: 0.125rem;
  transition-property: background-color, border-color, color, fill, stroke;
  border-radius: 50px;
  border-style: solid;
  border-width: 1px;
  border-color: rgb(71, 85, 105);

  @media (min-width: 640px) {
    margin-left: 0.75rem;
    margin-left: 0.875rem;
    max-width: 28rem;
  }
}

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
  border-radius: 50px;

  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    width: 150px;
  }
}

.token-list .views .detail-view .listView-button {
  opacity: 1;
  background-color: rgba(7, 106, 224, 0);
  color: rgb(71, 85, 105);
}

.token-list .views .detail-view .listView-button.show {
  opacity: 1;
  background-color: rgb(7, 106, 224);
  color: white;
}

.red-packet {
  visibility: visible;
  height: auto;
  display: block;
  padding: 0px;
}

.red-packet .mode-and-share {
  display: flex;
  gap: 16px;
  margin: 16px;

  @media (max-width: 640px) {
    margin-left: 0rem;
    margin-right: 0rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.red-packet .mode-and-share .game-mode {
  display: flex;
  flex: 1 1 10%;

  p {
    display: flex;
    align-items: center;
    margin-left: 1rem;
    margin-bottom: 0rem;
    font-weight: 600;
    line-height: 1.5;
    font-size: 16px;

    @media (max-width: 640px) {
      font-size: 14px;
      font-weight: 500;
    }
  }
}

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
  overflow: unset !important;
}

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
  z-index: 45;
  transition: 0.5s;
  pointer-events: none;
}

.mode-dropdown.active::before {
  top: 19px;
  transform: rotate(-225deg);
}

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
  width: 100%;
}

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
  margin-right: 1.5rem;
}

.mode-input {
  bottom: 0px;
  left: 0px;
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 100%;
  box-sizing: border-box;
}

.mode-drop-tri {
  font-size: 0px;
  display: inline-block;
  background-repeat: no-repeat;
  background-position: center center;
  flex-shrink: 0;
  aspect-ratio: 1 / 1;
  position: absolute;
  right: 7px;
  pointer-events: none;
  width: 22.5px;
  height: 22.5px;
  top: calc(50% - 11.25px);
  color: rgb(118, 127, 141);
  font-weight: 400;
  line-height: 1.4375em;
  cursor: text;
}

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

    @media (max-width: 640px) {
      font-size: 14px;
      font-weight: 400;
    }
  }
}

.red-packet .mode-and-share .share-number {
  flex: 1 1 0%;
  display: flex;

  p {
    margin-left: 1rem;
    margin-right: 0rem;
    margin-bottom: 0rem;
    font-weight: 600;
    line-height: 1.5;
    font-size: 16px;
    display: flex;
    align-items: center;

    @media (max-width: 640px) {
      font-size: 14px;
      font-weight: 500;
    }
  }
}

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
  width: 100%;
}

.red-packet .total-amount {
  display: flex;
  gap: 16px;
  margin: 16px;

  @media (max-width: 640px) {
    margin-left: 0rem;
    margin-right: 0rem;
  }
}

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
  overflow: unset !important;
}

.total-amount-text {
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  color: rgb(118, 127, 141);
  white-space: nowrap;
  margin-bottom: 0rem;
  position: absolute;
  top: 10px;
  left: 12px;
}

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
  width: 100%;
}

.red-packet .total-amount .box .input-info-show {
  display: flex;
  flex: 1 1 0%;
  height: 100%;
  flex-direction: column;
  align-items: flex-end;
  row-gap: 4px;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4375em;
  color: rgb(7, 16, 27);
  cursor: text;

  .available-balance {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    font-size: 13px;
    line-height: 18px;
    color: rgb(118, 127, 141);
    white-space: nowrap;
    margin: 0px;
    font-weight: 400;

    span {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      color: rgb(7, 16, 27);
      line-height: 18px;
      font-weight: 700;
      margin-left: 4px;
      margin: 0px;
      font-size: 14px;
    }
  }

  .total-choose-token {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.4375em;
    color: rgb(7, 16, 27);
    cursor: text;
  }
}

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
    font-weight: 400;
  }

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
    -webkit-tap-highlight-color: transparent;
  }
}

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

  .token-icon {
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    margin-right: 0.5rem;
    margin-left: 0.5rem;
  }

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
    -webkit-tap-highlight-color: transparent;
  }

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
    user-select: none;
  }
}

input:focus {
  outline: none;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

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
  display: none;
}

.mode-dropdown.active .mode-options {
  display: block;
  z-index: 60;
}

.mode-option {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
}

.mode-option:hover {
  background: rgb(242, 246, 250);
  color: #999;
}

.token-wallet-icon {
  margin-left: 4px;
  font-size: 18px;
  margin-top: 0px;
  margin-bottom: 0px;
  background-size: cover;
  width: 20px;
  height: 20px;
  color: rgb(7, 16, 27) !important;
  margin-right: 0px !important;
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 1;
  overflow: hidden;
  user-select: none;
  background-color: rgb(255, 255, 255);
  font-weight: 700;
}

.submit-redPacket-grey {
  display: flex;
  justify-content: center;
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
  border-radius: 50px;

  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    width: 200px;
  }

  @media (min-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    width: 200px;
  }

  opacity: 1;
  background-color: #999;
  color: white;
}

.submit-redPacket-blue {
  display: flex;
  justify-content: center;
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
  border-radius: 50px;

  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    width: 200px;
  }

  @media (min-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    width: 200px;
  }

  opacity: 1;
  background-color: rgb(7, 106, 224);
  color: white;
}

.red-packet-model {
  margin: 16px;
}

.gas-station {
  display: flex;
  margin: 16px;
  justify-content: space-between;
}

.create {
  display: flex;
  margin: 16px;
  flex-direction: row-reverse;
}
.choose-account {
  display: flex;
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
    margin-left: 0.75rem; }
  @media (max-width: 768px) {
    flex-direction: column; } }
.gas-estimation-parent {
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end; }
}
.gas-estimation {
  display: flex;
  // align-items: center;
  p {
    margin-bottom: 0rem;
    margin-right: 1rem;
    font-weight: 500;
  }
}

.connectWallet {
  display: flex;
  width: 100%;
  height: 500px;
  align-items: center;
  justify-content: center;
}

.sent-history {
  display: flex;
  width: 100%;
  height: 500px;
  justify-content: center;
  align-items: center;
}
.enable-switch {
  display: flex;
  align-items: center;
  p {
    margin-bottom: 0rem;
    font-weight: 500; }
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end; } }

.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }

  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }

  .ant-modal-body {
    flex: 1;
  }
}
</style>