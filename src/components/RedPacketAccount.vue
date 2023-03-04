<template>
  <div style="display: flex; width: 100%; flex-direction: column; align-items: center;">
    <div class="check">
        <img :style="isChosen ? 'opacity: 1' : 'opacity: 0' " style="width: 20px; height: 20px;"
        src="https://i.postimg.cc/SRjdzYHP/check.png" />
    </div>
    <div :style="isChosen ? 'box-shadow: 8px 28px 50px rgb(39 44 49 / 7%), 1px 6px 12px rgb(39 44 49 / 4%); transform: translate3D(0, -1px, 0) scale(1.02); transition: all 0.2s ease; border: 2px solid #4BAE4F;' : ''"
        class="account-card" @click="chooseAccount">
        <div class="left">
            <div>
                <img class="wallet-image" :src="account.logo">
                <div class="chain_wrapper">
                    <img class="chain" :src="useChainStore().chain.logoUrl" />
                </div>
            </div>
        </div>
        <div class="right">
            <div style="min-width: 100px; margin-left: 0.5rem;">
                <h2>{{capitalize(account.name)}} Account</h2>
                <p>Available Balance</p>
            </div>
            <div class="balances">
                <span style="display: flex; align-items: center; margin-bottom: 5px;">
                    <a-tooltip placement="top">
                        <template #title>
                            <span>
                                Balance:
                                <b>{{ props.tokenBalance }}</b>
                                <copy-outlined style="margin-left: 0.5rem; margin-right: 0.5rem;"
                                    @click="copy(props.tokenBalance)" />
                            </span>
                        </template>
                        <span class="balance_item">
                            <p style="font-weight:600; display: flex; justify-content: flex-end;">
                                {{ props.tokenBalance.substring(0, 6) }}
                            </p>
                        </span>
                    </a-tooltip>
                    <img style="width:20px; height: 20px; margin-left: 5px; margin-right: 5px;" :src="token.logoURI" />
                    <span style="font-size: 12px;"><b>{{ token.symbol }}</b></span>
                </span>
                <!-- gas -->
                <span v-if="showGasToken" style="display: flex; align-items: center;">
                    <a-tooltip placement="bottom">
                        <template #title>
                            <span>
                                Balance:
                                <b>{{ gasTokenBalance }}</b>
                                <copy-outlined style="margin-left: 0.5rem; margin-right: 0.5rem;"
                                    @click="copy(gasTokenBalance)" />
                            </span>
                        </template>
                        <span class="balance_item">
                            <p style="font-weight:600; display: flex; justify-content: flex-end;">
                                {{gasTokenBalance.substring(0,6) }}
                            </p>
                        </span>
                    </a-tooltip>
                    <img style="width:20px; height: 20px; margin-left: 5px; margin-right: 5px;" :src="gasToken.logoURI" />
                    <span style="font-size: 12px;"><b>{{ gasToken.symbol }}</b></span>
                </span>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRedPacketStore } from "@/stores/redpacket";
import { useChainStore } from "@/stores/chain";
import { CopyOutlined } from '@ant-design/icons-vue';
import { useAccountStore } from "@/stores/account";
import { useWalletStore } from "@/stores/wallet";
import { copy } from "@/web3/utils";
import { useTokenStore } from "@/stores/token";

const props = defineProps({
    account: {
        type: String,
        required: true,
    },
    isChosen: {
        type: Boolean,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    tokenBalance: {
        type: String,
        required: true,
    },
    gasToken: {
        type: String,
        required: true,
    },
    gasTokenBalance: {
        type: String,
        required: true,
    },
});

const token = computed(() => {
    return useTokenStore().token(props.token);
});

const gasToken = computed(() => {
    return useTokenStore().token(props.gasToken);
});

const wallet = useWalletStore();
const account = computed(() => {
    if (props.account == "hexlink") {
        return {
            address: useAccountStore().account?.address,
            name: "Hexlink",
            logo: "https://i.postimg.cc/kXgZCB4L/hexlink.png"
        };
    } else {
        return {
            address: wallet.account?.address,
            name: wallet.wallet,
            logo: wallet.walletIcon,
        };
    }
});

const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

const emit = defineEmits(['selected'])
const chooseAccount = () => {
    emit('selected', props.account);
};

const showGasToken = computed(() => {
  return props.token != props.gasToken;
});
</script>

<style lang="less" scoped>
.check {
    position: relative;
    top: 12px;
    left: 150px;
    display: flex;
    justify-content: flex-end;
    z-index: 50;
    @media (min-width: 400px) {
        left: 9.5rem; } }
.account-card {
    background-color: #fff;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    display: flex;
    flex-direction: row;
    padding: 10px;
    width: 310px;
    min-height: 110px;
    transition: all 0.2s ease; }
.account-card:hover {
    box-shadow: 8px 28px 50px rgba(39, 44, 49, 0.07),
        1px 6px 12px rgba(39, 44, 49, 0.04);
    transform: translate3D(0, -1px, 0) scale(1.02);
    transition: all 0.2s ease; }
.left {
    display: flex;
    align-items: center;
    margin-right: 0.5rem;
    margin-top: 10px; }
.wallet-image {
    width: 40px;
    height: 40px;
    object-fit: cover;
    object-position: 50% 50%; }
.chain_wrapper {
    width: 15px;
    height: 15px;
    background-color: #f2f2f2;
    border-radius: 100%;
    position: relative;
    top: -13px;
    left: 25px; }
.chain_wrapper .chain {
    width: 15px;
    height: 15px;
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto auto; }
.right {
    display: flex;
    align-items: center;
h2 {
    font-weight: 500;
    font-size: 16px;
    margin: 3px 0; }
p {
    font-size: 12px;
    color: black;
    margin-bottom: 0rem; }
.balances {
    display: flex;
    flex-direction: column; } }
.balance_item {
    width: 4rem;
    overflow: auto;
    white-space: nowrap;
    line-height: 30px;
p {
    margin-bottom: 0rem;
    overflow: auto;
    font-size: 14px; } }
</style>
