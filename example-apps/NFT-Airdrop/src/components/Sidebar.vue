<template>
  <div class="sidebar">
    <div class="brand-logo">
      <router-link to="/"><img src="@/assets/svg/logo-beta.svg" alt="" />
      </router-link>
    </div>
    <div class="menu">
      <ul>
        <li>
          <router-link to="/airdrop" data-toggle="tooltip" data-placement="right" title="Wallet" :class="active === 1 && 'active'">
            <div style="width: 20px; height: 20px;">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_131_13)">
              <path d="M10.625 7.5V12.5H11.875C12.1485 12.5 12.4102 12.5586 12.6446 12.6641L17.336 7.5H16.2305C16.2422 7.29297 16.25 7.08594 16.25 6.875C16.25 4.37891 15.3829 2.14219 14.0196 0.651953C17.5782 1.92461 19.2735 4.78906 19.836 6.78125C19.9415 7.15234 19.6133 7.5 19.2618 7.5H19.0274L13.5469 13.5273C13.6758 13.7812 13.75 14.0703 13.75 14.375V18.125C13.75 19.1602 12.9102 20 11.875 20H8.08989C7.08989 20 6.21489 19.1602 6.21489 18.125V14.375C6.21489 14.0703 6.32427 13.7812 6.45317 13.5273L0.973483 7.5H0.737936C0.351608 7.5 0.0579753 7.15234 0.163366 6.78125C0.728171 4.78906 2.42075 1.92461 5.98052 0.651953C4.61723 2.14219 3.75005 4.37891 3.75005 6.875C3.75005 7.08594 3.7563 7.29297 3.76841 7.5H2.66294L7.35552 12.6641C7.58989 12.5586 7.81645 12.5 8.08989 12.5H9.33989V7.5H5.01958C5.00786 7.29297 4.96489 7.08594 4.96489 6.875C4.96489 4.88281 5.62114 3.12539 6.57036 1.8918C7.51958 0.659766 8.74224 0 9.96489 0C11.2579 0 12.4805 0.659766 13.4297 1.8918C14.379 3.12539 15 4.88281 15 6.875C15 7.08594 14.9922 7.29297 14.9805 7.5H10.625Z" fill="#9FA4A6"/>
              </g>
              <defs>
              <clipPath id="clip0_131_13">
              <rect width="20" height="20" fill="white"/>
              </clipPath>
              </defs>
              </svg>
            </div>
          </router-link>
        </li>
        <!-- testwallet -->
        <li>
          <router-link to="/" data-toggle="tooltip" data-placement="right" title="Wallet" :class="active === 1 && 'active'">
            <div style="width: 20px; height: 20px;">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5 1.25C18.1914 1.25 18.75 1.80977 18.75 2.5C18.75 3.19023 18.1914 3.75 17.5 3.75H3.125C2.77969 3.75 2.5 4.03125 2.5 4.375C2.5 4.71875 2.77969 5 3.125 5H17.5C18.8789 5 20 6.12109 20 7.5V16.25C20 17.6289 18.8789 18.75 17.5 18.75H2.5C1.11914 18.75 0 17.6289 0 16.25V3.75C0 2.36914 1.11914 1.25 2.5 1.25H17.5ZM16.25 13.125C16.9414 13.125 17.5 12.5664 17.5 11.875C17.5 11.1836 16.9414 10.625 16.25 10.625C15.5586 10.625 15 11.1836 15 11.875C15 12.5664 15.5586 13.125 16.25 13.125Z" fill="#9FA4A6"/>
              </svg>
            </div>
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
            <span class="icon-grey"><i class="fa-solid fa-arrow-right-from-bracket" style="font-size: 20px;"></i></span>
          </router-link>
        </li>
      </ul>

      <p class="copyright">&#169; <router-link to="#">Hexlink</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { signOutFirebase } from "@/services/auth";

const props = defineProps({
  active: Number
});
</script>

<style lang="less" scoped>
#app {
  overflow: hidden; }
.sidebar {
  background: #fff;
  position: fixed;
  left: 20px;
  height: calc(95%);
  width: 6.5rem;
  top: 2.5%;
  z-index: 3;
  bottom: 20px;
  border-radius: 25px;
  z-index: 100; }
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
      padding: 15px;
      display: inline-block;
      margin-bottom: 20px;
      border-radius: 15px; }
      .menu ul li a:hover, 
      .menu ul li a:focus, 
      .menu ul li a:active {
        background: rgba(7,106,224,0.1);
        .menu ul li:hover a:hover svg path {
          fill: #076AE0;
          opacity: 1; } }
      .menu ul li a.router-link-active {
        background: rgba(7,106,224,0.15); }
        .menu ul li a.router-link-active svg path {
          fill: #076AE0;
          opacity: 1; }
      .menu ul li a i {
        color: #9fa4a6; }
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