<template>
  <div class="box">
    <div class="amountOwned">
      <div class="nft_tab_shown">
        <div style="margin-right: 0.375rem; ">Owned</div>
        <div class="amount">12</div>
      </div>
    </div>
    <div>
      <div class="nft_grid">
        Coming Soon
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.box {
  padding: 1rem;
  @media (min-width: 640px) {
    padding: 1.5rem; } }
.amountOwned {
  display: flex;
  margin-bottom: 1.5rem;
  margin-left: 0.75rem;
  margin-left: 0.875rem; }
.nft_tab_shown {
  display: flex;
  padding-bottom: 0.25rem;
  align-items: center;
  border-bottom: 1px solid #262833;
  color: #262833;
  cursor: pointer; }
  .nft_tab_shown .amount {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    font-size: 0.75rem;
    line-height: 1rem;
    border-radius: 0.375rem;
    color: #fff;
    background-color: #262833; }
.nft_grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 1rem;
  row-gap: 1.5rem;
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 1.5rem; }
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: 1.5rem; }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, minmax(0, 1fr)); }
  @media (min-width: 1280px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    column-gap: 2rem; }
  @media (min-width: 1536px) {} }
.nft_card {
  position: relative;
  background-color: inherit;
  border-radius: 0.5rem;
  border: 1px solid #d9d9d9;
  cursor: pointer; }
.nft_card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-0.125rem);
  transition-property: all;
}
  .nft_card .nft_pic {
    display: flex;
    flex-shrink: 0;
    aspect-ratio: 1/1;
    background-color: #ecedef;
    overflow: hidden;
    align-items: center;
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem; }
    .nft_card .nft_pic .default-pic {
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgb(203,213,225);
      width: 100%;
      height: 100%; }
  .nft_card .nft_wallet_chain {
    display: flex;
    margin-right: 0.75rem;
    margin-top: -0.75rem;
    justify-content: flex-end; }
    .nft_card .nft_wallet_chain .items {
      display: flex;
      margin-left: -0.25rem;
      align-items: center; }
      .nft_card .nft_wallet_chain .items img {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 999px;
        object-fit: cover;
        --ring-color: #ffffff;
        box-shadow: 0 0 0 4px #fff; }
      .nft_card .nft_wallet_chain .items:hover {
        img {
          transform: translateY(-0.5rem); }
        .items_tag {
          display: inline-block; }
      }
  .nft_card .nft-info {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    margin-top: 0.75rem;
    margin-top: 0.875rem; }
    .nft_card .nft-info .collection_name {
      display: flex;
      font-size: 0.75rem;
      line-height: 1rem;
      color: #6a6d7c;
      justify-content: space-between;
      align-items: center; }
      .nft_card .nft-info .collection_name .collection_name_text {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap; }
.nft_title {
  display: block;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #262833;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  white-space: pre;
  margin-bottom: 0rem;
  margin-top: calc(0.75rem); }
.items_tag {
  visibility: visible;
  margin-bottom: 6rem;
  margin-left: -2.5rem;
  color: #fff;
  background: #222;
  border: 1px solid transparent;
  border-radius: 3px;
  display: none;
  font-size: 13px;
  padding: 8px 21px;
  position: fixed;
  pointer-events: none;
  transition: opacity 0.3s ease-out;
  z-index: 999; }
</style>

<script setup lang="ts">
import type { NFTOutput } from '@/services/graphql/nft';

const props = defineProps({
  nfts: {
    type: Object as () => NFTOutput[],
    required: true,
  },
});
</script>