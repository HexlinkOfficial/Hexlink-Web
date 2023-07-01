<template>
  <div ref="root" class="header">
    <div class="container">
      <div class="row">
        <div class="col-xxl-12">
          <div class="header-content">
            <div class="header-left">
              <div class="brand-logo">
                <router-link to="/">
                  <img class="header-logo" src="@/assets/svg/logo-beta2.svg" alt="" />
                </router-link>
              </div>
            </div>
            <div class="header-right">
              <div class="selectnetwork dropdown" @click="activeDropDown('selectnetwork')"
                :class="active && 'show'">
                <div class="network" data-toggle="dropdown">
                  <img :src="useChainStore().chain.logoUrl" height=25 style="margin-left: 0.5rem;">
                  <span>{{ useChainStore().chain.fullName }}</span>
                  <img src="@/assets/svg/arrowDown.svg" alt="arrow down icon" style="margin-right: 0.5rem; width: 1rem" />
                </div>
                <div class="dropdown-menu dropdown-menu-right network-list mt-3" onclick="event.stopPropagation()" :class="active === 'selectnetwork' && 'show'">
                  <div class="box">
                    <div class="title">
                      <div class="title-header">
                        <div class="title-text">Networks</div>
                        <div>
                          <span style="font-size: 0.75rem; line-height: 1.25rem; color: rgb(100, 116, 139); font-weight: 600;">Testnet?</span>
                          <a-switch v-model:checked="showTestnet" checked-children="show" un-checked-children="hide" style="margin-left: 5px;" />
                        </div>
                      </div>
                    </div>
                    <div v-if="showTestnet" v-for="(chain, i) in testNet" :key="i">
                      <div class="network-items" @click="switchNetwork({...chain})">
                        <button style="padding: 12px 12px 12px 0px;">
                          <div style="display: flex; margin-right: 0.75rem; align-items: center; height: 1.25rem; width: 18px;">
                            <img v-if="useChainStore().chain.name === chain.name" src="@/assets/svg/checkBlack.svg"/>
                            <img v-if="useChainStore().chain.name !== chain.name" src="@/assets/svg/checkWhite.svg"/>
                          </div>
                          <div style="display: flex; white-space: nowrap; align-items: center; width: calc(100% - 18px); ">
                            <div style="position: relative; margin-right: 0.75rem; min-width: max-content; ">
                              <img :src="chain.logoUrl" height=25 style="margin-left: 0.5rem; margin-right: 0.5rem;" />
                            </div>
                            <div class="items-name">
                              <span class="item-title">{{ chain.fullName }}</span>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div v-for="(chain, i) in mainNet" :key="i">
                      <div class="network-items" @click="switchNetwork({...chain})">
                        <button style="padding: 12px 12px 12px 0px;">
                          <div style="display: flex; margin-right: 0.75rem; align-items: center; height: 1.25rem; width: 18px;">
                            <img v-if="useChainStore().chain.name === chain.name" src="@/assets/svg/checkBlack.svg"/>
                            <img v-if="useChainStore().chain.name !== chain.name" src="@/assets/svg/checkWhite.svg"/>
                          </div>
                          <div style="display: flex; white-space: nowrap; align-items: center; width: calc(100% - 18px); ">
                            <div style="position: relative; margin-right: 0.75rem; min-width: max-content; ">
                              <img :src="chain.logoUrl" height=25 style="margin-left: 0.5rem; margin-right: 0.5rem;" />
                            </div>
                            <div class="items-name">
                              <span class="item-title">{{ chain.fullName }}</span>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="profile_log dropdown" @click="activeDropDown('profile')" :class="active && 'show'">
                <div class="user" data-toggle="dropdown">
                  <img class="profile" :src="user?.photoURL" :size="64" referrerpolicy="no-referrer"/>
                  <span>{{ user.handle }}</span>
                  <img src="@/assets/svg/arrowDown.svg" alt="arrow down icon" style="margin-right: 0.5rem; width: 1rem"/>
                </div>
                <!-- dropdown menu -->
                <div style="opacity: 1; transform: translateY(0);">
                  <div class="dropdown-menu dropdown-menu-right mt-3" :class="active === 'profile' && 'show'">
                    <div class="user-email" style="border-bottom-width: 1px; border-color: #E5E7EB; border-style: dashed; ">
                      <div class="user2">
                        <span class="thumb"><img :src="user?.photoURL" :size="64" referrerpolicy="no-referrer" /></span>
                        <div class="user-info">
                          <h5>{{ user?.displayName }}</h5>
                          <span>{{
                            user && user.handle.length > 28
                            ? user?.handle.substring(0,6) + '...' + user?.handle.slice(-10)
                            : user?.handle
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="user-balance" style="border-bottom-width: 1px; border-color: #E5E7EB; border-style: dashed; ">
                      <div class="wallet-info">
                        <h5>Hexlink Account Address</h5>
                        <div class="user-wallet">
                          <div class="user2">
                            <img src="@/assets/svg/hexlinkCircle.svg" alt="hexlink logo" style="margin-right: 1rem;"/>
                            <div class="user-info">
                              <span style="margin-bottom: 0;" class="smart-contract-address">
                                <h5 @click="doCopy(account)">
                                  {{ addressTextLong(account) }}
                                </h5>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="false" style="margin-top: 20px; margin-bottom: 10px; margin-left: 24px; margin-right:24px;">
                      <router-link to="/?action=bind-auth-app">
                        <button class="connect-wallet-button">
                          Setup Auth App
                        </button>
                      </router-link>
                      <div style="font-size: 0.8em; font-weight: 350; margin-top: 15px;">
                        Setup Auth App for sending tokens, learn more
                      </div>
                    </div>
                    <router-link @click="signOutFirebase" to="signin" class="dropdown-item logout">
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
  <ScanQRCodeModal v-if="showScanQRCodeModal"></ScanQRCodeModal> 
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useChainStore } from '@/stores/chain';
import { createToaster } from "@meforma/vue-toaster";
import {
    GOERLI,
    MUMBAI,
    prettyPrintAddress,
    type Chain,
} from "../../../../functions/common";
import { signOutFirebase } from "@/services/auth";
import useClipboard from 'vue-clipboard3';
import ScanQRCodeModal from './ScanQRCodeModal.vue';
import { useRoute } from "vue-router";
import { getAccountAddress } from '@/web3/account';
import { switchNetwork } from "@/web3/network";

const authStore = useAuthStore();
const user = authStore.user!;
const active = ref<string>("");
const showTestnet = ref<boolean>(true);
const { toClipboard } = useClipboard();
const account = ref<string>("0x");

onMounted(async () => {
  account.value = await getAccountAddress();
});

const mainNet: Chain[] = [];
const testNet: Chain[] = [GOERLI, MUMBAI];

const addressTextLong = function (address: string | undefined) {
  if (address) {
    return prettyPrintAddress(address, 5, 6);
  }
  return "0x";
};

const root = ref<HTMLElement | null>(null);

const activeDropDown = async (value: any) => {
  active.value = active.value === value ? "" : value;
};

const closeDropDown = (e: any) => {
  if (root.value && !root.value.contains(e.target)) {
    active.value = "";
  }
};

const doCopy = (address: string | undefined) => {
  toClipboard(address || "0x").then(
    function () {
      const toaster = createToaster({ position: "top", duration: 2000 });
      toaster.success(`Copied`);
    },
    function () {
      const toaster = createToaster({ position: "top", duration: 2000 });
      toaster.error(`Can not copy`);
    }
  );
};

const showScanQRCodeModal = computed(() => {
  return useRoute().query.action == "bind-auth-app";
})

onMounted(() => {
  document.addEventListener('click', closeDropDown);
});

onBeforeUnmount(async () => {
  document.removeEventListener('click', closeDropDown);
});
</script>

<style lang="scss" scoped>
.header-title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  @media only screen and (max-width: 990px) {
    display: none; } }
.header-title h2 {
  margin-bottom: 0rem;
  font-size: 1.4rem;
  font-weight: 600; }
.header {
  background: #f0f0f0;
  padding: 30px 0px 20px 0px;
  width: 100%;
  z-index: 100; }
  @media only screen and (max-width: 990px) {
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
    @media only screen and (max-width: 990px) {
      .header .brand-logo {
        display: block;
        padding-right: 0; }
        // .header .brand-logo span {
        //   display: none; }
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
  align-items: center;
  @media only screen and (max-width: 576px) {
    margin-left: 5px;
  } }
.dark-light-toggle {
margin-right: 20px;
cursor: pointer; }
@media only screen and (max-width: 990px) {
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
  border-radius: 0.5rem;
  border-width: 1px;
  transition: 0.2s ease-in-out;
  border-color: #F3F4F6;
  cursor: pointer; }
  .profile_log .user:hover {
    transform: translateY(-0.125rem);
    fill: #076AE0;
    background-color: rgba(7, 106, 224, 0.15);
    border-color: rgb(48, 138, 245);
    color: rgb(7, 106, 224); }
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
.profile_log .user2 {
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
  cursor: pointer; }
  @media only screen and (max-width: 768px) {
    .profile_log .user2 {
      margin-right: 0.5rem;
      margin-left: 0rem; 
      transition: 0.2s ease-in-out; } }
  .profile_log .user2 span {
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin-right: 0.5rem;
    color: rgb(71, 85, 105); }
  // @media only screen and (max-width: 768px) {
  //   .profile_log .user2 span {
  //     display: none; } 
  // }
  .profile_log .user2 .profile {
    height: 25px;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    border-radius: 50px;
  }
  .profile_log .user2 .thumb {
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
    .profile_log .user2 .thumb img {
      border-radius: 50px;
      max-width: 38px; }
  .profile_log .user2 .arrow i {
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    margin-top: 6px;
    display: inline-block; }
    @media only screen and (max-width: 1199px) {
    .profile_log .user2 .arrow {
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
    justify-content: flex-start;
    svg {
      margin-right: 1rem; } }
  .profile_log .dropdown-menu .user2 {
    display: flex;
    align-items: center;
    justify-content: flex-start; }
  .profile_log .dropdown-menu .user-email {
    border: 0 solid #e5e7eb;
    padding: 30px 20px 20px 20px; }
    .profile_log .dropdown-menu .user-email .thumb {
      margin-right: 0.5rem; }
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
    border: 0 solid #e5e7eb;
    h5 {
      margin-bottom: 0; 
      font-weight: 350;} }
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
      color: #076AE0;
      font-weight: bold; }
    .profile_log .dropdown-menu .dropdown-item:hover, .profile_log .dropdown-menu .dropdown-item:focus, .profile_log .dropdown-menu .dropdown-item.active {
      background-color: #076AE0;
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
  width: auto;
  min-width: 15rem;
  z-index: 1;
  transition: height 0.3s ease-in-out;
  border-radius: 0.5rem; }
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
      fill: rgb(7, 106, 224);
      background-color: rgba(7, 106, 224, 0.15);
      border-color: rgb(73,108,233);
      color: rgb(7,106,224);
    }
    @media only screen and (max-width: 990px) {
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
    border-radius: 0.5rem;
    border-width: 1px;
    border-color: #F3F4F6;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    margin-right: 1rem; }
    .selectnetwork .network:hover {
      transform: translateY(-0.125rem);
      fill: #076AE0;
      background-color: rgba(7, 106, 224, 0.15);
      border-color: rgb(48,138,245);
      color: rgb(7,106,224);
    }
    @media only screen and (max-width: 768px) {
      .selectnetwork .network {
        margin-right: 0.5rem;
        margin-left: 0rem; } }
  .selectnetwork .network img {
    margin-right: -0.5rem; }
    @media only screen and (max-width: 768px) {
      .selectnetwork .network img {
        margin-right: 0.5rem; } }
  .selectnetwork .network span {
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin-right: 0.5rem;
    margin-left: 1rem;
    color: rgb(71,85,105); }
    @media only screen and (max-width: 768px) {
      .selectnetwork .network span {
        display: none; } }
  .selectnetwork .network .network-word {
    @media only screen and (max-width: 992px) {
      .selectnetwork .network .network-word {
        display: none; } } }
  .selectnetwork .dropdown-menu {
    margin-top: 0.75rem;
    box-shadow: 0 1.5rem 4rem rgba(22, 28, 45, 0.15); }
    .selectnetwork .dropdown-menu .box {
      overflow-y: auto;
      position: fixed;
      padding-top: 1.5rem;
      padding-bottom: 0.5rem;
      right: 1.5rem;
      max-height: 20rem;
      background-color: white;
      box-shadow: 0 1.5rem 4rem rgba(22, 28, 45, 0.15);
      background-clip: padding-box;
      border: 0px solid rgba(0, 0, 0, 0.15);
      border-radius: 0.5rem;
      width: auto;
      min-width: 18rem;
      @media (min-width: 640px) {
        position: absolute;
        left: 0;
        transform-origin: top left;
        max-height: 100vh;
        padding-top: 1.5rem;
        padding-bottom: 0.5rem;
        box-shadow: 0 1.5rem 4rem rgba(22, 28, 45, 0.15);
        background-clip: padding-box;
        border: 0px solid rgba(0, 0, 0, 0.15);
        border-radius: 0.5rem; } }
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
          font-size: 1rem;
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
        background-color: rgba(48, 138, 245,0.2);
      }

      @media (min-width: 640px) {
        padding-left: 1rem; } }
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
          width: auto;
          overflow: auto;
          white-space: nowrap; }
        .selectnetwork .dropdown-menu .box .network-items .items-name .item-balance {
          color: #6a6d7c;
          font-size: 0.875rem;
          font-weight: 400;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
.notify-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 9999px;
  opacity: 1;
  background-color: rgb(250, 62, 62);
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
.smart-contract-address h5:hover {
  background-color: rgba(7, 106, 224, 0.15);
}
.smart-contract-address h5 {
  margin-bottom: 0;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  background-color: #F3F4F6;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: 0.5rem; }
</style>
