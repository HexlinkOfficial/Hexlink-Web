<style lang="less" scoped>
.content-body {
  margin-left: 9.5rem; }
@media only screen and (max-width: 880px) {
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
  border-radius: 1.75rem;
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
  margin-left: auto;
  background: white;
  border-radius: 6px;
  box-shadow: 0 14px 26px -12px, 0 4px 23px 0 rgb(0 0 0 / 12%), 0 8px 10px -5px hsl(213 75% 57% / 20%) !important;
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
  padding: 16px;
  border-radius: 5px;
  width: 100%;
  min-height: 70px;
  justify-content: space-between;
  align-items: center; }
  .token-worth .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    flex-direction: row;
    font-size: 1rem;
    line-height: 1.33;
    color: rgb(138, 147, 165);
    margin-bottom: 4px; }
  .token-worth .price {
    font-size: 2rem;
    font-weight: bold;
    line-height: 1.33;
    color: black;
    margin-right: auto;
    word-break: keep-all;
  }
img,
svg {
  vertical-align: middle; }
</style>
<template>
  <layout :active="1">
    <div class="content-body">
      <div class="container">
        <h1 style="margin-bottom: 1rem;;">Tokens</h1>
        <div class="token-worth">
          <div>
            <div class="title">
              <span>Token Worth</span>
              <div class="cta">
                <div class="cta-title">
                  <a :href="goerliScan" target="_blank">
                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10.3917 23.8059C10.3917 23.5267 10.4468 23.2502 10.5539 22.9923C10.6609 22.7344 10.8179 22.5003 11.0157 22.3033C11.2135 22.1063 11.4483 21.9503 11.7065 21.8444C11.9648 21.7384 12.2414 21.6845 12.5206 21.6858L16.05 21.6974C16.6127 21.6974 17.1524 21.921 17.5503 22.3191C17.9483 22.7172 18.1718 23.2571 18.1718 23.82V37.1707C18.5694 37.0528 19.0793 36.9272 19.6379 36.7961C20.0258 36.7048 20.3714 36.4851 20.6188 36.1727C20.8662 35.8602 21.0009 35.4734 21.001 35.0748V18.5144C21.001 18.2356 21.0559 17.9596 21.1625 17.702C21.2691 17.4444 21.4254 17.2104 21.6225 17.0132C21.8195 16.8161 22.0535 16.6597 22.3109 16.553C22.5684 16.4462 22.8444 16.3913 23.1231 16.3913H26.6594C27.2222 16.3914 27.7618 16.615 28.1597 17.0131C28.5576 17.4111 28.7812 17.951 28.7813 18.5139V33.8847C28.7813 33.8847 29.6663 33.5261 30.5291 33.1619C30.8494 33.0264 31.1228 32.7994 31.3151 32.5095C31.5074 32.2195 31.61 31.8793 31.6103 31.5314V13.2069C31.6103 12.9282 31.6652 12.6522 31.7718 12.3947C31.8784 12.1371 32.0347 11.9032 32.2317 11.706C32.4287 11.5089 32.6626 11.3526 32.92 11.2459C33.1775 11.1392 33.4534 11.0843 33.732 11.0843H37.2684C37.8312 11.0843 38.3709 11.308 38.7688 11.706C39.1668 12.1041 39.3904 12.644 39.3904 13.2069V28.2961C42.4564 26.0734 45.5637 23.3998 48.0295 20.1852C48.3873 19.7185 48.624 19.1706 48.7186 18.5902C48.8132 18.0098 48.7627 17.415 48.5716 16.8588C46.9032 11.9947 43.7736 7.7649 39.6108 4.74766C35.448 1.73042 30.4552 0.0730622 25.315 0.00220542C11.4543 -0.184057 -0.000936476 11.1346 0.000425111 25.002C-0.0131845 29.39 1.13169 33.7039 3.31929 37.5074C3.62098 38.0277 4.06481 38.451 4.59865 38.7276C5.13249 39.0043 5.73416 39.1228 6.33299 39.0692C7.00204 39.0103 7.83499 38.9271 8.82521 38.8108C9.2562 38.7617 9.65411 38.5558 9.94314 38.2322C10.2322 37.9086 10.3921 37.49 10.3926 37.0561V23.8059"
                        fill="#21325B" />
                      <path
                        d="M10.3146 45.2173C14.0422 47.93 18.4474 49.5583 23.0428 49.922C27.6381 50.2858 32.2444 49.3707 36.3522 47.2781C40.4599 45.1856 43.9089 41.997 46.3176 38.0653C48.7263 34.1336 50.0008 29.6119 50 25.0006C50 24.425 49.9733 23.8558 49.9348 23.2897C40.8051 36.9104 23.948 43.278 10.3144 45.2178"
                        fill="#979695" />
                    </svg>
                  </a>
                </div>
                <!-- <a class="cta-link">View Details</a> -->
              </div>
            </div>
            <div class="price">$281.98</div>
          </div>
        </div>
        <div class="row">
          <div className="row invoice-card-row">
            <div class="col-xxl-6">
              <div class="card">
                <div class="card-body">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script lang="ts">
import Layout from "../components/Layout.vue";
import { useAuthStore } from '@/stores/auth';

export default {
  components: {
    Layout,
  },
  data() {
    const store = useAuthStore();
    const user = store.currentUser!;
    const firstName = user?.displayName!.split(" ")[0];
    const lastName = user?.displayName!.split(" ")[-1];
    const goerliScan = `https://goerli.etherscan.io/address/${user.walletAddress}`
    return {
      user,
      firstName,
      lastName,
      goerliScan,
    };
  },
  methods: {
  },
};
</script>