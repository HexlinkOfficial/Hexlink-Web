<template>
  <div class="header">
    <div class="container">
      <div class="row">
        <div class="col-xxl-12">
          <div class="header-content">
            <div class="header-left">
              <div class="brand-logo header-logo">
                <router-link to="/">
                  <img src="../assets/logo/blue2-logo.svg" alt="" />
                  <!-- <span>Hexlink</span> -->
                </router-link>
              </div>
              <!-- <div class="search">
                <form action="#" v-on:submit.prevent="">
                  <div class="input-group">
                    <input type="text" class="form-control" placeholder="Search Here" />
                    <span class="input-group-text"><i class="icofont-search"></i></span>
                  </div>
                </form>
              </div> -->
            </div>

            <div class="header-right">
              <!-- <div class="dark-light-toggle" @click="themeToggle()">
                <span class="dark"><i class="icofont-moon"></i></span>
                <span class="light"><i class="icofont-sun-alt"></i></span>
              </div> -->
              <div class="notification dropdown" @click="activeDropDown('notification')"
                :class="active_ === 'notification' && 'show'">
                <div class="notify-bell" data-toggle="dropdown">
                  <svg width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                    class="h-auto w-3 sm:w-auto">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M9.61379 0.309937C9.89044 0.427717 10.07 0.699327 10.07 1V7.99819H14C14.2667 7.99819 14.5133 8.13982 14.6478 8.37018C14.7822 8.60053 14.7842 8.88494 14.653 9.11714L14.1609 9.988C12.2948 13.2906 9.9149 16.2752 7.11058 18.8298L6.31506 19.5544C6.0955 19.7545 5.7786 19.8061 5.50693 19.686C5.23526 19.566 5.06 19.297 5.06 19V12.0611H1C0.585786 12.0611 0.25 11.7254 0.25 11.3111C0.25 11.177 0.285225 11.051 0.346932 10.9421C2.10572 7.69064 4.3575 4.73117 7.02222 2.16895L8.80017 0.459375C9.0169 0.250976 9.33715 0.192157 9.61379 0.309937ZM2.28458 10.5611H5.81C6.22421 10.5611 6.56 10.8969 6.56 11.3111V17.2945C8.9786 15.009 11.0517 12.3827 12.7134 9.49819H9.32C8.90579 9.49819 8.57 9.1624 8.57 8.74819V2.76162L8.06188 3.25019C5.8111 5.4144 3.86782 7.87442 2.28458 10.5611Z"
                      fill="currentColor"></path>
                  </svg>
                  <!-- <span><i class="icofont-alarm"></i></span> -->
                  <span class="notify-dot"></span>
                </div>
                <div class="dropdown-menu dropdown-menu-right notification-list mt-3" :class="active_ === 'notification' && 'show'">
                  <h4>Announcements</h4>
                  <div class="lists">
                    <router-link to="#" class="">
                      <div class="d-flex align-items-center">
                        <span class="me-3 icon success"><i class="icofont-check"></i></span>
                        <div>
                          <p>Account created successfully</p>
                          <span>2020-11-04 12:00:23</span>
                        </div>
                      </div>
                    </router-link>
                    <router-link to="#" class="">
                      <div class="d-flex align-items-center">
                        <span class="me-3 icon fail"><i class="icofont-close"></i></span>
                        <div>
                          <p>2FA verification failed</p>
                          <span>2020-11-04 12:00:23</span>
                        </div>
                      </div>
                    </router-link>
                    <router-link to="#" class="">
                      <div class="d-flex align-items-center">
                        <span class="me-3 icon success"><i class="icofont-check"></i></span>
                        <div>
                          <p>Device confirmation completed</p>
                          <span>2020-11-04 12:00:23</span>
                        </div>
                      </div>
                    </router-link>
                    <router-link to="#" class="">
                      <div class="d-flex align-items-center">
                        <span class="me-3 icon pending"><i class="icofont-warning"></i></span>
                        <div>
                          <p>Phone verification pending</p>
                          <span>2020-11-04 12:00:23</span>
                        </div>
                      </div>
                    </router-link>
              
                    <router-link to="./settings-activity">More <i class="icofont-simple-right"></i></router-link>
                  </div>
                </div>
              </div>
              <div class="selectnetwork dropdown" @click="activeDropDown('selectnetwork')"
                :class="active_ === 'selectnetwork' && 'show'">
                <div class="network" data-toggle="dropdown">
                  <img src="https://token.metaswap.codefi.network/assets/networkLogos/ethereum.svg" height=25 style="margin-left: 0.5rem; margin-right: 0.5rem;" />
                  <span>{{ networkCount }} Networks</span>
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 0.5rem; width: 1rem">
                    <path d="M1 1L7 7L13 1" stroke="#475569" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="dropdown-menu dropdown-menu-right network-list mt-3" onclick="event.stopPropagation()" :class="active_ === 'selectnetwork' && 'show'">
                  <div class="box">
                    <div class="title">
                      <div class="title-header">
                        <div class="title-text">Networks</div>
                      </div>
                    </div>
                    <div>
                      <!-- ethereum -->
                      <div class="network-items" @click="eth = !eth; countNetworks()">
                        <button>
                          <div style="display: flex; margin-right: 0.75rem; align-items: center; height: 1.25rem; width: 1.25rem;">
                            <svg v-if="eth" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 1L6 12L1 7" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </div>
                          <div style="display: flex; white-space: nowrap; align-items: center; width: 100%; ">
                            <div style="position: relative; margin-right: 0.75rem; min-width: max-content; ">
                              <img src="https://token.metaswap.codefi.network/assets/networkLogos/ethereum.svg" height=25 style="margin-left: 0.5rem; margin-right: 0.5rem;" />
                            </div>
                            <div class="items-name">
                              <span class="item-title">Ethereum</span>
                              <span class="item-balance">$11.39</span>
                            </div>
                          </div>
                        </button>
                      </div>
                      <!-- Sui -->
                      <div class="network-items" @click="sui = !sui; countNetworks()">
                        <button>
                          <div style="display: flex; margin-right: 0.75rem; align-items: center; height: 1.25rem; width: 1.25rem;">
                            <svg v-if="sui" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 1L6 12L1 7" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </div>
                          <div style="display: flex; white-space: nowrap; align-items: center; width: 100%; ">
                            <div style="position: relative; margin-right: 0.75rem; min-width: max-content; ">
                              <img src="https://svgshare.com/i/oQ6.svg" height=25 style="margin-left: 0.5rem; margin-right: 0.5rem;" />
                            </div>
                            <div class="items-name">
                              <span class="item-title">Sui</span>
                              <span class="item-balance">$76.47</span>
                            </div>
                          </div>
                        </button>
                      </div>
                      <!-- Optimism -->
                      <div class="network-items" @click="op = !op; countNetworks()">
                        <button>
                          <div style="display: flex; margin-right: 0.75rem; align-items: center; height: 1.25rem; width: 1.25rem;">
                            <svg v-if="op" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 1L6 12L1 7" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </div>
                          <div style="display: flex; white-space: nowrap; align-items: center; width: 100%; ">
                            <div style="position: relative; margin-right: 0.75rem; min-width: max-content; ">
                              <img src="https://token.metaswap.codefi.network/assets/networkLogos/optimism.svg" height=25 style="margin-left: 0.5rem; margin-right: 0.5rem;" />
                            </div>
                            <div class="items-name">
                              <span class="item-title">Optimism</span>
                              <span class="item-balance">$0.00</span>
                            </div>
                          </div>
                        </button>
                      </div>
                      <!-- Polygon -->
                      <div class="network-items" @click="poly = !poly; countNetworks()">
                        <button>
                          <div style="display: flex; margin-right: 0.75rem; align-items: center; height: 1.25rem; width: 1.25rem;">
                            <svg v-if="poly" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 1L6 12L1 7" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </div>
                          <div style="display: flex; white-space: nowrap; align-items: center; width: 100%; ">
                            <div style="position: relative; margin-right: 0.75rem; min-width: max-content; ">
                              <img src="https://token.metaswap.codefi.network/assets/networkLogos/polygon.svg" height=25
                                style="margin-left: 0.5rem; margin-right: 0.5rem;" />
                            </div>
                            <div class="items-name">
                              <span class="item-title">Polygon</span>
                              <span class="item-balance">$0.00</span>
                            </div>
                          </div>
                        </button>
                      </div>
                      <!-- Fantom -->
                      <div class="network-items" @click="fan = !fan; countNetworks()">
                        <button>
                          <div style="display: flex; margin-right: 0.75rem; align-items: center; height: 1.25rem; width: 1.25rem;">
                            <svg v-if="fan" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 1L6 12L1 7" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </div>
                          <div style="display: flex; white-space: nowrap; align-items: center; width: 100%; ">
                            <div style="position: relative; margin-right: 0.75rem; min-width: max-content; ">
                              <img src="https://token.metaswap.codefi.network/assets/networkLogos/ftm.svg" height=25
                                style="margin-left: 0.5rem; margin-right: 0.5rem;" />
                            </div>
                            <div class="items-name">
                              <span class="item-title">Fantom</span>
                              <span class="item-balance">$0.00</span>
                            </div>
                          </div>
                        </button>
                      </div>
                      <!-- Avalanche -->
                      <div class="network-items" @click="aval = !aval; countNetworks()">
                        <button>
                          <div style="display: flex; margin-right: 0.75rem; align-items: center; height: 1.25rem; width: 1.25rem;">
                            <svg v-if="aval" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 1L6 12L1 7" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </div>
                          <div style="display: flex; white-space: nowrap; align-items: center; width: 100%; ">
                            <div style="position: relative; margin-right: 0.75rem; min-width: max-content; ">
                              <img src="https://token.metaswap.codefi.network/assets/networkLogos/avalanche.svg" height=25
                                style="margin-left: 0.5rem; margin-right: 0.5rem;" />
                            </div>
                            <div class="items-name">
                              <span class="item-title">Avalanche</span>
                              <span class="item-balance">$0.00</span>
                            </div>
                          </div>
                        </button>
                      </div>
                      <!-- BNB Smart Chain -->
                      <div class="network-items" @click="bnb = !bnb; countNetworks()">
                        <button>
                          <div style="display: flex; margin-right: 0.75rem; align-items: center; height: 1.25rem; width: 1.25rem;">
                            <svg v-if="bnb" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 1L6 12L1 7" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </div>
                          <div style="display: flex; white-space: nowrap; align-items: center; width: 100%; ">
                            <div style="position: relative; margin-right: 0.75rem; min-width: max-content; ">
                              <img src="https://token.metaswap.codefi.network/assets/networkLogos/bsc.svg" height=25
                                style="margin-left: 0.5rem; margin-right: 0.5rem;" />
                            </div>
                            <div class="items-name">
                              <span class="item-title">BNB Smart Chain</span>
                              <span class="item-balance">$0.00</span>
                            </div>
                          </div>
                        </button>
                      </div>
                      <!-- Arbitrum -->
                      <div class="network-items" @click="arbi = !arbi; countNetworks()">
                        <button>
                          <div style="display: flex; margin-right: 0.75rem; align-items: center; height: 1.25rem; width: 1.25rem;">
                            <svg v-if="arbi" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 1L6 12L1 7" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </div>
                          <div style="display: flex; white-space: nowrap; align-items: center; width: 100%; ">
                            <div style="position: relative; margin-right: 0.75rem; min-width: max-content; ">
                              <img src="https://token.metaswap.codefi.network/assets/networkLogos/arbitrum.svg" height=25
                                style="margin-left: 0.5rem; margin-right: 0.5rem;" />
                            </div>
                            <div class="items-name">
                              <span class="item-title">Arbitrum</span>
                              <span class="item-balance">$0.00</span>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="profile_log dropdown" @click="activeDropDown('profile')" :class="active_ && 'show'">
                <div class="user" data-toggle="dropdown">
                  <!-- <div style="position: relative;">
                    <span class="thumb"><img :src="user?.photoURL" :size="64" referrerpolicy="no-referrer" /></span>
                  </div> -->
                  <img class="profile" :src="user?.photoURL" :size="64" referrerpolicy="no-referrer"/>
                  <span>{{ addressTextNormal }}</span>
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 0.5rem; width: 1rem">
                    <path d="M1 1L7 7L13 1" stroke="#475569" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <!-- dropdown menu -->
                <div style="opacity: 1; transform: translateY(0);">
                  <div class="dropdown-menu dropdown-menu-right mt-3" :class="active_ === 'profile' && 'show'">
                    <div class="user-email" style="border-bottom-width: 1px; border-color: #E5E7EB; border-style: dashed; ">
                      <div class="user">
                        <span class="thumb"><img :src="user?.photoURL" :size="64" referrerpolicy="no-referrer" /></span>
                        <div class="user-info">
                          <h5>{{ user?.displayName }}</h5>
                          <span>{{ user?.email }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="user-balance" style="border-bottom-width: 1px; border-color: #E5E7EB; border-style: dashed; ">
                      <h5><b>Your Smart Contact Wallet: </b></h5>
                      <!-- <div class="address">
                        <span style="color: #4B5563; font-size: 0.875rem; line-height: 1.25rem; font-weight: 500;">Address: </span>
                        <span @click="doCopy" style="margin-bottom: 0; padding-top: 0.25rem; padding-bottom: 0.25rem; padding-left: 0.5rem; padding-right: 0.5rem; background-color: #F3F4F6; font-size: 0.875rem; line-height: 1.25rem; border-radius: 0.5rem; ">
                          {{ addressText }}
                        </span>
                      </div>
                      <div class="balance">
                        <span style="color: #4B5563; font-size: 0.875rem; line-height: 1.25rem; font-weight: 500;">Balance: </span>
                        <span @click="doCopy">
                          $1990.89
                        </span>
                      </div> -->
                      <div class="user-wallet">
                        <div class="user">
                          <span class="thumb"></span>
                          <div class="user-info">
                            <span>
                              <h5 @click="doCopy" style="margin-bottom: 0; padding-top: 0.25rem; padding-bottom: 0.25rem; padding-left: 0.5rem; padding-right: 0.5rem; background-color: #F3F4F6; font-size: 0.875rem; line-height: 1.25rem; border-radius: 0.5rem; ">
                                {{ addressTextLong }}
                              </h5>
                            </span>
                            <span style="padding-left: 9px;">$200.45</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- <router-link to="profile" class="dropdown-item">
                      <i class="icofont-ui-user"></i>Profile
                    </router-link>
                    <router-link to="wallet" class="dropdown-item">
                      <i class="icofont-wallet"></i>Wallet
                    </router-link> -->
                    <!-- <router-link to="settings-profile" class="dropdown-item">
                      <i class="icofont-ui-settings"></i> Setting
                    </router-link> -->
                    <!-- <router-link to="/activities" class="dropdown-item">
                      <i class="icofont-history"></i> Activity
                    </router-link> -->
                    <!-- <router-link to="lock" class="dropdown-item">
                      <i class="icofont-lock"></i>Lock
                    </router-link> -->
                    <router-link to="signin" class="dropdown-item logout">
                      <i class="icofont-logout"></i> Logout
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import { useAuthStore } from '@/stores/auth';
import { prettyPrintAddress } from '@/services/web3/account';
import { createToaster } from "@meforma/vue-toaster";

export default {
  name: "Header",
  data() {
    const store = useAuthStore();
    const user = store.currentUser!;
    const actualAddress = user.walletAddress;
    const addressTextLong = computed(() => {
      if (user.walletAddress) {
        return prettyPrintAddress(user.walletAddress!, 5, 6);
      } else {
        return "";
      }
    })
    const addressTextNormal = computed(() => {
      if (user.walletAddress) {
        return prettyPrintAddress(user.walletAddress!, 3, 3);
      } else {
        return "";
      }
    })
    return {
      actualAddress,
      addressTextLong,
      addressTextNormal,
      user,
      active_: "",
      eth: true,
      sui: false,
      op: false,
      poly: false,
      fan: false,
      aval: false,
      bnb: false,
      arbi: false,
      networkCount: 1
    };
  },
  methods: {
    countNetworks() {
      var test = 0;
      if (this.eth) {
        test += 1;
      } if (this.sui) {
        test += 1;
      } if (this.op) {
        test += 1;
      } if (this.poly) {
        test += 1;
      } if (this.fan) {
        test += 1;
      } if (this.aval) {
        test += 1;
      } if (this.bnb) {
        test += 1;
      } if (this.arbi) {
        test += 1;
      }
      this.networkCount = test;
    },
    activeDropDown(value: any) {
      this.active_ = this.active_ === value ? "" : value;
    },
    closeDropDown(e) {
      if (!this.$el.contains(e.target)) {
        this.active_ = "";
      }
    },
    selectNetwork(value: any) {
      this.active_ = this.active_ === value ? "" : value;
    },
    doCopy: function () {
      this.$copyText(this.actualAddress).then(
        function () {
          // alert("Copied");
          const toaster = createToaster({ position: "top", duration: 2000 });
          toaster.success(`Copied`);
        },
        function () {
          // alert("Can not copy");
          const toaster = createToaster({ position: "top", duration: 2000 });
          toaster.error(`Can not copy`);
        }
      );
    },
  },
  mounted() {
    document.addEventListener('click', this.closeDropDown)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeDropDown)
  },
  created() {
  },
};
</script>

<style lang="scss" scoped>
.header {
  background: #f0f0f0;
  padding: 30px 0px 20px 0px;
  position: fixed;
  top: 0;
  left: 9.5rem;
  right: 3rem;
  z-index: 2; }
  @media only screen and (max-width: 880px) {
    .header {
      left: 0;
      right: 0;
      padding: 30px 0px 20px 0px; } }
  .header .brand-logo {
    margin-top: 0px;
    padding-right: 20px;
    border-radius: 5px; }
    .header .brand-logo img {
      filter: none;
      max-width: 180px;
      margin-right: 5px; }
    .header .brand-logo span {
      font-weight: bold;
      text-transform: uppercase;
      color: #556ee6;
      display: inline-block;
      position: relative;
      top: 3px;
      font-size: 20px; }
    @media only screen and (max-width: 880px) {
      .header .brand-logo {
        display: block;
        padding-right: 0; }
        .header .brand-logo span {
          display: none; }
        .header .brand-logo img {
          filter: none;
          max-width: 165px;
          margin-right: 5px; } }
    @media only screen and (max-width: 768px) {
      .header .brand-logo img {
        max-width: 150px; } }
  .header.landing {
    left: 0px; }
    .header.landing a {
      display: flex;
      align-items: center;
      justify-content: center; }
    .header.landing .brand-logo {
      display: block; }
      .header.landing .brand-logo img {
        margin-right: 10px; }
      .header.landing .brand-logo span {
        display: block;
        top: 0; }
.header-content,
.header-left,
.header-right {
  display: flex;
  justify-content: space-between;
  align-items: center; }
.dark-light-toggle {
margin-right: 20px;
cursor: pointer; }
@media only screen and (max-width: 880px) {
  .dark-light-toggle {
    margin-right: 0px;
    margin-left: 15px; } }
.dark-light-toggle i {
  font-size: 20px; }
.dark-light-toggle .light {
  display: none; }
.profile_log {
cursor: pointer; }
.profile_log .user {
  display: flex;
  position: relative;
  background-color: #ffffff;
  transition-property: all;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 2.5rem;
  border-radius: 9999px;
  border-width: 1px;
  border-color: #F3F4F6;
  cursor: pointer;
  margin-right: 1rem; }
  .profile_log .user:hover {
      transform: translateY(-0.125rem);
      fill: #076AE0;
      background-color: rgb(221,220,251);
      border-color: rgb(48,138,245);
      color: rgb(7,106,224);
    }
  @media only screen and (max-width: 768px) {
    .profile_log .user {
      margin-right: 0.5rem;
      margin-left: 0rem; 
      transition: 0.2s ease-in-out; } }
  .profile_log .user span {
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin-right: 0.5rem;
    color: rgb(71, 85, 105); }
  @media only screen and (max-width: 768px) {
    .profile_log .user span {
      display: none; } }
  .profile_log .user .profile {
    height: 25px;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    border-radius: 50px;
  }
  .profile_log .user .thumb {
    display: block;
    overflow: hidden;
    width: 40px;
    height: 40px;
    border-radius: 50px;
    border-color: #ffffff;
    border-style: solid;
    color: #fff;
    text-align: center;
    &:hover {
      transform: translateY(-0.125rem); } }
    .profile_log .user .thumb img {
      border-radius: 50px;
      max-width: 38px; }
  .profile_log .user .arrow i {
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    margin-top: 6px;
    display: inline-block; }
  @media only screen and (max-width: 1199px) {
    .profile_log .user .arrow {
      display: none; } }
.profile_log .dropdown-menu {
  // border: 0px;
  // padding: 0px;
  // margin: 0px;
  // top: 25px !important;
  margin-top: 0.75rem;
  transition: 0.2s ease-in-out;
  box-shadow: 0 1.5rem 4rem rgba(22, 28, 45, 0.15); }
  .profile_log .dropdown-menu .user {
    display: flex;
    align-items: center;
    justify-content: flex-start; }
  .profile_log .dropdown-menu .user-email {
    border: 0 solid #e5e7eb;
    padding: 30px 20px 20px 20px; }
    .profile_log .dropdown-menu .user-email .thumb {
      margin-right: 10px; }
    .profile_log .dropdown-menu .user-email .user-info {
      margin: 0px; }
    .profile_log .dropdown-menu .user-email h5, .profile_log .dropdown-menu .user-email .h5 {
      margin-bottom: 0px; }
    .profile_log .dropdown-menu .user-email span {
      font-size: 14px; }
  .profile_log .dropdown-menu .user-wallet {
    border: 0 solid #e5e7eb;
    padding: 10px 0px 0px 0px; }
    .profile_log .dropdown-menu .user-wallet .thumb {
      background-image: linear-gradient(to right, #6366f1,#a855f7,#ec4899); 
      background-color: #6366F1; 
      background-color: #8B5CF6; 
      background-color: #EC4899; 
      transition-property: all; 
      width: 40px;
      height: 40px;
      margin-right: 15px; }
    .profile_log .dropdown-menu .user-wallet .user-info {
      margin: 0px; }
    .profile_log .dropdown-menu .user-wallet h5, .profile_log .dropdown-menu .user-email .h5 {
      margin-bottom: 0px; }
    .profile_log .dropdown-menu .user-wallet span {
      font-size: 14px; }
  .profile_log .dropdown-menu .user-balance {
    // display: flex;
    // justify-content: space-around;
    // margin-bottom: 15px;
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    border-bottom-width: 1px;
    border-color: #E5E7EB;
    border-style: dashed;
    border: 0 solid #e5e7eb; }
    .profile_log .dropdown-menu .user-balance .address {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      color: #64748B;
    }
    .profile_log .dropdown-menu .user-balance .balance {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      margin-top: 10px;
      color: #64748B;
    }
    // .profile_log .dropdown-menu .user-balance p {
    //   margin-bottom: 0px;
    //   font-weight: 500;
    //   color: #495057; }
  .profile_log .dropdown-menu .dropdown-item {
    padding: 10px 20px;
    border-top: 1px solid #f1f1f1;
    font-weight: 400;
    display: flex;
    align-items: center; }
    .profile_log .dropdown-menu .dropdown-item:first-child {
      border: 0px; }
    .profile_log .dropdown-menu .dropdown-item.logout {
      color: #f46a6a; }
      .profile_log .dropdown-menu .dropdown-item.logout i {
        color: #f46a6a; }
    .profile_log .dropdown-menu .dropdown-item i {
      margin-right: 10px;
      font-size: 18px;
      color: #556ee6;
      font-weight: bold; }
    .profile_log .dropdown-menu .dropdown-item:hover, .profile_log .dropdown-menu .dropdown-item:focus, .profile_log .dropdown-menu .dropdown-item.active {
      background-color: #556ee6;
      color: #fff; }
      .profile_log .dropdown-menu .dropdown-item:hover i, .profile_log .dropdown-menu .dropdown-item:focus i, .profile_log .dropdown-menu .dropdown-item.active i {
        color: #fff; }
.dropdown-menu {
  position: absolute;
  z-index: 1000;
  display: none;
  min-width: 10rem;
  // padding: 0.5rem 0;
  margin: 0;
  font-size: 0.8125rem;
  color: #495057;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 0px solid rgba(0, 0, 0, 0.15);
  width: 20rem;
  z-index: 1;
  transition: height 0.3s ease-in-out;
  border-radius: 0.5rem; }
  // .dropdown-menu[data-bs-popper] {
  //   top: 100%;
  //   left: 0;
  //   margin-top: 0.125rem; }
.dropdown-menu.show {
  transition: 0.2s ease-in-out;
  display: block; }
.user-info {
  margin: 15px 0px; }
  .user-info span {
    margin-bottom: 5px;
    display: inline-block; }
.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25rem 1rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  text-decoration: none;
  white-space: nowrap;
  background-color: transparent;
  transition: 0.2s ease-in-out;
  border: 0; }
  .dropdown-item:hover, .dropdown-item:focus {
    color: #1e2125;
    background-color: #e9ecef; }
  .dropdown-item.active, .dropdown-item:active {
    color: #fff;
    text-decoration: none;
    background-color: #556ee6; }
  .dropdown-item.disabled, .dropdown-item:disabled {
    color: #adb5bd;
    pointer-events: none;
    background-color: transparent; }
.dropdown-menu.dropdown-menu-right.notification-list.mt-3.show {
  position: absolute;
  right: 1rem;
  transition: 0.2s ease-in-out; }
.dropdown-menu.dropdown-menu-right.network-list.mt-3.show {
  position: absolute;
  right: -3.5rem;
  max-height: 100vh;
  transition: 0.2s ease-in-out; }
.dropdown-menu.dropdown-menu-right.mt-3.show {
  position: absolute;
  right: 1rem;
  transition: 0.2s ease-in-out; }
.notification {
  transition: 0.2s ease-in-out;
  cursor: pointer; }
  .notification .notify-bell {
    display: flex;
    position: relative;
    background-color: #ffffff;
    transition-property: all;
    justify-content: center;
    align-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    border-width: 1px;
    border-color: #F3F4F6;
    cursor: pointer;
    margin-right: 1rem; }
    .notification .notify-bell:hover {
      transform: translateY(-0.125rem);
      fill: #1d4ed8;
      background-color: rgb(221,220,251);
      border-color: rgb(73,108,233);
      color: rgb(29,78,216);
    }
    @media only screen and (max-width: 880px) {
      .notification .notify-bell {
        margin-right: 0.5rem;
        margin-left: 0.5rem; } }
    .notification .notify-bell i {
      font-size: 22px;
      color: #343a40; }
  .selectnetwork .network {
    display: flex;
    position: relative;
    background-color: #ffffff;
    transition-property: all;
    justify-content: center;
    align-items: center;
    width: auto;
    height: 2.5rem;
    border-radius: 9999px;
    border-width: 1px;
    border-color: #F3F4F6;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    margin-right: 1rem; }
    .selectnetwork .network:hover {
      transform: translateY(-0.125rem);
      fill: #076AE0;
      background-color: rgb(221,220,251);
      border-color: rgb(48,138,245);
      color: rgb(7,106,224);
    }
    @media only screen and (max-width: 768px) {
      .selectnetwork .network {
        margin-right: 0.5rem;
        margin-left: 0rem; } }
  .selectnetwork .network span {
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin-right: 0.5rem;
    color: rgb(71,85,105); }
    @media only screen and (max-width: 768px) {
      .selectnetwork .network span {
        display: none; } }
  .selectnetwork .dropdown-menu {
    margin-top: 0.75rem;
    box-shadow: 0 1.5rem 4rem rgba(22, 28, 45, 0.15); }
    .selectnetwork .dropdown-menu .box {
      overflow-y: auto;
      position: fixed;
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
      right: 1.5rem;
      left: 4rem;
      max-height: 20rem;
      background-color: white;
      box-shadow: 0 1.5rem 4rem rgba(22, 28, 45, 0.15);
      background-clip: padding-box;
      border: 0px solid rgba(0, 0, 0, 0.15);
      border-radius: 0.5rem;
      @media (min-width: 640px) {
        position: absolute;
        left: 0;
        transform-origin: top left;
        max-height: 100vh;
        padding-top: 1.5rem;
        padding-bottom: 1.5rem;
        box-shadow: 0 1.5rem 4rem rgba(22, 28, 45, 0.15);
        background-clip: padding-box;
        border: 0px solid rgba(0, 0, 0, 0.15);
        border-radius: 0.5rem;
      }
    }
    .selectnetwork .dropdown-menu .box .title {
      padding-left: 1rem;
      padding-right: 1rem;
      padding-bottom: 0.5rem;
      @media (min-width: 640px) { 
      padding-left: 1.5rem;
      padding-right: 1.5rem; } }
      .selectnetwork .dropdown-menu .box .title .title-header {
        display: flex;
        justify-content: space-between;
        align-items: center;}
        .selectnetwork .dropdown-menu .box .title .title-header .title-text {
          font-size: 0.875rem;
          line-height: 1.25rem;
          color: rgb(100,116,139);
          font-weight: 600; }
    .selectnetwork .dropdown-menu .box .network-items {
      border-radius: 0.5rem;
      margin-left: 0.75rem;
      margin-right: 0.75rem;
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      
      &:hover {
        // border-bottom: 1px solid rgb(48, 138, 245);
        // border-top: 1px solid rgb(48, 138, 245);
        // border-left: 1px solid rgb(48, 138, 245);
        // border-right: 1px solid rgb(48, 138, 245);
        background-color: rgba(48, 138, 245,0.2);
      }

      @media (min-width: 640px) {
        padding-left: 1rem;
        padding-right: 1rem; } }
      .selectnetwork .dropdown-menu .box .network-items button {
        display: flex;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        align-items: center;
        width: 100%; 
        @media (max-width: 768px) {
        padding-left: 0.5rem;
        padding-right: 1rem; } }
      .selectnetwork .dropdown-menu .box .network-items .items-name {
        display: flex;
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 500;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex-direction: column;
        @media (min-width: 640px) {
          font-size: 1rem;
          line-height: 1.3rem; } }
        .selectnetwork .dropdown-menu .box .network-items .items-name .item-title {
          color: black;
          font-size: 0.875rem;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap; }
        .selectnetwork .dropdown-menu .box .network-items .items-name .item-balance {
          color: #6a6d7c;
          font-size: 0.875rem;
          font-weight: 400;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
  .notification .notify-dot {
    position: absolute;
    top: 0;
    right: 0;
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 9999px;
    opacity: 1;
    background-color: rgb(7, 106, 224);
    // @media (min-width: 640px) {
    //   width: 0.75rem;
    //   height: 0.75rem; }
  }
  .notification .dropdown-menu {
    border: 0px;
    padding: 15px 20px 10px;
    margin: 0px;
    // top: 25px !important;
    width: 330px;
    box-shadow: 0 36px 48px rgba(27, 25, 148, 0.08);
    border-radius: 5px; }
    .notification .dropdown-menu h4, .notification .dropdown-menu .h4 {
      border-bottom: 1px solid #f1f1f1;
      padding-bottom: 15px;
      font-size: 16px; }
    .notification .dropdown-menu a {
      display: inline-block;
      border-bottom: 1px solid #f1f1f1;
      padding: 10px 0px; }
      .notification .dropdown-menu a:last-child {
        border: 0px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        color: #343a40; }
        .notification .dropdown-menu a:last-child i {
          margin-left: 5px;
          font-size: 18px; }
      .notification .dropdown-menu a p {
        margin-bottom: 0px;
        color: #495057;
        font-weight: 500;
        font-size: 14px; }
      .notification .dropdown-menu a span {
        font-size: 13px;
        color: #495057; }
      .notification .dropdown-menu a span.icon {
        height: 40px;
        width: 40px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50px; }
        .notification .dropdown-menu a span.icon i {
          font-size: 20px; }
      .notification .dropdown-menu a span.success {
        background: #34c38f; }
      .notification .dropdown-menu a span.fail {
        background: #f46a6a; }
      .notification .dropdown-menu a span.pending {
        background: #f1b44c; }
</style>
