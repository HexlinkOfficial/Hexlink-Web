<template>
  <div style="align-items: flex-start; flex-direction: column; max-width: 100%; min-height: 0px; min-width: 0px; flex-shrink: 0; flex-basis: auto; display: flex; margin-top: 32px;">
    <span style="margin-left: 0.875rem; font-size: 14px; line-height: 20px; font-weight: 700;">Upload file</span>
    <div class="upload-box" style="margin-top: 8px; padding: 0 0.87rem; width: 100%;">
      <div style="border: 2px dashed rgba(22, 22, 26, 0.1); min-height: 150px; padding: 32px 60px; position: relative; border-radius: 16px; -webkit-box-align: center; align-items: center; -webkit-box-pack: center; justify-content: center; flex-direction: column;">
        <input 
          hidden="" 
          accept="image/png,image/jpeg,image/gif,image/webp,video/mp4,video/webm,audio/mp3,audio/webm,audio/mpeg"
          name="primary-attachment" 
          type="file" 
          data-marker="Upload file" 
          style="display: none; position: fixed; left: -100vw; overflow: visible;"
        >
        <div style="display: flex; flex-direction: column; -webkit-box-align: center; align-items: center; -webkit-box-pack: center; justify-content: center;">
          <span style="margin-bottom: 16px; color: rgba(22, 22, 26, 0.6); font-size: 14px; line-height: 20px; text-align: center;">PNG, GIF, WEBP, MP4 or MP3. Max 100mb.</span>
          <button type="button" style="display: flex; align-items: center; justify-content: center; white-space: nowrap; border: 1px solid transparent; font-size: 0.875rem; border-radius: 50px; padding: 6px 16px; font-weight: 900; transition: all 0.15s ease-in-out 0s; transform-origin: center center; user-select: none; border-color: transparent; color: white; background: #076ae0; appearance: button;">
            <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; max-width: 100%;">Choose File</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="collection-name" style="align-items: flex-start; flex-direction: column; max-width: 100%; min-height: 0px; min-width: 0px; flex-shrink: 0; flex-basis: auto; display: flex; margin-top: 32px;">
    <span style="margin-left: 0.875rem; font-size: 14px; line-height: 20px; font-weight: 700;">Collection Name</span>
    <div style="width: 100%; padding: 0 0.87rem;">
      <div style="display: flex; justify-content: center; background: #f2f6fa; border: 1px solid transparent; transition: all 0.15s ease-in-out 0s; overflow: hidden; min-height: 48px; padding: 8px 14px; border-radius: 16px; font-size: 14px; align-items: center; padding: 0 0.87rem; margin-top: 8px;">
        <div
          style="display: flex; flex-direction: column; flex-grow: 1; flex-shrink: 1; padding: 0px 8px; align-items: stretch;">
          <input placeholder="e. g. &quot;Redeemable T-Shirt with logo&quot;" type="text" data-marker="Name" value=""
            style="overflow: hidden; padding: 0px; opacity: 1; color: rgba(22, 22, 26, 0.8); outline: none; -webkit-appearance: none; background: transparent; border: #909697 solid 0;">
        </div>
    </div>
    </div>
  </div>
  <div class="collection-symbol"
    style="align-items: flex-start; flex-direction: column; max-width: 100%; min-height: 0px; min-width: 0px; flex-shrink: 0; flex-basis: auto; display: flex; margin-top: 32px;">
    <span style="margin-left: 0.875rem; font-size: 14px; line-height: 20px; font-weight: 700;">Collection Symbol</span>
    <div style="width: 100%; padding: 0 0.87rem;">
      <div
        style="display: flex; justify-content: center; background: #f2f6fa; border: 1px solid transparent; transition: all 0.15s ease-in-out 0s; overflow: hidden; min-height: 48px; padding: 8px 14px; border-radius: 16px; font-size: 14px; align-items: center; padding: 0 0.87rem; margin-top: 8px;">
        <div
          style="display: flex; flex-direction: column; flex-grow: 1; flex-shrink: 1; padding: 0px 8px; align-items: stretch;">
          <input placeholder="e. g. &quot;Redeemable T-Shirt with logo&quot;" type="text" data-marker="Name" value=""
            style="overflow: hidden; padding: 0px; opacity: 1; color: rgba(22, 22, 26, 0.8); outline: none; -webkit-appearance: none; background: transparent; border: #909697 solid 0;">
        </div>
      </div>
    </div>
  </div>
  <div class="create">
    <button class="connect-wallet-button">
      Create
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
</script>

<style lang="less" scoped>
.connect-wallet-button {
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
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
    width: 200px; }
  @media (min-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    width: 200px; }
  @media (max-width: 640px) {
    width: 70%; }
  opacity: 1;
  background-color: rgb(7, 106, 224);
  color: white; }
.connect-wallet-button:hover {
  background-color: rgba(7, 106, 224,0.9); }
.create {
  display: flex;
  margin: 16px;
  margin-top: 32px;
  flex-direction: row-reverse;
  @media (max-width: 640px) {
    justify-content: center; } }
input:focus {
  outline: none;
  box-shadow: none; }
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0; }
</style>