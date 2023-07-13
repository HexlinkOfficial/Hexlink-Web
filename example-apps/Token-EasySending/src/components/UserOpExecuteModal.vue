<template>
  <div v-if="step == 'send_and_validate_otp'" class="form-send">
    <div style="display: block;">
      <img src="@/assets/svg/password.svg" style="width: 50px; height: 50px; margin: 1rem 0;" alt="send icon" />
      <h2 class="people-title">Enter Verification Code</h2>
      <div class="people-text">Enter code that we have sent to <b>{{ userHandle }}</b></div>
      <div class="social-login" style="flex-direction: column;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <input v-for="(arr, index) in code" :key="index" type="number" pattern="\d*" :id="'input_' + index"
            maxlength="1" v-model="code[index]" @input="handleInput" @keypress="isNumber" @keydown.delete="handleDelete"
            @paste="onPaste" class="otp" />
        </div>
        <p v-if="otpSent && countDown > 0" class="resend-plain">Resend the verification code in {{ countDown }}s.</p>
        <a v-if="otpSent && countDown <= 0" class="resend" @click="resendOtp">Resend the verification code.</a>
      </div>
    </div>
    <button class="cta-button" style="margin-bottom: 0px;" :disabled='otpSent && invalidOtp' @click="sendOrValidateOtp">
      {{ otpPrompt() }}
    </button>
  </div>
  <div v-if="step === 'post_process'" class="form-send">
    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
      <h2 class="transition" style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
        <div class="spinner-lg">
          <div class="check"></div>
        </div>
        <span style="font-size: 20px; margin: 20px 10px; text-align: center;">{{ message }}</span>
      </h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPimlicoProvider } from '@/accountAPI/PimlicoBundler';
import { printOp } from '@/accountAPI/opUtils';
import { genAndSendOtp, signUserOp } from '@/services/auth';
import { useAuthStore } from '@/stores/auth';
import { useChainStore } from '@/stores/chain';
import { useHistoryStore, UserOp } from '@/stores/history';
import { genUserOpInfo, getHexlinkAccountApi } from '@/web3/userOp';
import { createNotification } from '@/web3/utils';
import { resolveProperties } from 'ethers/lib/utils';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { deepHexlify } from "@account-abstraction/utils";
import { UserOpInfo, useUserOpStore } from "@/stores/userOp";

const keysAllowed: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",];
let code: string[] = Array(6);
let dataFromPaste: string[] | undefined;
const message = ref<string>("Let's go!");
const invalidOtp = ref<boolean>(true);
const countDown = ref<number>(60);
const otpSent = ref<boolean>(false);
const step = ref<string>("send_and_validate_otp");
const processing = ref<boolean>(false);
const userHandle = computed(() => {
  return useAuthStore().user?.handle;
});

onMounted(() => otpSent.value = false);

const countDownTimer = () => {
  countDown.value = 60;
  let interval = setInterval(() => {
    if (countDown.value <= 0) {
      clearInterval(interval);
    } else {
      countDown.value--;
    }
  }, 1000);
}

const resendOtp = async () => {
  countDownTimer();
  const result: any = await genAndSendOtp(
    useUserOpStore().opInfo.signedMessage!
  );
  if (result === 429) {
    console.error("Too many requests to send otp.");
    createNotification("Too many requests to send otp.", "error");
  }
}

const handleDelete = (event: Event) => {
  let value = (event.target as HTMLInputElement).value;
  let currentActiveElement = event.target as HTMLInputElement;
  if (!value)
    (currentActiveElement.previousElementSibling as HTMLElement)?.focus();
}

const sendOrValidateOtp = async () => {
  if (otpSent.value) {
    await validateOtpAndSign();
  } else {
    await sendOtp();
  }
}

const otpPrompt = () => {
  if (!otpSent.value && processing.value) {
    return "Sending";
  } else if (!otpSent.value) {
    return "Send Passcode"
  } else if (otpSent.value && processing.value) {
    return "Verifying";
  } else if (otpSent.value) {
    return "Verify";
  }
}

const sendOtp = async () => {
  processing.value = true;
  try {
    const opInfo = await genUserOpInfo(useUserOpStore().op);
    useUserOpStore().updateOpInfo(opInfo);
    await genAndSendOtp(opInfo.signedMessage);
    otpSent.value = true;
    countDownTimer();
  } catch (err) {
    console.log(err);
    createNotification(err as string, "error");
  }
  processing.value = false;
}

const validateOtpAndSign = async () => {
  const op = useUserOpStore().op;
  const opInfo = useUserOpStore().opInfo as UserOpInfo;
  processing.value = true;
  try {
    message.value = "Signing your transaction...";
    const api = getHexlinkAccountApi();
    op.signature = await signUserOp(opInfo, code.join(""));
    message.value = "Sending your transaction...";
    console.log(`Signed UserOperation: ${await printOp(op)}`);
    const bundler = getPimlicoProvider(useChainStore().chain);
    const hexifiedUserOp = deepHexlify(await resolveProperties(op));
    const uoHash = await bundler.send(
      "eth_sendUserOperation",
      [hexifiedUserOp, api.entryPointAddress]
    );
    console.log(`user op ${uoHash} sent...`);
    message.value = "Transaction sent! Check the status at your transaction history.";
    step.value = 'post_process';

    const now = new Date();
    useHistoryStore().add({
      userOpHash: uoHash,
      type: useUserOpStore().opInfo.txType,
      metadata: useUserOpStore().opInfo.txMetadata,
      status: "pending",
      sentAt: now,
      updatedAt: now,
    } as UserOp);
  } catch (error: any) {
    console.log(error);
    message.value = "Failed to validate the code";
    createNotification(error.message, "error");
  }
  processing.value = false;
}

const handleInput = (event: Event) => {
  const inputType = (event as InputEvent).inputType;
  let currentActiveElement = event.target as HTMLInputElement;
  if (currentActiveElement.id.split("_")[1] === "5") {
    invalidOtp.value = false;
  }
  if (inputType === "insertText")
    (currentActiveElement.nextElementSibling as HTMLElement)?.focus();
  if (inputType === "insertFromPaste" && dataFromPaste) {
    for (const num of dataFromPaste) {
      let id: number = parseInt(currentActiveElement.id.split("_")[1]);
      currentActiveElement.value = num;
      code[id] = num;
      if (currentActiveElement.nextElementSibling) {
        currentActiveElement =
          currentActiveElement.nextElementSibling as HTMLInputElement;
        (currentActiveElement.nextElementSibling as HTMLElement)?.focus();
      }
    }
  }
}

const onPaste = (event: Event) => {
  dataFromPaste = (event as ClipboardEvent).clipboardData
    ?.getData("text").trim().split("");
  if (dataFromPaste) {
    invalidOtp.value = false;
    for (const num of dataFromPaste) {
      if (!keysAllowed.includes(num)) event.preventDefault();
    }
  }
}

const isNumber = (event: Event) => {
  (event.currentTarget as HTMLInputElement).value = "";
  const keyPressed: string = (event as KeyboardEvent).key;
  if (!keysAllowed.includes(keyPressed)) {
    event.preventDefault();
  }
}
</script>


<style lang="less" scoped>
.form-send {
  position: static;
  border-radius: 15px;
  overflow: visible;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1.25rem;
  justify-content: space-between;
}

.people-title {
  color: #0c0c0d;
  font-size: 1.5rem;
  line-height: 1.2;
  font-weight: 600;
  margin-top: 0px;
}

.people-text {
  color: rgba(19, 21, 23, 0.64);
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.cta-button {
  background-color: rgb(7, 106, 224);
  color: white;
  padding: 10px;
  width: 100%;
  border-radius: 0.5rem;
  white-space: nowrap;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1), outline 0s;
  justify-content: center;
  outline-offset: 0.125rem;
  outline: 2px solid transparent;
  border: none;
}

.cta-button:hover {
  background-color: rgb(106, 165, 237);
}

.cta-button:disabled {
  background-color: rgb(106, 165, 237);
}

.transition {
  transition: .3s cubic-bezier(.3, 0, 0, 1.3)
}

.spinner-lg {
  .generate-spinner();
}

.generate-spinner(@radius: 60px,
  @border-width: 12px,
  @check-thickness: 12px,
  @success-color: #4BAE4F,
  @error-color: #FD4755,
  @default-color: #076AE0,
  @background-color: #fffc,
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
    .context-class('success');
  }

  &.error {
    .context-class('error');
  }

  &.processing {
    border-color: @background-color;

    &:before {
      opacity: 1;
    }

    >div {
      opacity: 0;
    }
  }

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

    &:before,
    &:after {
      .pseudo-block();
      position: absolute;
      background-color: @default-color;
      transition-property: left, top, height, width;
      transition-duration: 200ms, 200ms, 200ms, 200ms;
      border-radius: 20px;
    }

    &:before {
      width: @check-thickness;
      height: @check-height;
      left: @check-size - @check-thickness;
      top: 0;
    }

    &:after {
      width: @check-size;
      height: @check-thickness;
      left: 0;
      top: @check-height - @check-thickness;
    }
  }

  &.error .check {
    transform: rotate(-135deg);
    height: @check-height;
    width: @check-height;
    top: @radius - (@check-height / 2) - @border-width;
    left: @radius - (@check-height / 2) - @border-width;

    &:before {
      height: @check-height;
      left: 25.7116279064px;
    }

    &:after {
      width: @check-height;
      top: 25.7116279064px;
    }
  }

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
    animation-timing-function: linear;
  }

  // @mixin
  .context-class(@name) {
    @color: color(~"@{@{name}-color}");
    border-color: @color;

    &:before {
      border-color: @color;
    }

    >div {

      &:before,
      &:after {
        background-color: @color;
      }
    }
  }
}

@keyframes check-loading-spinner {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.pseudo-block() {
  content: '';
  display: block;
}

.resend {
  text-align: center;
}

.resend-plain {
  color: #808080;
  text-align: center;
  margin-bottom: 0;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.otp {
  width: 40px;
  height: 40px;
  font-size: 2rem;
  text-align: center;
  border-radius: 0.5rem;
  box-shadow: none;
  border: 1px solid #999;
  margin: 15px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  caret-color: transparent !important;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}</style>