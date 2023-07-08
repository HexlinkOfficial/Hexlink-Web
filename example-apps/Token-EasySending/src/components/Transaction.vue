<template>
    <div style="display: flex;">
        <div class='icon'>
            <img src="@/assets/svg/createRedpacketSent.svg"/>
        </div>
        <div class="record-detail">
            <a-tooltip placement="top">
                <template #title>
                <span>
                    Check on blockchain explorer
                </span>
                </template>
                <a :href='exploerURI()' target="_blank">
                    {{ prettyPrint(props.userOp.userOpHash, 10, 4) }}
                </a>
            </a-tooltip>
            <div class="action-and-time" style="margin-left: 20px;">
                ({{ prettyPrintTime(props.userOp.sentAt) }})
            </div>
        </div>
        <div class="token-amount">
            <div class="sent-info">
                <div >
                  - {{ props.userOp.erc20Transfer.amount }}
                </div>
                <div class="token-icon" style="margin-right: 0.25rem; margin-left: 0.25rem;">
                    <img :src="props.userOp.erc20Transfer.token.logoURI">
                </div>
                {{ props.userOp.erc20Transfer.token.symbol }}
                <a-tooltip placement="top">
                    <template #title>
                    <span>
                        {{  props.userOp.erc20Transfer.to }}
                    </span>
                    </template>
                    <div style="margin-left: 10px">
                      -> {{ props.userOp.erc20Transfer.receipt }}
                    </div>
                </a-tooltip>
            </div>
            <div class="sent-info" style="margin-left: 20px;">
                <div class="sending-status">
                  <div v-if="props.userOp.status == 'pending' && errors <= MAX_TRIED" style="fontSize: 20px;">
                   <loading-outlined />
                  </div>
                  <div v-if="props.userOp.status == 'success'" style="color: green; fontSize: 20px;">
                    <check-circle-filled />
                  </div>
                  <div v-if="shouldDisplayFailed()" style="color: rgb(253, 71, 85); fontSize: 20px;">
                    <close-circle-filled />
                  </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { PropType, onMounted, ref } from 'vue';
import { type UserOp } from '@/stores/history';
import { useChainStore } from '@/stores/chain';
import { delay, prettyPrint, prettyPrintTime } from '@/web3/utils';
import { LoadingOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons-vue';
import { useHistoryStore } from '@/stores/history';
import { getPimlicoProvider } from '@/accountAPI/PimlicoBundler';

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
  userOp: {
    type: Object as PropType<UserOp>,
    required: true,
  }
});

const errors = ref<number>(0);
const MAX_TRIED = 5;

const exploerURI = () => {
    return `https://app.jiffyscan.xyz/userOpHash/${props.userOp.userOpHash}?network=${useChainStore().chain.name}`
}

const checkStatus = async () => {
    if (props.userOp.status != 'pending' || errors.value > MAX_TRIED) {
        return;
    }
    const bundler = getPimlicoProvider(useChainStore().chain);
    try {
        const result = await bundler.send(
            'eth_getUserOperationReceipt',
            [props.userOp.userOpHash]
        );
        if (result) {
          useHistoryStore().update(props.index, {
            ...props.userOp,
            status: result.success ? 'success' : 'failed',
          });
        } else {
          await delay(5000);
          checkStatus();
        }
    } catch(err) {
        console.log(err);
        errors.value += 1;
        await delay(5000);
        checkStatus();
    }
}

const shouldDisplayFailed = () => {
    return props.userOp.status == 'failed' || (
        props.userOp.status == 'pending' && errors.value > MAX_TRIED
    );
}

onMounted(checkStatus);
</script>

<style lang="less" scoped>
.mobile-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 55px;
  border-width: 1px;
  background-color: #4BAE4F; }
.transaction-amount {
  overflow: auto;
  white-space: nowrap;
  margin-left: 0.25rem;
  width: 60px;
  display: flex;
  justify-content: flex-end; }
.record-box {
  display: flex;
  align-items: center;
  border-top: 1px solid #e5e7eb;
  height: 4.5rem;
  padding-top: 0.5rem; }
.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 55px;
  border-width: 1px;
  background-color: #4BAE4F; }
.record-detail {
  display: grid;
  padding-left: 1rem;
  padding-right: 1rem;
  overflow-x: visible;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-y: visible;
  align-items: center;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  flex: 1 1;
  width: 100%;
  @media (min-width: 1280px) {
    gap: 1.5rem; }
  @media (min-width: 1024px) {
    gap: 1.25rem; } }
.action-and-time {
  display: flex;
  align-items: center;
  grid-column: span 1/span 1;
  margin-bottom: 0; }
.token-amount {
  display: flex;
  align-items: center;
  grid-column: span 1/span 1;
  margin-bottom: 0;
  margin-left: -1.5rem; }
.sent-info {
  display: flex;
  align-items: center;
  flex-shrink: 1;
  white-space: nowrap;
  font-size: 0.875rem;
  color: #000; }
</style>