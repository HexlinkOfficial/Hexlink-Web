<template>
  <a-row style="height: 100%;" align="middle">
    <a-col style="margin: 20px 10px 20px 10px;">
    <a-row justify="center">
      <img class="logo" src="/src/assets/logo.png" />
      <span class="brandTitle">Hexlink</span>
    </a-row>
    <a-row justify="center" style="margin-top: 100px;">
      <a-col align-self="center">
        <a-row justify="center">
          <a-avatar :src="user?.photoURL!" :size="64" referrerpolicy="no-referrer">
          </a-avatar>
        </a-row>
        <a-row justify="center">
          <span class="title">{{ user?.displayName }}</span>
        </a-row>
        <a-row justify="center">
          <a-typography-paragraph>
              {{ user?.email }}
          </a-typography-paragraph>
          <a-typography-paragraph :copyable="{ text: address }">
              {{ addressText }}
          </a-typography-paragraph>
        </a-row>
      </a-col>
    </a-row>
    <a-row justify="center" style="margin-top: 50px;">
        <a-button block type="text" size="large">
          <template #icon>
            <DollarOutlined />
          </template>
          Tokens
        </a-button>
        <a-button block disabled type="text" size="large">
          <template #icon>
            <history-outlined />
          </template>
          Activities
        </a-button>
        <a-button block disabled type="text" size="large">
          <template #icon>
            <contacts-outlined />
          </template>
          Contacts
        </a-button>
        <a-button block disabled type="text" size="large">
          <template #icon>
            <AppstoreOutlined />
          </template>
          Applications
        </a-button>
    </a-row>
    <a-row justify="center" style="margin-top: 100px;">
        <a-button block type="primary" @click="logout">
          <template #icon>
            <LogoutOutlined />
          </template>
          Sign out
        </a-button>
    </a-row>
  </a-col>
  </a-row>
</template>
  
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { signOutFirebase } from '@/services/auth';
import { useRouter } from 'vue-router';
import {
  HistoryOutlined,
  DollarOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  ContactsOutlined
} from '@ant-design/icons-vue';
import { prettyPrintAddress, genAddress } from '@/services/ethers';
import { useAuthStore } from '@/stores/auth';
import YawAdmin from "@/services/YawAdmin.json";
import YawWallet from "@/services/YawWallet.json";

const store = useAuthStore();
const user = store.currentUser;
const address = ref<string>("");
onMounted(async () => {
  address.value = await genAddress(user?.email, YawAdmin, YawWallet);;
});

const addressText = computed(() => {
  if (address.value) {
    return prettyPrintAddress(address.value);
  } else {
    return "";
  }
})

const router = useRouter();
const logout = () => {
  signOutFirebase();
  router.push("/signin");
};
</script>
  
<style lang="less" scoped>
.logo {
  height: 40px;
  width: 40px;
}

.brandTitle {
  margin-left: 10px;
  font-family: system-ui;
  font-size: 1.8em;
  font-weight: bold;
}

.title {
  margin: 0px 0px 20px 0px;
  font-family: system-ui;
  font-size: 1em;
  font-weight: bold;
}
</style>