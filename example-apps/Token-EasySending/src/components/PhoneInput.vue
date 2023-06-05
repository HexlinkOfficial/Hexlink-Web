<template>
  <div ref="selectPhone" data-widget-item="baseinput" class="flex flex-col relative"
    data-lbgm-phonenumberinput="component">
    <!--phone-number-input core-->
    <div data-children="core" class="w-full flex flex-col relative">
      <!--input-->
      <!-- <div data-children="inputcore" ref="selectPhoneButton"
        class="bg-white baseinput-core border w-full border-gray rounded-lg py-3 px-4 flex flex-shrink flex-nowrap items-center space-x-2"
        :class="{ error: hasError, success: hasSuccess }">
        <span @click="toggleSelect()" class="inline-flex flex-nowrap items-center space-x-2 cursor-pointer"
          ref="basePhoneArrow" data-children="arrowGroup">
          <template v-if="arrow">
            <span v-if="$slots.arrow" class="inline-flex flex-shrink-0">
              <slot name="arrow" />
            </span>
            <span v-else class="inline-flex flex-shrink-0">
              <Down />
            </span>
          </template>
          <span
            class="opacity-50 select-none inline-flex flex-whrink-0 font-semibold text-black text-left text-sm leading-1dt125">
            {{ `+${defaultSelected?.dialCode}` }}
          </span>
        </span>
        <input data-children="htmlInput" :placeholder="placeholder"
          class="border-0 outline-none appearance-none flex-shrink w-full bg-transparent" type="text" ref="inputBase"
          :name="name" :id="name" :value="phone" @input="onPhoneInput($event)" :autocomplete="'off'" spellcheck="false"
          v-typing="{
            finish: emitPhoneData,
            timing: 100,
          }" />
      </div> -->
      <div style="line-height: 24px; flex-direction: row; align-items: center; display: flex;">
        <div style="line-height: 24px; display: inline-block; width: auto; font-weight: normal; position: relative; font-size: 16px; margin-right: 8px; box-sizing: border-box;">
          <div @click="toggleSelect()"
            ref="basePhoneArrow" data-children="arrowGroup" class="countrySelect" :style="openSelect ? 'border-color: black;' : ''">
            <span style="padding-right: 0px;padding-left: 10px;padding-bottom: 10px;padding-top: 10px;flex-wrap: nowrap;flex-basis: 0%;flex-shrink: 1;overflow: hidden;position: relative;flex-grow: 1;align-items: center;display:flex;">
              <div style="overflow-wrap: normal;white-space: nowrap;text-overflow: ellipsis;max-width: 100%;height: 24px;overflow:hidden;margin: 0 2px;box-sizing: border-box;align-items: center;display: flex;">
                <!-- {{ `+${defaultSelected?.dialCode}` }} -->
                <div :class="['vti__flag', defaultSelected?.iso2.toLowerCase()]" style="display: inline-block; margin-right: 10px;"></div>
              </div>
            </span>
            <template v-if="arrow">
              <span v-if="$slots.arrow" class="inline-flex flex-shrink-0" style="align-self: stretch;flex-shrink: 0;padding-right: 0px;position: relative;box-sizing: border-box;align-items: center;display: flex;">
                <slot name="arrow" />
              </span>
              <span v-else class="inline-flex flex-shrink-0" style="align-self: stretch;flex-shrink: 0;padding-right: 0px;position: relative;box-sizing: border-box;align-items: center;display: flex;">
                <!-- <Down /> -->
                <img src="@/assets/arrowDown.png" alt="arrow down icon" width="15" height="15"/>
              </span>
            </template>
          </div>
        </div>
        <!---->
        <div class="phoneNumber">
          <div class="countryCode" style="display: block;">{{ `+${defaultSelected?.dialCode}` }}</div>
          <input data-children="htmlInput" :placeholder="placeholder"
            class="border-0 outline-none appearance-none flex-shrink w-full bg-transparent" type="text" ref="inputBase"
            :name="name" :id="name" :value="phone" @input="onPhoneInput($event)" :autocomplete="'off'" spellcheck="false"
            style="padding-left: 4px; width: 100%;"
            v-typing="{
              finish: emitPhoneData,
              timing: 100,
            }" 
          />
        </div>
      </div>
      <!--select option-->
      <div ref="selectOptions" class="w-full absolute z-one lbgm-phone-scrll" style="border-radius: 0.5rem; overflow: auto; padding: 10px 0; background-color: rgb(255, 255, 255); box-shadow: rgba(0, 0, 0, 0.16) 0px 4px 16px;"
        v-if="openSelect" :class="{
          'bottom-0': popupPos === 'top',
          'top-full': popupPos === 'bottom',
        }" :style="{
        maxHeight: `${listHeight}px`,
      }">
        <div class="hover:bg-217-242-236-dt5" style="height: 42px;color: rgb(84, 84, 84);padding:0;margin-bottom: 0px;background-color: transparent;transition-timing-function: cubic-bezier(0.2, 0.8, 0.4, 1);transition-duration: 200ms;font-weight: normal;line-height: 20px;position: relative;font-size: 14px;cursor: pointer;box-sizing: border-box;align-items: center;display: flex;"
          v-for="(country, index) in allowedCountries" @click="choose(country)" :key="index" :data-country="country.iso2">
          <div style="padding-left: 16px;display: flex;align-items: center;">
            <div :class="['vti__flag', country.iso2.toLowerCase()]" style="display: inline-block; margin-right: 10px; font-size: 32px;"></div>
          </div>
          <div class="font-semibold text-xs text-394452" style="display: block; padding: 0 16px;">
            {{ country.name }}
          </div>
          <div style="display: block; margin-left: auto; padding-right: 16px;">
            +{{ country.dialCode }}
          </div>
        </div>
      </div>
      <!-- end core-->
    </div>

    <!-- messages -->

    <!-- error message -->
    <div v-if="hasError" data-children="error"
      class="rounded-lg w-full bg-danger-light flex flex-row space-x-1 py-0dt375 px-2 mt-2 items-center select-none">
      <span class="inline-flex flex-shrink-0">
        <Red />
      </span>
      <span class="text-xs text-danger font-medium">{{
        errorMessage ?? ""
      }}</span>
    </div>

    <!-- success message -->
    <div v-if="hasSuccess" data-children="success"
      class="rounded-lg w-full bg-primary-light flex flex-row space-x-1 py-0dt375 px-2 mt-2 items-center select-none">
      <span class="inline-flex flexshrink-0">
        <Green />
      </span>
      <span class="text-xs text-primary font-medium">{{
        successMessage ?? ""
      }}</span>
    </div>

    <!-- any slot -->
    <slot />
  </div>
</template>

<script setup lang="ts">
export interface Props {
  value?: string;
  hasError?: boolean;
  hasSuccess?: boolean;
  successMessage?: string;
  errorMessage?: string;
  placeholder?: string;
  name?: string;
  required?: boolean;
  defaultCountry?: string;
  arrow?: boolean;
  listHeight?: number;
  allowed?: string[];
}

import {
  computed,
  toRef,
  ref,
  onMounted,
  getCurrentInstance,
  watch,
  type ComponentInternalInstance,
  type Ref,
} from "vue";

import Red from "./Red.vue";
import Green from "./Green.vue";

import countries from "../services/all-countries";
import parsePhoneNumber from "libphonenumber-js";
import type { PhoneNumber } from "libphonenumber-js";
import { typing } from "../services/directives";
import type { PhoneDATA, Country } from "../types";

const vTyping = { ...typing };

const props = withDefaults(defineProps<Props>(), {
  value: "",
  hasError: false,
  hasSuccess: false,
  successMessage: "",
  errorMessage: "",
  placeholder: "",
  name: "",
  required: false,
  defaultCountry: "US",
  arrow: true,
  listHeight: 250,
  allowed: () => [],
});

const emit = defineEmits(["phone", "country", "phoneData"]);

const openSelect: Ref<boolean> = ref(false);
const defaultSelected: Ref<Country> = ref<Country>() as Ref<Country>;
const defaultCountry: Ref<string> = toRef(props, "defaultCountry");
const filterCountries: Ref<string[]> = toRef(props, "allowed");
const basePhoneArrow: Ref<HTMLElement | null> = ref(null);
const phone: Ref<string> = ref("");
const inputBase: Ref<HTMLInputElement | null> = ref(null);

const popupPos = ref("bottom");
const listHeight = toRef(props, "listHeight");
const that: ComponentInternalInstance | null = getCurrentInstance();

/**
 * used to send custom Event: usable in case of scroll turning off when popup is under
 */
const cev_dash_select = () => {
  const event = new CustomEvent("CEV_SELECT_POPUP", {
    detail: { opened: openSelect.value, target: that?.refs.selectPhone },
  });
  document.body.dispatchEvent(event);
};

/**
 * filt allowedCountries from props
 */
const allowedCountries = computed((): Country[] => {
  const tbl: Country[] =
    filterCountries.value.length !== 0
      ? countries.filter((o: Country) => filterCountries.value.includes(o.iso2))
      : countries;
  return tbl;
});

/**
 * ToggleSelect
 * to open countries list
 */
const toggleSelect = () => {
  openSelect.value = !openSelect.value;

  // calculate popup position: top or bottom
  const selectRect = (that?.refs.selectPhone as HTMLElement).getBoundingClientRect();
  // y
  popupPos.value = selectRect.bottom < listHeight.value ? "top" : "bottom";
};

/**
 * formatPhoneInput
 * used to format Phone Input
 * @param val
 */
const formatPhoneInput = (val: string): Country => {
  const phoneNumber: PhoneNumber | undefined = parsePhoneNumber(`+${val}`);
  if (phoneNumber) {
    phone.value = phoneNumber?.nationalNumber as string;

    return {
      iso2: phoneNumber?.country as string,
      dialCode: phoneNumber?.countryCallingCode as string,
      name: countries.find((o: Country) => o.iso2 === phoneNumber?.country as string)?.name as string,
    };
  }
  // else
  return {
    ...countries.find((o: Country) => o.iso2 === defaultCountry.value) as Country,
  };
};

/**
 * emitPhone
 * used to emit phone in internationalFormat
 */
const emitPhone = (): void => {
  if (phone.value)
    emit("phone", `${defaultSelected.value.dialCode}${phone.value}`);
  else emit("phone", "");
};

/**
 * emitPhoneData
 * Used to emit phoneData as an object
 * @returns {}
 */
const emitPhoneData = (): void => {
  const ph = parsePhoneNumber(
    `+${defaultSelected.value.dialCode}${phone.value}`
  );
  emit("phoneData", {
    country: ph?.country,
    dialCode: ph?.countryCallingCode,
    nationalNumber: ph?.nationalNumber,
    number: ph?.number,
    isValid: ph?.isValid(),
  } as PhoneDATA);
};

/**
 * emitAll
 * used to emit all event
 */
const emitAll = (): void => {
  emit("country", defaultSelected.value.iso2);
  emitPhone();
  emitPhoneData();
}

/**
 * to select any country
 * @param country
 */
const choose = (country: Country) => {
  defaultSelected.value = country;
  openSelect.value = false;
  emitAll();
};


/**
 * bind on input
 * @param event
 */
const onPhoneInput = (event: any) => {
  event.target.value = phone.value = String(event.target.value).replace(
    /\D/g,
    ""
  );
  emitPhone();
};

watch(openSelect, () => {
  // dispatch custom HTML event
  cev_dash_select();
});

onMounted(() => {
  // initialize default country selected
  defaultSelected.value = formatPhoneInput(props.value);
  emitAll();

  // outside
  document.addEventListener("click", (event) => {
    if (
      basePhoneArrow.value &&
      !(basePhoneArrow.value as HTMLElement).contains(event.target as Node)
    ) {
      openSelect.value = false;
    }
  });
});

defineExpose({
  defaultSelected,
  defaultCountry,
  phone,
  popupPos,
  listHeight,
});
</script>

<style scoped lang="scss">
@import '../tailwind.scss';

[data-children="inputcore"] {
  input {
    &::placeholder {
      font-weight: bold;
      color: gray;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      transition: background-color 5000s ease-in-out 0s;
    }
  }

  &.error {
    background: #feefef;
    border: 1px solid #da1414;

    input {
      -webkit-box-shadow: 0 0 0px 1000px #feefef inset !important;
    }
  }

  &.success {
    background: #edf9f0;
    border: 1px solid #287d3c;

    input {
      -webkit-box-shadow: 0 0 0px 1000px #edf9f0 inset !important;
    }
  }
}

.countrySelect {
  min-width: 90px;
  border-radius: 0.5rem;
  background-color: rgb(238, 238, 238);
  border-bottom-color: transparent;
  border-top-color: transparent;
  border-right-color: transparent;
  border-left-color: transparent;
  transition-timing-function: cubic-bezier(0.2, 0.8, 0.4, 1);
  transition-duration: 200ms;
  border-bottom-style: solid;
  border-top-style: solid;
  border-right-style: solid;
  border-left-style: solid;
  border-bottom-width: 2px;
  border-top-width: 2px;
  border-right-width: 2px;
  border-left-width: 2px;
  cursor: text;
  overflow:hidden;
  padding-right: 16px;
  padding-left: 6px;
  color: #000000;
  box-sizing: border-box;
  justify-content: space-between;
  width: 100%;
  display:flex; }
.phoneNumber {
  padding: 10px 0 10px 12px;
  border-radius: 0.5rem;
  border: 2px solid transparent;
  background: #eee;
  flex-direction: row;
  display: flex;
  width: 100%; }
.phoneNumber:focus-visible {
  border-color: black;
  background-color: white; }
</style>

<style src="../assets/flag.css">
</style>
