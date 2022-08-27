<template>
    <v-container class="fill-height">
        <v-row justify="center" class="logo">
            <v-img
                src="/src/assets/logo.png"
                contain
                height="150"
                width="150"
            />
        </v-row>
        <v-row justify="center" class="title">
            <span>Yaw: start your path to web3</span>
        </v-row>
        <v-row justify="center" class="ma-0">
            <v-btn elevation="2">
                <v-img
                    src="/images/google.svg"
                    style="height: 20px; width: 20px; margin-right: 10px;"
                />
                <span>Sign In with Google</span>
            </v-btn>
        </v-row>
    </v-container>
            
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SignInView',
  components: {
  },
});
</script>

<style lang="less" scoped>
.logo {
    margin-top: calc(50% - 100px);
}

.title {
    margin: 0px 0px 20px 0px;
    font-family: system-ui;
    font-size: 1.5em;
    font-weight: bold;
}
</style>