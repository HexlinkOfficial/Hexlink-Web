<template>
  <div v-if="claimStatus == ''" class="claim-success-card transition">
    <router-link to="/redpacket/send">
      <svg class="redpacket_close transition" width="30" height="30" viewBox="0 0 30 30" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4.3949 4.39481C6.84957 1.94033 10.0794 0.412944 13.534 0.0729118C16.9886 -0.267121 20.4542 0.601242 23.3403 2.53003C26.2264 4.45882 28.3544 7.32869 29.3617 10.6506C30.3691 13.9725 30.1933 17.541 28.8645 20.7479C27.5357 23.9547 25.136 26.6016 22.0743 28.2375C19.0127 29.8734 15.4785 30.3971 12.074 29.7193C8.66957 29.0415 5.60545 27.2041 3.40381 24.5204C1.20218 21.8366 -0.000751884 18.4724 6.47942e-06 15.0011C-0.001827 13.0309 0.38547 11.0798 1.13966 9.25966C1.89386 7.43954 3.0001 5.78629 4.3949 4.39481ZM18.8931 9.52218L20.4875 11.119C20.6687 11.3019 20.7703 11.5489 20.7703 11.8063C20.7703 12.0637 20.6687 12.3107 20.4875 12.4936L17.9702 15.0011L20.4875 17.5184C20.6687 17.7013 20.7703 17.9483 20.7703 18.2057C20.7703 18.4632 20.6687 18.7102 20.4875 18.8931L18.8931 20.4874C18.7103 20.6686 18.4633 20.7702 18.2058 20.7702C17.9484 20.7702 17.7014 20.6686 17.5185 20.4874L15.0012 17.9701L12.4839 20.4874C12.3011 20.6686 12.054 20.7702 11.7966 20.7702C11.5392 20.7702 11.2922 20.6686 11.1093 20.4874L9.52227 18.8931C9.34111 18.7102 9.23948 18.4632 9.23948 18.2057C9.23948 17.9483 9.34111 17.7013 9.52227 17.5184L12.0322 15.0011L9.52227 12.4838C9.34111 12.301 9.23948 12.054 9.23948 11.7965C9.23948 11.5391 9.34111 11.2921 9.52227 11.1092L11.1093 9.52218C11.2922 9.34102 11.5392 9.23939 11.7966 9.23939C12.054 9.23939 12.3011 9.34102 12.4839 9.52218L15.0012 12.0321L17.5185 9.52218C17.7014 9.34102 17.9484 9.23939 18.2058 9.23939C18.4633 9.23939 18.7103 9.34102 18.8931 9.52218ZM15.0012 2.57337C12.1254 2.57351 9.33867 3.57077 7.11573 5.39526C4.8928 7.21974 3.37125 9.75854 2.81034 12.5791C2.24942 15.3997 2.68385 18.3274 4.03959 20.8636C5.39533 23.3998 7.58851 25.3874 10.2454 26.4878C12.9024 27.5882 15.8586 27.7333 18.6106 26.8984C21.3625 26.0635 23.7398 24.3002 25.3374 21.9091C26.935 19.5179 27.6541 16.6467 27.3721 13.7848C27.0901 10.9228 25.8246 8.24723 23.791 6.2138C22.6373 5.05871 21.2671 4.14257 19.7588 3.51788C18.2505 2.8932 16.6338 2.57223 15.0012 2.57337Z"
          fill="white" />
      </svg>
    </router-link>
    <h2 class="transition">
      <!-- <i class="fa fa-check-circle-o fa-5x" aria-hidden="true"></i> -->
      <!-- <div class="spinner-lg">
        <div class="check"></div>
      </div> -->
      <span style="font-size: 20px; margin-top: 1rem;">Are you Sure?</span><br>
    </h2>
    <div class="cta-container transition" style="margin-top: 340px;">
      <button class="cta" @click="createRedPacket">Create Red Packet</button>
    </div>
    <div class="card_circle transition" style="margin-top: -100px;"></div>
  </div>
  <div v-if="claimStatus !== ''" class="claim-success-card transition">
    <router-link to="/redpacket/send">
      <svg class="redpacket_close transition" width="30" height="30" viewBox="0 0 30 30" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4.3949 4.39481C6.84957 1.94033 10.0794 0.412944 13.534 0.0729118C16.9886 -0.267121 20.4542 0.601242 23.3403 2.53003C26.2264 4.45882 28.3544 7.32869 29.3617 10.6506C30.3691 13.9725 30.1933 17.541 28.8645 20.7479C27.5357 23.9547 25.136 26.6016 22.0743 28.2375C19.0127 29.8734 15.4785 30.3971 12.074 29.7193C8.66957 29.0415 5.60545 27.2041 3.40381 24.5204C1.20218 21.8366 -0.000751884 18.4724 6.47942e-06 15.0011C-0.001827 13.0309 0.38547 11.0798 1.13966 9.25966C1.89386 7.43954 3.0001 5.78629 4.3949 4.39481ZM18.8931 9.52218L20.4875 11.119C20.6687 11.3019 20.7703 11.5489 20.7703 11.8063C20.7703 12.0637 20.6687 12.3107 20.4875 12.4936L17.9702 15.0011L20.4875 17.5184C20.6687 17.7013 20.7703 17.9483 20.7703 18.2057C20.7703 18.4632 20.6687 18.7102 20.4875 18.8931L18.8931 20.4874C18.7103 20.6686 18.4633 20.7702 18.2058 20.7702C17.9484 20.7702 17.7014 20.6686 17.5185 20.4874L15.0012 17.9701L12.4839 20.4874C12.3011 20.6686 12.054 20.7702 11.7966 20.7702C11.5392 20.7702 11.2922 20.6686 11.1093 20.4874L9.52227 18.8931C9.34111 18.7102 9.23948 18.4632 9.23948 18.2057C9.23948 17.9483 9.34111 17.7013 9.52227 17.5184L12.0322 15.0011L9.52227 12.4838C9.34111 12.301 9.23948 12.054 9.23948 11.7965C9.23948 11.5391 9.34111 11.2921 9.52227 11.1092L11.1093 9.52218C11.2922 9.34102 11.5392 9.23939 11.7966 9.23939C12.054 9.23939 12.3011 9.34102 12.4839 9.52218L15.0012 12.0321L17.5185 9.52218C17.7014 9.34102 17.9484 9.23939 18.2058 9.23939C18.4633 9.23939 18.7103 9.34102 18.8931 9.52218ZM15.0012 2.57337C12.1254 2.57351 9.33867 3.57077 7.11573 5.39526C4.8928 7.21974 3.37125 9.75854 2.81034 12.5791C2.24942 15.3997 2.68385 18.3274 4.03959 20.8636C5.39533 23.3998 7.58851 25.3874 10.2454 26.4878C12.9024 27.5882 15.8586 27.7333 18.6106 26.8984C21.3625 26.0635 23.7398 24.3002 25.3374 21.9091C26.935 19.5179 27.6541 16.6467 27.3721 13.7848C27.0901 10.9228 25.8246 8.24723 23.791 6.2138C22.6373 5.05871 21.2671 4.14257 19.7588 3.51788C18.2505 2.8932 16.6338 2.57223 15.0012 2.57337Z"
          fill="white" />
      </svg>
    </router-link>
    <h2 class="transition">
      <!-- <i class="fa fa-check-circle-o fa-5x" aria-hidden="true"></i> -->
      <div class="spinner-lg" :class="claimStatus">
          <div class="check"></div>
        </div>
      <span style="font-size: 20px; margin-top: 1rem;">Are you Sure?</span><br>
    </h2>
    <div class="cta-container transition" style="margin-top: 340px;">
      <router-link to="/redpacket/send">
        <button class="cta">Close</button>
      </router-link>
    </div>
    <div class="card_circle transition" style="margin-top: -100px;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRedPacketStore } from '@/stores/redpacket';
import { useProfileStore } from '@/stores/profile';
import { useNetworkStore } from '@/stores/network';
import { isContract } from "@/web3/account";
import { deployAndCreateNewRedPacket, createNewRedPacket } from "@/web3/redpacket";

const claimStatus = ref<string>("");

const createRedPacket = async () => {
  claimStatus.value = 'loading';
  try {
    const account = useProfileStore().account;
    if (await isContract(account!.address)) {
      await createNewRedPacket(
        useNetworkStore().network!,
        useRedPacketStore().redpacket,
        useRedPacketStore().useHex,
      );
    } else {
      await deployAndCreateNewRedPacket(
        useNetworkStore().network!,
        useRedPacketStore().redpacket,
        useRedPacketStore().useHex,
      );
    }
    claimStatus.value = 'success';
  } catch (e) {
    console.log("Failed to claim redpacket with error " + e);
    claimStatus.value = 'error';
  }
}
</script>

<style lang="less" scoped>
.spinner-lg {
  .generate-spinner(); }
.generate-spinner(
  @radius: 60px,
  @border-width: 12px,
  @check-thickness: 12px,
  @success-color: #fff,
  @error-color: #fff,
  @default-color: #fff,
  @background-color: #FD4755,
) {
  @check-size: @radius * .57;
  display: inline-block;
  // background-color: @background-color;
  width: (@radius * 2);
  height: (@radius * 2);
  position: relative;
  box-sizing: border-box;
  border: @border-width solid @default-color;
  border-radius: @radius;
  transition: border-color 200ms;
  &.success {
    .context-class('success'); }
  &.error {
    .context-class('error'); }
  &.loading {
    border-color: @background-color;
    &:before {
      opacity: 1; }
    > div {
      opacity: 0; } }
  @check-height: 1.8837209302 * @check-size;
  .check {
    opacity: 1;
    transition: opacity 200ms;
    position: absolute;
    top: @radius - (@check-height / 1.8) - @border-width;
    left: @radius - (@check-size / 2) - @border-width;
    height: @check-height;
    width: @check-size;
    transform: rotate(45deg);
    transition-property: transform, height, width, top, left;
    transition-duration: 200ms, 200ms, 200ms, 200ms, 200ms;
    &:before, &:after {
      .pseudo-block();
      position: absolute;
      background-color: @default-color;
      transition-property: left, top, height, width;
      transition-duration: 200ms, 200ms, 200ms, 200ms;
      border-radius: 20px; }
    &:before {
      width: @check-thickness;
      height: @check-height;
      left: @check-size - @check-thickness;
      top: 0; }
    &:after {
      width: @check-size;
      height: @check-thickness;
      left: 0;
      top: @check-height - @check-thickness; } }
  &.error .check {
    transform: rotate(-135deg);
    height: @check-height;
    width: @check-height;
    top: @radius - (@check-height / 2) - @border-width;
    left: @radius - (@check-height / 2) - @border-width;
    &:before {
      height: @check-height;
      left: 25.7116279064px; }
    &:after {
      width: @check-height;
      top: 25.7116279064px; } }
  // spinning part
  &:before {
    .pseudo-block();
    opacity: 0;
    background: none;
    padding: 0;
    margin: 0;
    position: absolute;
    top: -@border-width;
    left: -@border-width;
    box-sizing: border-box;
    height: @radius;
    width: @radius;
    border-radius: @radius 0 0 0;
    border: @border-width solid @default-color;
    border-bottom: none;
    border-right: none;
    transform: rotate(0deg);
    transform-origin: bottom right;
    transition: opacity 200ms;
    animation-name: check-loading-spinner;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-timing-function: linear; }
  // @mixin
  .context-class(@name) {
    @color: color(~"@{@{name}-color}");
    border-color: @color;
    &:before {
      border-color: @color; }
    > div {
      &:before, &:after {
        background-color: @color; } } } }
@keyframes check-loading-spinner {
  from {
    transform: rotate(0deg); }
  to {
    transform: rotate(360deg); } }
.pseudo-block() {
  content: '';
  display: block; }
.redpacket_close {
  position: absolute;
  z-index: 50;
  margin: 0.5rem 0;
  right: 0.5rem; }
.claim-success-card {
  background-color: #fff;
  position: absolute;
  margin: auto;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  border-radius: 15px;
  overflow: hidden;
  z-index: 55; 
  box-shadow: 0px 10px 20px rgb(0 0 0 / 10%);
  height: 430px;
  width: 330px;
  color: white;
  @media (max-width: 990px) {
    top: 50vh;
    left: 50%; } }
.claim-success-card .card_circle {
  height: 400px;
  width: 450px;
  background-color: #FD4755;
  position: absolute;
  border-radius: 0;
  margin-left: -80px;
  margin-top: -130px; }
.claim-success-card h2 {
  text-align: center;
  position: absolute;
  z-index: 55;
  font-size: 26px;
  width: 100%;
  margin-top: 80px;
  color: #fff;
  display: flex;
  align-items: center;
  flex-direction: column; }
.claim-success-card h2 small {
  font-weight: normal;
  font-size: 65%;
  color: #fff; }
.claim-success-card h2 i {
  color: #fff; }
.transition {
  transition: .3s cubic-bezier(.3, 0, 0, 1.3) }
.cta-container {
  display: flex;
  justify-content: center;
  text-align: center;
  margin-top: 310px;
  position: absolute;
  z-index: 55;
  width: 100%; }
.cta {
  color: #fff;
  background-color: #FD4755;
  padding: 10px 25px;
  border-radius: 50px;
  font-size: 17px;
  text-decoration: none;
  width: 13rem;
  font-weight: bold; }
.cta:hover {
  background-color: rgba(253,71,85,0.8); }
</style>