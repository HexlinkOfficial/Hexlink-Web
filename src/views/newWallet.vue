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
  position: relative;
  flex-grow: 2;
  max-width: 250px;
  margin-left: auto;
  background: hsl(213 75% 57%);
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 14px 26px -12px hsl(213 75% 57% / 42%), 0 4px 23px 0 rgb(0 0 0 / 12%), 0 8px 10px -5px hsl(213 75% 57% / 20%) !important;
  @media only screen and (max-width: 767px) {
    margin-left: 0;
  } }
  .cta .cta-title {
    display: flex;
    margin-bottom: 1rem;
    width: 100%; }
    .cta .cta-title svg {
      display: inline-block;
      text-transform: none;
      -webkit-font-smoothing: antialiased;
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      font-size: 4rem;
      opacity: .3; }
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
        <div class="row">
          <div className="row invoice-card-row">
            <div class="col-xxl-6">
              <div class="card">
                <div class="card-body">
                  <div class="token-worth">
                    <div>
                      <div class="title">Token Worth</div>
                      <div class="price">$281.98</div>
                    </div>
                    <div class="cta">
                      <div class="cta-title">
                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                          <rect width="50" height="50" fill="url(#pattern0)"/>
                          <defs>
                          <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                          <use xlink:href="#image0_114_61" transform="scale(0.00340136)"/>
                          </pattern>
                          <image id="image0_114_61" width="294" height="294" xlink:href="data:image/png;base64,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"/>
                          </defs>
                        </svg>
                        <p class="white-text">View account details on Etherscan</p>
                      </div>
                      <!-- <a class="cta-link">View Details</a> -->
                    </div>
                  </div>
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
    return {
      user,
      firstName,
      lastName,
    };
  },
  methods: {
  },
};
</script>