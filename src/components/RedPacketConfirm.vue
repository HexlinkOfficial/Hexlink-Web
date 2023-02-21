<template>
  <div v-if="store.status === 'confirming'" class="claim-success-card transition" @wheel.prevent @touchmove.prevent @scroll.prevent >
    <router-link :to="props.mode == 'token' ? '/redpacket/send' : '/redpacket/airdropCollectable'">
      <img @click="closeModal" class="redpacket_close transition" src="@/assets/svg/close.svg"/>
    </router-link>
    <h2 class="transition">
      <span style="font-size: 20px; margin-top: 4rem;">{{ message }}</span><br>
    </h2>
    <div class="cta-container transition" style="margin-top: 340px;">
      <button class="cta" @click="createRedPacket">Confirm</button>
    </div>
    <div class="card_circle transition" style="margin-top: -100px;"></div>
  </div>
  <div v-if="store.status !== 'confirming'" class="claim-success-card transition">
    <h2 class="transition">
      <div class="spinner-lg" :class="store.status">
        <div class="check"></div>
      </div>
      <span style="font-size: 20px; margin-top: 1rem;">{{ message }}</span><br>
    </h2>
    <div class="cta-container transition" style="margin-top: 340px;">
      <button @click="closeModal" class="cta">Close</button>
    </div>
    <div class="card_circle transition" style="margin-top: -100px;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useRedPacketStore } from '@/stores/redpacket';
import { createNewRedPacket, createRedPacketErc721 } from "@/web3/redpacket";
import type { RedPacketInput, NftAirdrop } from "../../functions/redpacket";

const props = defineProps({
  mode: String
});

const message = ref<string>("Let's go!");
const store = useRedPacketStore();
const createRedPacket = async () => {
  store.setStatus("processing");
  message.value = "Processing";
  if(props.mode == 'token') {
    try {
      await createNewRedPacket(
        store.redpacket! as RedPacketInput,
        store.account == "hexlink",
        false // dryrun
      );
      message.value = "Done!";
      store.setStatus("success");
    } catch (e) {
      console.log("Failed to create redpacket with");
      console.log(e);
      store.setStatus("error");
      message.value = "Something went wrong...";
    }
  } else {
    try {
      await createRedPacketErc721(
        store.redpacket! as NftAirdrop,
        store.account == "hexlink",
        false // dryrun
      );
      message.value = "Done!";
      store.setStatus("success");
    } catch (e) {
      console.log("Failed to create redpacket with");
      console.log(e);
      store.setStatus("error");
      message.value = "Something went wrong...";
    }
  }
}

const router = useRouter();
const closeModal = () => {
  if (store.status == 'success') {
    router.push("/redpackets");
  }
  store.setStatus("");
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
  &.processing {
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
  position: fixed;
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
  background-color: #308AF5;
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
  background-color: #308AF5;
  padding: 10px 25px;
  border-radius: 50px;
  font-size: 17px;
  text-decoration: none;
  width: 13rem;
  font-weight: bold; }
.cta:hover {
  background-color: rgba(7,106,224,0.8); }
</style>