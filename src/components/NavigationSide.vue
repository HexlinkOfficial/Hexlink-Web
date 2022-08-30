<template>
  <a-row style="height: 100%;" align="middle">
    <a-col style="margin: 20px 10px 20px 10px;">
    <a-row justify="center">
      <img class="logo" src="/src/assets/logo.png" />
      <span class="brandTitle">Yaw Wallet</span>
    </a-row>
    <a-row justify="center" style="margin-top: 100px;">
      <a-col align-self="center">
        <a-row justify="center">
          <a-avatar :src="user?.photoURL!" :size="64">
          </a-avatar>
        </a-row>
        <a-row justify="center">
          <span class="title">{{ user?.displayName }}</span>
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
        <a-button block type="text" size="large" disabled>
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
import { signOutFirebase } from '@/services/auth';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { DollarOutlined, AppstoreOutlined, LogoutOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const store = useAuthStore();
const user = store.currentUser;

const logout = () => {
  signOutFirebase();
  router.push("/signin");
};
</script>
  
<style lang="less" scoped>
.logo {
  height: 30px;
  width: 30px;
}

.brandTitle {
  font-family: system-ui;
  font-size: 1.3em;
  font-weight: bold;
}

.title {
  margin: 0px 0px 20px 0px;
  font-family: system-ui;
  font-size: 1em;
  font-weight: bold;
}

.menu {
  margin: 10px 0px 10px 0px;
}
</style>