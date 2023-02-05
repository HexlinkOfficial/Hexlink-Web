<template>
  <div class="box">
    <div>
      <div class="nft_grid">
        <!-- <div v-for="(nft, index) in props.nfts" :key="index" class="nft_card">
          <h1>{{ nft }}</h1>
        </div> -->
        <!-- <div class="nft_card">
          <div class="nft_pic">
            <div class="default-pic">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-full w-full max-w-[5rem] max-h-[5rem]">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
          </div>
          <div class="nft_wallet_chain">
            <div class="items">
              <img src="https://token.metaswap.codefi.network/assets/networkLogos/ethereum.svg"/>
              <div class="items_tag">
                Ethereum
              </div>
            </div>
          </div>
          <div class="nft-info">
            <div class="collection_name">
              <div class="collection_name_text">Invisible Mfers</div>
            </div>
            <p class="nft_title">invisible mfers #2725</p>
          </div>
        </div> -->
        <div v-for="(value, index) in nftImages" :key="index" class="nfts" :style=" 'background:' + value.color">
          <header class="nft_header">
            <img :src="value.url" width="540" height="540" />
          </header>
          <footer class="nft_footer">
            <div class="card_footer">
              <div class="card_details">
                <div class="card_details_box">
                  <div>
                    <div style="font-size: 0.75rem; line-height: 1rem; color: #6a6d7c;">
                      <div class="collection_name_text">Invisible Mfers</div>
                    </div>
                    <p class="nft_title">invisible mfers #2725</p>
                  </div>
                </div>
              </div>
              <!-- <div class="card_cta"><span>Be the first</span></div> -->
            </div>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { FastAverageColor } from 'fast-average-color';

interface nftImage {
  url: string,
  color: string
}

const nfts = [
  'https://i.seadn.io/gcs/files/e98dad5dbac144288475ab0d152cb45a.gif?auto=format&w=1000',
  'https://i.seadn.io/gcs/files/4afadc510eb17a8c96d25aecd23b001a.png?auto=format&w=1000',
  'https://i.seadn.io/gcs/files/503e8f8bd33777a560b3335689c9151f.png?auto=format&w=1000',
  'https://i.seadn.io/gcs/files/17c7e2250fb40d56525b23bcc7b53cbe.png?auto=format&w=1000',
  'https://i.seadn.io/gcs/files/649cd263c9518915328df38b2db1a6f3.png?auto=format&w=1000',
  'https://i.seadn.io/gae/QujNj-aJYUhkvETUDl0nGE95RI6uZtk023bCQwlInY62JVrZjMm7rbfFKCat0e0AybncAGElLlhsvarHIUf__G23IpFTbkLwVHm-kQ?auto=format&w=1000',
  'https://i.seadn.io/gcs/files/ea43d5579c02a90a77041fb6a36c1762.png?auto=format&w=1000',
  'https://i.seadn.io/gae/YVyDrv2lF27IX8G7spx3rHXs89G_DYhupoRlcBqRWo5-peJckMhQ-9W831ROMWLQPkqjRptHzF9pUaPB9kMaZEZEMy_s8vQhXgoYrg?auto=format&w=1000',
  'https://i.seadn.io/gae/Hjsjmua_NJtdJ5TXkYm7YsJqPqUX4hwBG5FpQi6g9oekbYuQMB6U894sHbB6bhgc9tyjNTqO8zG5uDfEv8Fj5df7M7dlpg_ng4yJ?auto=format&w=1000'
]
const imageColor = ref<string[]>([]);
const nftImages = ref<nftImage[]>([]);

const getBackcgroundColor = async (url: string) => {
  var output: string = "";
  const fac = new FastAverageColor();
  await fac.getColorAsync(url, { algorithm: 'dominant' })
    .then(color => {
      // container.style.backgroundColor = color.rgba;
      // container.style.color = color.isDark ? '#fff' : '#000';
      output = color.hex.toString();
    })
    .catch(e => {
      console.log(e);
      return e;
    });
  if (!imageColor.value.includes(output)) {
    imageColor.value.push(output);
    nftImages.value.push({
      url: url,
      color: output
    })
  }
}

const preloadColors = () => {
  nfts.map((n: string) => {
    getBackcgroundColor(n);
  });
  console.log(nftImages.value);
};

onMounted(() => {
  preloadColors();
})
</script>

<style lang="less" scoped>
.card_details_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  transition: opacity .3s ease-out; }
.card_details {
  position: relative;
  z-index: 1;
  border-radius: 10px;
  background-color: #ffffff;
  transform: scale(1);
  transition: transform .3s cubic-bezier(.195, 1.085, .575, 1.555); }
.nft_footer {
  padding: 0 16px 16px;
  display: block;
  position: relative;
  box-sizing: border-box;
  margin-top: 1rem; }
.nft_header {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  border-radius: 14px; }
.nft_header img {
  width: 100%;
  opacity: 1;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  transition: opacity .3s ease-out;
  border-radius: 14px }
.nfts {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 14px;
  transition: transform .2s cubic-bezier(.5, 1, .89, 1);
  box-shadow: 0 0 15px 1px rgb(0 0 0 / 10%); }
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