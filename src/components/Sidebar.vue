<template>
  <div class="sidebar">
    <div class="brand-logo">
      <router-link to="/"><img src="../assets/logo/blue-logo.svg" alt="" />
      </router-link>
    </div>
    <div class="menu">
      <ul>
        <li>
          <router-link to="/redpacket" data-toggle="tooltip" data-placement="right" title="Wallet" :class="active === 1 && 'active'">
            <span class="icon-grey">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink">
                <rect width="24" height="24" fill="url(#pattern0)" />
                <defs>
                  <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlink:href="#image0_224_35" transform="scale(0.00195312)" />
                  </pattern>
                  <image id="image0_224_35" width="512" height="512"
                    xlink:href="data:image/png;base64,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" />
                </defs>
              </svg>
            </span>
          </router-link>
        </li>
        <!-- testwallet -->
        <li>
          <router-link to="/" data-toggle="tooltip" data-placement="right" title="Wallet"
            :class="active === 1 && 'active'">
            <span class="icon-grey"><i class="icofont-wallet"></i></span>
          </router-link>
        </li>
        <!-- transactions -->
        <li>
          <router-link to="/transactions" data-toggle="tooltip" data-placement="right" title="Home"
            :class="active === 2 && 'active'">
            <span class="icon-grey"><i class="icofont-page"></i></span>
          </router-link>
        </li>
        <!-- signout -->
        <li class="logout">
          <router-link 
            @click="signOutFirebase"
            to="/signin"
            data-toggle="tooltip"
            data-placement="right"
            title="Signout"
          >
            <span class="icon-grey"><i class="icofont-logout"></i></span>
          </router-link>
        </li>
      </ul>

      <p class="copyright">&#169; <router-link to="#">Hexlink</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router';
import { signOutFirebase } from "@/services/auth";

const props = defineProps({
  active: Number
});
</script>

<style lang="less" scoped>
.sidebar {
  background: #fff;
  position: fixed;
  left: 20px;
  height: calc(95%);
  width: 6.5rem;
  top: 2.5%;
  z-index: 3;
  bottom: 20px;
  border-radius: 25px; }
  // @media only screen and (max-width: 1023px) {
  //   .sidebar {
  //     width: 5rem;
  //     transition: 0.4s ease-in-out;
  //     overflow: hidden; } }
  @media only screen and (max-width: 990px) {
    .sidebar {
      top: auto;
      bottom: 0;
      width: 100%;
      height: 60px;
      left: 0;
      border-radius: 0px; } }
.brand-logo {
  text-align: center;
  margin-top: 30px; }
  .brand-logo img {
    max-width: 47px; }
  @media only screen and (max-width: 990px) {
    .brand-logo {
      display: none; } }
.menu {
  margin-top: 100px; }
  @media only screen and (max-width: 990px) {
    .menu {
      margin-top: 4px; } }
  @media only screen and (max-width: 990px) {
    .menu ul {
      display: flex;
      justify-content: space-around;
      align-items: center; } }
  .menu ul li {
    list-style-type: none;
    text-align: center; }
    .menu ul li a {
      padding: 10px 15px;
      display: inline-block;
      margin-bottom: 20px;
      border-radius: 15px; }
      .menu ul li a:hover, 
      .menu ul li a:focus, 
      .menu ul li a:active {
        background: rgba(7,106,224,0.1);
        .menu ul li:hover a:hover i {
          color: #076AE0;
          font-size: 24px;
          opacity: 1; } }
      .menu ul li a.router-link-active {
        background: rgba(7,106,224,0.15); }
        .menu ul li a.router-link-active i {
          color: #076AE0;
          font-size: 24px;
          opacity: 1; }
      .menu ul li a i {
        color: #9fa4a6;
        font-size: 24px; }
    .menu ul li.logout {
      position: absolute;
      bottom: 50px;
      left: 0;
      right: 0; }
      @media only screen and (max-width: 990px) {
        .menu ul li.logout {
          position: relative;
          bottom: 0;
          left: auto;
          right: auto; } }
.copyright {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 14px;
  color: #000; }
  .copyright a {
    color: #000;
    font-size: 12px; }
  @media only screen and (max-width: 990px) {
    .copyright {
      display: none; } }
</style>