<template>
  <div style="display: flex; flex-wrap: wrap;">
    <div style="display: flex; flex-direction: column; align-items: center;">
      <!-- account balance and title -->
      <div class="col-xxl-6">
        <div class="token-worth">
          <div>
            <div class="title">
              <span>Token Worth</span>
            </div>
            <div class="price">${{ price }}</div>
            <div style="display: flex; margin-top: 1rem; margin-bottom: 1rem;">
              <button class="cta-button" @click="open('send')">
                <img src="@/assets/svg/send.svg" style="margin-right: 5px;" alt="send icon" />
                Send
              </button>
              <button class="cta-button" @click="open('receive')">
                <img src="@/assets/svg/qrCode.svg" style="margin-right: 5px;" alt="qrcode icon" />
                Receive
              </button>
              <Teleport to="#modal">
                <div class="modal-bg" v-if="action == 'send'">
                  <div class="claim-card transition">
                    <img @click="action = ''" class="redpacket_close transition" src="@/assets/svg/closeButton.svg" alt="close button" />
                    <SendTokenModal @closeModal="closeModal"/>
                  </div>
                </div>
                <div class="modal-bg" v-if="action == 'receive'">
                  <div class="receive-card transition">
                    <img @click="action = ''" class="redpacket_close transition" src="@/assets/svg/closeButton.svg" alt="close button" />
                    <ReceiveToken />
                  </div>
                </div>
              </Teleport>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xxl-6" style="width: 90vw; max-width: 700px;">
        <div class="card">
          <div class="card-body">
            <div class="token-list">
              <div class="title">
                <div class="title-col">
                  <div class="content">
                    <div class="text">Assets</div>
                    <img src="@/assets/svg/colon.svg" alt="colon icon"/>
                  </div>
                </div>
              </div>
            </div>
            <div class="token-listDetail">
              <div class="token-table">
                <div style="overflow: visible; border-radius: 0.75rem;">
                  <WalletTokenList></WalletTokenList>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import WalletTokenList from "@/components/WalletTokenList.vue";
import { BigNumber } from "bignumber.js";
import { useWalletStore } from "@/stores/wallet";
import { connectWallet } from "@/web3/wallet";
import SendTokenModal from '@/components/SendTokenModal.vue';
import ReceiveToken from '@/components/ReceiveToken.vue';
import { genDeployAuthProof } from "@/web3/auth";

const openModal = ref<boolean>(false);
const action = ref<string>("");

const price = computed(() => {
  return BigNumber(0);
});

const open = async (mode: string) => {
  action.value = mode;
}

const closeModal = (variable: boolean) => {
  action.value = "";
}
</script>

<style lang="less" scoped>
.receive-card {
  background-color: #fffc;
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  height: auto;
  width: 90vw;
  max-width: 400px;
  position: fixed;
  margin: auto;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  box-shadow: 0 3.3px 2.7px rgba(0,0,0,.03),0 8.3px 6.9px rgba(0,0,0,.04),0 17px 14.2px rgba(0,0,0,.05),0 35px 29.2px rgba(0,0,0,.06),0 96px 80px rgba(0,0,0,.07);
  border-radius: 1rem;
  overflow: visible;
  z-index: 55;
  @media (max-width: 990px) {
    top: 47vh;
    left: 50%; } }
.claim-card {
  background-color: #fffc;
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  height: 425px;
  width: 90vw;
  max-width: 400px;
  position: fixed;
  margin: auto;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  box-shadow: 0 3.3px 2.7px rgba(0,0,0,.03),0 8.3px 6.9px rgba(0,0,0,.04),0 17px 14.2px rgba(0,0,0,.05),0 35px 29.2px rgba(0,0,0,.06),0 96px 80px rgba(0,0,0,.07);
  border-radius: 1rem;
  overflow: visible;
  z-index: 55;
  @media (max-width: 990px) {
    top: 50vh;
    left: 50%; } }
.redpacket_close {
  position: absolute;
  z-index: 50;
  margin: 0.75rem 0.25rem;
  right: 0.5rem; }
.transition {
  transition: .3s cubic-bezier(.3, 0, 0, 1.3) }
.modal-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #b3b5b799;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  overflow: hidden; }
.content-body {
  margin-left: 9.5rem; }
@media only screen and (max-width: 990px) {
  .content-body {
    margin-left: 0px;
    margin-bottom: 50px; } }
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem; }
.card>hr {
  margin-right: 0;
  margin-left: 0; } 
.card>.list-group {
  border-top: inherit;
  border-bottom: inherit; }
.card>.list-group:first-child {
  border-top-width: 0;
  border-top-left-radius: calc(0.25rem - 1px);
  border-top-right-radius: calc(0.25rem - 1px); }
.card>.list-group:last-child {
  border-bottom-width: 0;
  border-bottom-right-radius: calc(0.25rem - 1px);
  border-bottom-left-radius: calc(0.25rem - 1px); }
.card>.card-header+.list-group,
.card>.list-group+.card-footer {
  border-top: 0; }
.card {
  margin-bottom: 30px;
  height: calc(100% - 30px);
  border: 0;
  box-shadow: 0px 0px 40px 0px rgba(82, 63, 105, 0.12); }
.card.h-unset {
  height: unset; }
.card.no-shadow {
  box-shadow: 0 0.75rem 1.5rem rgba(68, 63, 75, 0.1); }
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f1f1;
  background: transparent;
  padding: 20px; }
.card-title {
  font-size: 16px;
  margin-bottom: 0px;
  color: #495057;
  font-weight: 600; }
.card .card-body {
  padding: 20px;
  background: transparent;
  border-radius: 15px; }
.card .card-footer {
  padding: 20px;
  background: #fff; }
.card-body {
  flex: 1 1 auto;
  padding: 1rem 1rem; }
.invite-content .input-group-text {
  background: #556ee6;
  color: #fff; }
.card {
  margin-bottom: 1.875rem;
  background-color: #fff;
  transition: all .5s ease-in-out;
  position: relative;
  border: 0px solid transparent;
  border-radius: 1rem;
  box-shadow: 0px 5px 5px 0px rgba(82, 63, 105, 0.05);
  height: calc(100% - 30px); }
@media only screen and (max-width: 575px) {
  .card {
    margin-bottom: 0.938rem;
    height: calc(100% - 0.938rem); } }
.card-body {
  padding: 1.875rem; }
@media only screen and (max-width: 575px) {
  .card-body {
    padding: 1rem; } }

.dashboard-header {
  flex: 1;
  display: inline-block;
  width: 100%;
  background-color: var(--white);
  border-radius: var(--radius-large);
  border: 1px solid var(--fade-grey-dark-3);
  transition: all .3s;
  display: flex;
  align-items: center;
  padding: 20px; }
  .dashboard-header .profile-pic {
    position: relative;
    display: inline-block;
    vertical-align: bottom;
    max-width: 80px;
    min-width: 80px;
    max-height: 80px; }
    .dashboard-header .profile-pic img {
      border-radius: 50px;
      height: 80px;
      width: 80px;
    }
  .dashboard-header .welcome {
    padding: 0 2rem; }
    .dashboard-header .welcome .title {
      font-size: 1rem;
      margin-bottom: 0;
      font-weight: 500; }
    .dashboard-header .welcome .sub-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
      padding: 0;
      color: black; }
  .dashboard-header .user-balance {
    padding: 0 2rem; }
    .dashboard-header .user-balance .title {
      font-size: 1rem;
      margin-bottom: 0;
      font-weight: 500; }
    .dashboard-header .user-balance .sub-title {
      font-size: 2rem;
      font-weight: 600;
      margin: 0;
      padding: 0;
      color: black; }
.cta {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 23px;
  height: 23px;
  margin-left: 20px;
  background: white;
  border-radius: 6px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
  @media only screen and (max-width: 767px) {
    margin-left: 0;
  } }
  .cta .cta-title {
    display: flex; }
    .cta .cta-title svg {
      width: 15px;
      opacity: .8; }
    .cta .cta-title .white-text {
      color: #fff;
      line-height: 1.5;
      font-size: 1em;
      font-weight: 300;
      margin: 0;
      padding: 0; }
  .cta .cta-link {
    display: block;
    font-weight: 500;
    margin-top: 0.5rem;
    cursor: pointer;
    text-decoration: none;
    line-height: 1.5;
    font-size: 1em;
    color: hsl(0 0% 99%); }
.token-worth {
  display: flex;
  flex-direction: row;
  padding: 16px 16px 16px 6px;
  border-radius: 5px;
  width: 100%;
  min-height: 70px;
  justify-content: center;
  align-items: center;
  @media (min-width: 640px) {
    padding: 16px 16px 16px 25px; } }
  .token-worth .title {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-direction: row;
    font-size: 1rem;
    line-height: 1.33;
    color: rgb(138, 147, 165);
    margin-bottom: 4px; }
  .token-worth .price {
    font-family: "sfpro-heavy";
    display: flex;
    justify-content: center;
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.33;
    color: black;
    margin-right: auto;
    word-break: keep-all; }
.token-list {
  display: grid;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  @media (min-width: 640px) {
    display: flex; } }
  .token-list .title {
    display: grid;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.75rem;
    @media (max-width: 640px) {
      display: none; } }
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
          font-weight: 600; }
        .token-list .title .title-col .content img {
          display: inline-flex;
          transition-property: background-color, border-color, color, fill, stroke;
          justify-content: center;
          align-items: center;
          width: 1rem;
          height: 1rem;
          margin-left: 0.75rem; }
.token-listDetail {
  border-radius: 0.75rem;
  margin-top: 1.75rem; }
  .token-listDetail .token-table {
    display: flex;
    margin-left: -1rem;
    margin-right: -1rem;
    flex-direction: column;
  
    @media (min-width: 640px) {
      margin-left: 0;
      margin-right: 0; } }
.account-setup {
  display: flex;
  flex-direction: row;
  justify-content: space-between; }
  .account-setup h4 {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    margin-left: 0.875rem; }
    .account-setup .icon-grey {
      color: #076AE0;
    }
  .account-setup .cta-button {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 800;
    line-height: 1.25rem;
    width: 100px;
    border-radius: 0.5rem;
    opacity: 1;
    background-color: rgb(7, 106, 224);
    color: white; }
img,
svg {
  vertical-align: middle; }
.invite-content .input-group-text {
  background: #556ee6;
  color: #fff; }
.invite-content .social-share-link {
  margin-top: 15px; }
  .invite-content .social-share-link a {
    display: inline-block;
    margin-right: 10px; }
    .invite-content .social-share-link a i {
      font-size: 20px; }
      .invite-content .social-share-link a i.icofont-facebook {
        color: #3b5998; }
      .invite-content .social-share-link a i.icofont-twitter {
        color: #1da1f2; }
      .invite-content .social-share-link a i.icofont-whatsapp {
        color: #25d366; }
      .invite-content .social-share-link a i.icofont-telegram {
        color: #0088cc; }
.info {
  display: none; }
.cta-button {
  display: flex;
  justify-content: center;
  width: 125px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  margin-right: 5px;
  margin-left: 5px;
  align-items: center;
  color: #000;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 800;
  line-height: 1.25rem;
  border-radius: 0.5rem;
  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem; }
  @media (min-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem; }
  opacity: 1;
  background-color: rgb(7, 106, 224);
  color: white; }
.cta-button:hover {
  background-color: rgba(7, 106, 224, 0.9); }
</style>