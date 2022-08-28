<template>
    <v-container class="fill-height">
      <v-row justify="center" class="ma-0">
          <v-img
              src="/src/assets/logo.png"
              contain
              height="50"
              width="50"
          />
      </v-row>
      <v-row justify="center" class="ma-0">
        <v-btn elevation="2" @click="logout">
          Sign out
      </v-btn>
      </v-row>
  </v-container>

</template>

<script lang="ts">
import { signOutFirebase } from '@/services/auth';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'HomeView',
  setup() {
    const router = useRouter();

    const logout = () => {
      signOutFirebase();
      router.push("/signin");
    };
    return { logout };
  }
});
</script>

<style lang="less" scoped>
  .logo {
      margin-top: calc(50% - 100px);
  } 
  </style>