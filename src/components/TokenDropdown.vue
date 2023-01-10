<template>
  <div class="total-choose-token">
    <div class="token-select">
      <div class="mode-dropdown" :class="chooseTotalDrop && 'active'" @click="chooseTotalDrop = !chooseTotalDrop;">
        <div class="token-icon">
          <img :src="redpacket.token.logo" />
        </div>
        <div class="mode-text2">{{ redpacket.token.label }}</div>
        <input class="mode-input" type="text" placeholder="select" readonly>
        <div class="mode-options">
          <div class="mode-option"
            v-for="(item, index) of useProfileStore().feasibleTokens"
            :key="index"
            @click="tokenChoose(
              'token',
              item.metadata.symbol,
              item.metadata.address,
              item.metadata.logoURI
            )">
            <div class="token-icon">
              <img :src="item.metadata.logoURI"/>
            </div>
            {{ item.metadata.symbol }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  
</script>