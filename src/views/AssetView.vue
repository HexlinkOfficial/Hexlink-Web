<style lang="less" scoped>
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
  
    @media (min-width: 640px) {
      display: flex; } }
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
        max-width: 28rem; } }
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
          width: 150px; }
        @media (min-width: 768px) {
          padding-left: 1.5rem;
          padding-right: 1.5rem;
          width: 150px; } }
      .token-list .views .detail-view .listView-button {
        opacity: 1;
        background-color: rgba(7, 106, 224,0);
  color: rgb(71, 85, 105); }
      .token-list .views .detail-view .listView-button:hover {
        opacity: 1;
        color: rgb(7, 106, 224); }
      .token-list .views .detail-view .listView-button.show {
        opacity: 1;
        background-color: rgb(7, 106, 224);
        color: white; }
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
    .token-listDetail .token-table table {
      min-width: 100%;
      table-layout: auto;
      border-color: inherit;
      text-indent: 0; }
      .token-listDetail .token-table .table-thread {
        display: none;
        border-bottom: 1px solid #e5e7eb;
        @media (min-width: 640px) {
          display: table-header-group; } }
        .token-listDetail .token-table .table-thread .toke-header {
          font-weight: 400;
          cursor: pointer; }
          .token-listDetail .token-table .table-thread .toke-header .token-header-data {
            display: flex;
            align-items: center; }
        .token-listDetail .token-table .table-thread .portfolio-percentage-header {
          display: none;
          font-weight: 400;
          cursor: pointer;

          @media (min-width: 1024px) {
            display: table-cell; } }
          .token-listDetail .token-table .table-thread .portfolio-percentage-header .portfolio-percentage-header-data {
            display: flex;
            align-items: center; }
          .token-listDetail .token-table .table-thread .portfolio-percentage-header .portfolio-percentage-header-sign {
            display: flex;
            margin-left: 0.5rem;
            flex-direction: column;
            align-items: center; }
        .token-listDetail .token-table .table-thread .price-header {
          display: none;
          font-weight: 400;
          cursor: pointer;
        
          @media (min-width: 768px) {
            display: table-cell; } }
          .token-listDetail .token-table .table-thread .price-header .price-header-data {
            display: flex;
            align-items: center; }
        .token-listDetail .token-table .table-thread .balance-header {
          font-weight: 400;
          text-align: right;
          cursor: pointer;
        
          @media (min-width: 768px) {
            text-align: left; } }
          .token-listDetail .token-table .table-thread .balance-header .balance-header-data {
            display: flex;
            align-items: center; }
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
    border-radius: 50px;
    opacity: 1;
    background-color: rgb(7, 106, 224);
    color: white; }
img,
svg {
  vertical-align: middle; }
.transaction-detail {
  border-radius: 0.75rem;
  margin-top: 1.75rem; }
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
  border-radius: 50px;
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
  background-color: rgba(7, 106, 224, 0.9);
}
</style>
<template>
  <layout :active="1">
    <div class="row">
      <div className="row invoice-card-row">
        <!-- account balance and title -->
        <div class="col-xxl-6">
          <div class="token-worth">
            <div>
              <div class="title">
                <span>Token Worth</span>
              </div>
              <div class="price">${{ price }}</div>
              <div style="display: flex; margin-top: 1rem; margin-bottom: 1rem;">
                <button class="cta-button">
                  <svg style="margin-right: 5px;" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M18.0777 3.42029C18.8438 1.3912 16.8591 -0.593518 14.83 0.172603L2.18651 4.94641C-0.510074 5.96456 -0.359061 9.82917 2.40876 10.6338L5.91591 11.6533C6.24454 11.7488 6.50149 12.0058 6.59702 12.3344L7.61653 15.8415C8.42113 18.6093 12.2857 18.7604 13.3039 16.0638L18.0777 3.42029ZM14.1917 2.55142L2.89297 6.81748C1.9941 7.15687 2.04445 8.44507 2.96705 8.71327L6.4742 9.73279C6.5142 9.74442 6.55385 9.75685 6.59313 9.77005L14.1917 2.55142ZM8.17958 11.0216C8.32473 11.2534 8.4392 11.5067 8.51752 11.7761L9.53703 15.2832C9.80523 16.2058 11.0934 16.2562 11.4328 15.3573L15.8051 3.77732L8.17958 11.0216Z"
                      fill="white" />
                  </svg>
                  Send
                </button>
                <button class="cta-button">
                  <svg style="margin-right: 5px;" width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M2.66946 8.341H6.17155C7.80962 8.341 8.591 7.56904 8.591 5.90272V2.4477C8.591 0.781381 7.80962 0 6.17155 0H2.66946C1.03138 0 0.25 0.781381 0.25 2.4477V5.90272C0.25 7.56904 1.03138 8.341 2.66946 8.341ZM12.3285 8.341H15.8305C17.4686 8.341 18.25 7.56904 18.25 5.90272V2.4477C18.25 0.781381 17.4686 0 15.8305 0H12.3285C10.6904 0 9.90899 0.781381 9.90899 2.4477V5.90272C9.90899 7.56904 10.6904 8.341 12.3285 8.341ZM2.54707 6.57113C2.17992 6.57113 2.01987 6.40167 2.01987 6.03452V2.30649C2.01987 1.93933 2.17992 1.76987 2.54707 1.76987H6.29393C6.65167 1.76987 6.82113 1.93933 6.82113 2.30649V6.03452C6.82113 6.40167 6.65167 6.57113 6.29393 6.57113H2.54707ZM12.2061 6.57113C11.8389 6.57113 11.6789 6.40167 11.6789 6.03452V2.30649C11.6789 1.93933 11.8389 1.76987 12.2061 1.76987H15.9529C16.3201 1.76987 16.4801 1.93933 16.4801 2.30649V6.03452C16.4801 6.40167 16.3201 6.57113 15.9529 6.57113H12.2061ZM3.51674 5.28138H5.31485C5.46548 5.28138 5.53138 5.2249 5.53138 5.03661V3.29498C5.53138 3.12552 5.46548 3.05962 5.31485 3.05962H3.51674C3.35669 3.05962 3.30962 3.12552 3.30962 3.29498V5.03661C3.30962 5.2249 3.35669 5.28138 3.51674 5.28138ZM13.204 5.28138H15.0021C15.1621 5.28138 15.228 5.2249 15.228 5.03661V3.29498C15.228 3.12552 15.1621 3.05962 15.0021 3.05962H13.204C13.0533 3.05962 12.9969 3.12552 12.9969 3.29498V5.03661C12.9969 5.2249 13.0533 5.28138 13.204 5.28138ZM2.66946 18H6.17155C7.80962 18 8.591 17.228 8.591 15.5617V12.1067C8.591 10.4404 7.80962 9.65899 6.17155 9.65899H2.66946C1.03138 9.65899 0.25 10.4404 0.25 12.1067V15.5617C0.25 17.228 1.03138 18 2.66946 18ZM10.6056 12.3044H12.4038C12.5638 12.3044 12.6297 12.2479 12.6297 12.0596V10.318C12.6297 10.1485 12.5638 10.0826 12.4038 10.0826H10.6056C10.455 10.0826 10.3985 10.1485 10.3985 10.318V12.0596C10.3985 12.2479 10.455 12.3044 10.6056 12.3044ZM15.7176 12.3044H17.5157C17.6757 12.3044 17.7322 12.2479 17.7322 12.0596V10.318C17.7322 10.1485 17.6757 10.0826 17.5157 10.0826H15.7176C15.5669 10.0826 15.5105 10.1485 15.5105 10.318V12.0596C15.5105 12.2479 15.5669 12.3044 15.7176 12.3044ZM2.54707 16.2301C2.17992 16.2301 2.01987 16.0607 2.01987 15.7029V11.9749C2.01987 11.5983 2.17992 11.4289 2.54707 11.4289H6.29393C6.65167 11.4289 6.82113 11.5983 6.82113 11.9749V15.7029C6.82113 16.0607 6.65167 16.2301 6.29393 16.2301H2.54707ZM13.1851 14.8651H14.9833C15.1433 14.8651 15.2092 14.7992 15.2092 14.6203V12.8692C15.2092 12.6998 15.1433 12.6339 14.9833 12.6339H13.1851C13.0345 12.6339 12.978 12.6998 12.978 12.8692V14.6203C12.978 14.7992 13.0345 14.8651 13.1851 14.8651ZM3.51674 14.9404H5.31485C5.46548 14.9404 5.53138 14.8839 5.53138 14.6956V12.954C5.53138 12.7845 5.46548 12.7186 5.31485 12.7186H3.51674C3.35669 12.7186 3.30962 12.7845 3.30962 12.954V14.6956C3.30962 14.8839 3.35669 14.9404 3.51674 14.9404ZM10.6056 17.4163H12.4038C12.5638 17.4163 12.6297 17.3504 12.6297 17.1715V15.4299C12.6297 15.251 12.5638 15.1946 12.4038 15.1946H10.6056C10.455 15.1946 10.3985 15.251 10.3985 15.4299V17.1715C10.3985 17.3504 10.455 17.4163 10.6056 17.4163ZM15.7176 17.4163H17.5157C17.6757 17.4163 17.7322 17.3504 17.7322 17.1715V15.4299C17.7322 15.251 17.6757 15.1946 17.5157 15.1946H15.7176C15.5669 15.1946 15.5105 15.251 15.5105 15.4299V17.1715C15.5105 17.3504 15.5669 17.4163 15.7176 17.4163Z"
                      fill="white" />
                  </svg>
                  receive
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xxl-6">
          <div class="card">
            <div class="card-body">
              <div class="token-list">
                <div class="title">
                  <div class="title-col">
                    <div class="content">
                      <div class="text">Assets</div>
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
                    <button class="listView-button" @click="tokenTransaction = false; tokenView = true"
                      :class="tokenView && 'show'">Tokens</button>
                    <button class="listView-button" @click="tokenView = false; tokenTransaction = true"
                      :class="tokenTransaction && 'show'">Transactions</button>
                  </div>
                </div>
              </div>
              <div v-if="tokenView" class="token-listDetail">
                <div class="token-table">
                  <div style="overflow: visible; border-radius: 0.75rem;">
                    <WalletTokenList></WalletTokenList>
                  </div>
                </div>
              </div>
              <div v-if="tokenTransaction" class="transaction-detail">
                <AssetTransaction></AssetTransaction>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Layout from "../components/Layout.vue";
import WalletTokenList from "@/components/WalletTokenList.vue";
import AssetTransaction from "@/components/AssetTransaction.vue";
import { useChainStore } from '@/stores/chain';
import { useAccountStore } from "@/stores/account";
import { BigNumber } from "bignumber.js";

const tokenTransaction = ref<boolean>(false);
const tokenView = ref<boolean>(true);
const showInfo = ref<boolean>(true);

const blockExplorer = computed(() => {
  const account = useAccountStore().account?.address;
  return `${useChainStore().chain.blockExplorerUrls[0]}/address/${account}`;
});

const price = computed(() => {
  return BigNumber(0);
});
</script>