<template>
  <div class="header">
    <div class="container">
      <div class="row">
        <div class="col-xxl-12">
          <div class="header-content">
            <div class="header-left">
              <div class="brand-logo header-logo">
                <router-link to="/">
                  <img src="../assets/logo/blue2-logo.svg" alt="" />
                </router-link>
              </div>
            </div>

            <div class="header-right">
              <div class="selectnetwork dropdown" @click="activeDropDown('selectnetwork')"
                :class="active_ === 'selectnetwork' && 'show'">
                <div class="network" data-toggle="dropdown">
                  <img :src="useNetworkStore().network.logoUrl" height=25 style="margin-left: 0.5rem;">
                  <span>{{ useNetworkStore().network.chainName }}</span>
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 0.5rem; width: 1rem">
                    <path d="M1 1L7 7L13 1" stroke="#475569" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="dropdown-menu dropdown-menu-right network-list mt-3" onclick="event.stopPropagation()" :class="active_ === 'selectnetwork' && 'show'">
                  <div class="box">
                    <div class="title">
                      <div class="title-header">
                        <div class="title-text">Networks</div>
                      </div>
                    </div>
                    <div>
                      <!-- Polygon -->
                      <div class="network-items" @click="switchNetwork({...POLYGON})">
                        <button>
                          <div style="display: flex; margin-right: 0.75rem; align-items: center; height: 1.25rem; width: 1.25rem;">
                            <svg v-if="useNetworkStore().network.name == 'polygon'" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 1L6 12L1 7" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </div>
                          <div style="display: flex; white-space: nowrap; align-items: center; width: 100%; ">
                            <div style="position: relative; margin-right: 0.75rem; min-width: max-content; ">
                              <img src="https://token.metaswap.codefi.network/assets/networkLogos/polygon.svg" height=25
                                style="margin-left: 0.5rem; margin-right: 0.5rem;" />
                            </div>
                            <div class="items-name">
                              <span class="item-title">{{ POLYGON.chainName }}</span>
                              <span class="item-balance">$0.00</span>
                            </div>
                          </div>
                        </button>
                      </div>
                      <!-- Mumbai -->
                      <div class="network-items" @click="switchNetwork({...MUMBAI})">
                        <button>
                          <div style="display: flex; margin-right: 0.75rem; align-items: center; height: 1.25rem; width: 1.25rem;">
                            <svg v-if="useNetworkStore().network.name == 'mumbai'" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 1L6 12L1 7" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </div>
                          <div style="display: flex; white-space: nowrap; align-items: center; width: 100%; ">
                            <div style="position: relative; margin-right: 0.75rem; min-width: max-content; ">
                              <img src="https://token.metaswap.codefi.network/assets/networkLogos/polygon.svg" height=25 style="margin-left: 0.5rem; margin-right: 0.5rem;" />
                            </div>
                            <div class="items-name">
                              <span class="item-title">{{ MUMBAI.chainName }}</span>
                              <span class="item-balance">$11.39</span>
                            </div>
                          </div>
                        </button>
                      </div>
                      <!-- Goerli -->
                      <div class="network-items" @click="switchNetwork({...GOERLI})">
                        <button>
                          <div style="display: flex; margin-right: 0.75rem; align-items: center; height: 1.25rem; width: 1.25rem;">
                            <svg v-if="useNetworkStore().network.name == 'goerli'" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 1L6 12L1 7" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </div>
                          <div style="display: flex; white-space: nowrap; align-items: center; width: 100%; ">
                            <div style="position: relative; margin-right: 0.75rem; min-width: max-content; ">
                              <img src="https://token.metaswap.codefi.network/assets/networkLogos/ethereum.svg" height=25 style="margin-left: 0.5rem; margin-right: 0.5rem;" />
                            </div>
                            <div class="items-name">
                              <span class="item-title">{{ GOERLI.chainName }}</span>
                              <span class="item-balance">$11.39</span>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="profile_log dropdown" @click="activeDropDown('profile')" :class="active_ && 'show'">
                <div class="user" data-toggle="dropdown">
                  <img class="profile" :src="user?.photoURL" :size="64" referrerpolicy="no-referrer"/>
                  <span>@{{ user?.provider?.includes("twitter") && user.handle }}</span>
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 0.5rem; width: 1rem">
                    <path d="M1 1L7 7L13 1" stroke="#475569" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <!-- dropdown menu -->
                <div style="opacity: 1; transform: translateY(0);">
                  <div class="dropdown-menu dropdown-menu-right mt-3" :class="active_ === 'profile' && 'show'">
                    <div class="user-email" style="border-bottom-width: 1px; border-color: #E5E7EB; border-style: dashed; ">
                      <div class="user">
                        <span class="thumb"><img :src="user?.photoURL" :size="64" referrerpolicy="no-referrer" /></span>
                        <div class="user-info">
                          <h5>{{ user?.provider?.includes("twitter") && user?.displayName }}</h5>
                          <span>@{{ user?.provider?.includes("twitter") && user?.handle }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="user-balance" style="border-bottom-width: 1px; border-color: #E5E7EB; border-style: dashed; ">
                      <div class="wallet-info">
                        <h5>Hexlink Account Address </h5>
                        <div class="user-wallet">
                          <div class="user">
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="15" cy="15" r="15" fill="#076AE0" />
                              <path
                                d="M12.9544 8.0197C11.966 8.15381 11.1676 8.81988 10.9158 9.72287C10.8778 9.85698 10.8445 10.1207 10.8445 10.313C10.8445 10.9701 11.0964 11.5155 11.6048 11.9714C12.3984 12.6733 13.4343 12.8163 14.4084 12.3559C14.5653 12.2843 14.7031 12.2218 14.7173 12.2218C14.7363 12.2218 17.3451 15.2705 17.4164 15.3778C17.4307 15.4046 17.3594 15.5342 17.2501 15.6683C16.7939 16.2316 16.5563 16.9826 16.6133 17.68C16.6418 18.0287 16.6371 18.0778 16.5611 18.1136C16.5135 18.1359 15.6059 18.4533 14.5415 18.8154L12.6075 19.477L12.2748 19.1418C11.7521 18.6143 11.2104 18.3907 10.4644 18.3907C9.59951 18.3907 8.87721 18.7528 8.40202 19.4279C7.4754 20.7421 8.2262 22.5258 9.87987 22.9281C11.3862 23.2991 12.9021 22.186 12.9116 20.7064V20.3174L14.9074 19.6335C16.0051 19.258 16.9175 18.9495 16.9412 18.9495C16.9602 18.9495 17.098 19.1015 17.2501 19.2848C17.8963 20.0716 18.785 20.4918 19.8066 20.4918C20.3436 20.4918 20.7475 20.4024 21.2369 20.1744C22.2634 19.6961 22.9381 18.7215 22.9952 17.6308C23.0237 17.0675 22.9286 16.6518 22.6483 16.1109C22.3584 15.5611 21.8832 15.1051 21.3177 14.8279C20.7523 14.5508 20.4624 14.4837 19.8256 14.4837C19.2411 14.4793 18.9418 14.5418 18.4571 14.7564C18.2432 14.8503 18.191 14.8592 18.1434 14.8101C17.8868 14.5463 15.4063 11.587 15.4063 11.5423C15.4063 11.5155 15.4491 11.4037 15.5061 11.2964C16.0241 10.2951 15.6487 9.0121 14.665 8.39967C14.1708 8.09122 13.5151 7.9437 12.9544 8.0197ZM11.1106 19.401C11.4005 19.5307 11.7141 19.8346 11.8567 20.1252C11.9327 20.2817 11.9612 20.4247 11.9612 20.6706C11.9612 20.9612 11.9422 21.0461 11.8044 21.3098C11.5193 21.8552 11.0013 22.1324 10.3503 22.0921C9.79433 22.0564 9.34765 21.7747 9.10055 21.3054C8.98651 21.0863 8.9675 20.9969 8.9675 20.6706C8.9675 20.3443 8.98651 20.2593 9.10055 20.0582C9.49972 19.3384 10.3503 19.0613 11.1106 19.401Z"
                                fill="white" />
                            </svg>
                            <div class="user-info">
                              <span style="margin-bottom: 0;" class="smart-contract-address">
                                <h5 @click="doCopy(useProfileStore().profile?.account.address)">
                                  {{ addressTextLong(useProfileStore().profile?.account.address) }}
                                </h5>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-if="walletStore.connected">
                        <h5>External Account Address </h5>
                        <div class="user_wallet" style="border: 0 solid #e5e7eb; padding: 10px 0px 0px 0px;">
                          <div class="user">
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="15" cy="15" r="15" fill="white" />
                              <path
                                d="M17.7734 15.5C17.7734 14.1875 16.7187 13.1328 15.4062 13.1328C14.0938 13.1328 13.0625 14.1875 13.0625 15.5C13.0625 16.8125 14.1172 17.8672 15.4297 17.8672C16.7422 17.8672 17.7734 16.8125 17.7734 15.5ZM15.1719 14.3281V13.6953H15.6641V14.3281H15.1719ZM15.1719 15.8281V15.1953H15.6641V15.8281H15.1719V15.8281ZM15.1719 17.3047V16.6719H15.6641V17.3047H15.1719Z"
                                fill="#076AE0" />
                              <path
                                d="M12.6172 8L10.5312 10.5312H11.5859V18.6406H13.6484V17.75C12.9922 17.2344 12.5703 16.4141 12.5703 15.5234C12.5703 14.6094 12.9922 13.8125 13.6484 13.2969V10.5781H14.7031L12.6172 8ZM18.2656 15.5C18.2656 16.3203 17.9141 17.0703 17.3516 17.5859V20.4687H16.2969L18.3828 23L20.4687 20.4687H19.4141V12.3828H17.3516V13.4375C17.9141 13.9297 18.2656 14.6797 18.2656 15.5Z"
                                fill="#076AE0" />
                            </svg>
                            <div class="user-info">
                              <span style="margin-bottom: 0;" class="smart-contract-address">
                                <h5 @click="doCopy(walletStore.wallet?.account.address)">
                                  {{ addressTextLong(walletStore.wallet?.account.address) }}
                                </h5>
                              </span>
                            </div>
                            <div> 
                              <a-tooltip placement="bottom">
                                <template #title>
                                  <span>Disconnect</span>
                                </template>
                                <svg @click="disconnectWallet" style="margin-left: 0.5rem;" width="30" height="30" viewBox="0 0 30 30" fill="none"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M16.8456 10.8141L20.9985 6.77662L16.8456 5.73846V10.8141V10.8141ZM14.9946 9.53076L14.1491 5.65186L11.6972 7.71389L14.9946 9.53076ZM11.7734 13.9805C11.4033 13.7673 11.0102 13.6026 10.6051 13.484C11.0119 13.2137 13.1562 11.9604 13.1562 11.9604L14.31 13.834C14.31 13.834 12.8425 14.6949 12.7799 14.7314C12.4782 14.4463 12.1425 14.1929 11.7734 13.9805ZM26.3524 15.2823L22.077 14.1314C21.4356 13.9588 20.7785 13.9282 20.1414 14.0322C19.5374 13.5326 18.8316 13.1221 18.1345 12.7173L16.8457 11.9677L15.6899 13.8329L17.0295 14.6201C17.3288 14.7939 17.6012 14.9543 17.8494 15.1083C17.1619 15.7042 16.6671 16.4892 16.4257 17.3855C16.2689 17.9681 16.2342 18.5548 16.3014 19.1202H17.1871C17.6985 19.1202 18.1563 18.8932 18.469 18.5358C18.4727 18.3443 18.4985 18.1505 18.5506 17.9574C18.6945 17.4226 19.0118 16.9643 19.4538 16.6417C19.5483 16.8716 19.598 17.1233 19.598 17.4124C19.598 18.1756 19.2148 18.916 18.5979 19.3633C18.5974 19.3619 18.5971 19.3603 18.5966 19.3589C18.2011 19.6429 17.717 19.8117 17.1919 19.8117L13.5624 19.8232C13.7791 19.0515 13.7985 18.214 13.5755 17.3854C13.2604 16.2147 12.4731 15.1943 11.4229 14.5896C10.5556 14.0902 9.51329 13.8828 8.51321 14.0141C7.97192 14.0853 3.64864 15.2821 3.64864 15.2821C2.46094 15.6019 1.46813 16.3665 0.85278 17.4351C0.237429 18.5037 0.0745383 19.7462 0.394343 20.9337C0.71403 22.1213 1.47856 23.1142 2.54708 23.7293C3.25805 24.1388 4.04567 24.3477 4.84313 24.3477C5.24438 24.3477 5.64821 24.2947 6.04571 24.1878L10.3212 23.0369C11.0586 22.8383 11.7054 22.4698 12.2327 21.986C12.4229 22.0101 12.6163 22.0239 12.8129 22.0239C12.8129 22.0239 17.1868 22.0239 17.1873 22.0239C18.3679 21.9947 19.5272 21.5544 20.3825 20.7322C20.7306 20.3972 21.0264 20.0081 21.2562 19.5788C21.2579 19.5755 21.2596 19.572 21.2613 19.5687C21.7134 18.7201 21.8827 17.7331 21.7566 16.7812C21.7344 16.6142 21.7047 16.4533 21.6656 16.2997L25.7801 17.4073C26.4008 17.5743 26.9199 17.974 27.2415 18.5328C27.5632 19.0915 27.6484 19.741 27.4812 20.3618C27.1357 21.6455 25.8102 22.4087 24.5268 22.063L20.9964 21.1126C20.3315 21.797 19.4851 22.304 18.535 22.5532C18.8852 22.7606 19.2675 22.9261 19.6794 23.037L23.9549 24.1879C24.3524 24.2949 24.7561 24.3478 25.1575 24.3478C25.9548 24.3478 26.7425 24.1387 27.4535 23.7294C28.522 23.1142 29.2867 22.1214 29.6064 20.9338C30.2675 18.4785 28.8076 15.9433 26.3524 15.2823ZM11.4028 19.3638C10.8103 18.9345 10.4196 18.244 10.4038 17.4617C10.2819 17.3224 10.1393 17.2006 9.97395 17.1054C9.71321 16.9552 9.41919 16.8637 9.12434 16.8758C8.73458 16.8919 8.21532 17.0601 8.21532 17.0601C8.20723 17.1747 8.20173 17.2915 8.20173 17.4126C8.20173 18.8028 8.82106 20.0503 9.79723 20.8964C9.78094 20.9011 9.76571 20.9076 9.7493 20.912L5.47372 22.0629C4.85309 22.23 4.20352 22.1448 3.64477 21.8231C3.08614 21.5015 2.68641 20.9824 2.5193 20.3617C2.17372 19.078 2.93684 17.7525 4.22051 17.4071C4.88579 17.228 7.22274 16.6098 7.72348 16.4645C8.23958 16.3147 8.76927 16.1597 9.31255 16.1837C9.66634 16.1994 10.0194 16.32 10.325 16.4959C10.8732 16.8116 11.2861 17.3463 11.4505 17.9572C11.5798 18.4383 11.5536 18.925 11.4028 19.3638Z"
                                    fill="#F46A6A" />
                                </svg>
                              </a-tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <router-link @click="signOutFirebase" to="signin" class="dropdown-item logout">
                      <i class="icofont-logout"></i> Logout
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useWalletStore } from '@/stores/wallet';
import { useNetworkStore } from '@/stores/network';
import { prettyPrintAddress } from '@/services/web3/account';
import { createToaster } from "@meforma/vue-toaster";
import { POLYGON, GOERLI, MUMBAI } from "@/configs/network";
import { switchNetwork } from "@/services/web3/network";
import { connectWallet, disconnectWallet } from "@/services/web3/wallet";
import { useProfileStore } from '@/stores/profile';
import { signOutFirebase } from "@/services/auth";
import { CopyOutlined } from '@ant-design/icons-vue';

export default {
  name: "Header",
  data() {
    const authStore = useAuthStore();
    const user = authStore.user!;
    const walletStore = useWalletStore();

    const addressTextLong = function (address: string | undefined) {
      if (address) {
        return prettyPrintAddress(address, 5, 6);
      }
      return "0x";
    };
    
    return {
      addressTextLong,
      CopyOutlined,
      connectWallet,
      disconnectWallet,
      useProfileStore,
      useNetworkStore,
      walletStore,
      user,
      switchNetwork,
      signOutFirebase,
      active_: "",
      POLYGON,
      GOERLI,
      MUMBAI,
      index: 0,
    };
  },
  methods: {
    forceRerender() {
      this.index += 1;
    },
    activeDropDown(value: any) {
      this.active_ = this.active_ === value ? "" : value;
    },
    closeDropDown(e: any) {
      if (!this.$el.contains(e.target)) {
        this.active_ = "";
      }
    },
    selectNetwork(value: any) {
      this.active_ = this.active_ === value ? "" : value;
    },
    doCopy: function (address: string | undefined) {
      this.$copyText(address || "0x").then(
        function () {
          // alert("Copied");
          const toaster = createToaster({ position: "top", duration: 2000 });
          toaster.success(`Copied`);
        },
        function () {
          // alert("Can not copy");
          const toaster = createToaster({ position: "top", duration: 2000 });
          toaster.error(`Can not copy`);
        }
      );
    },
  },
  mounted() {
    document.addEventListener('click', this.closeDropDown)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeDropDown)
  },
  created() {
  },
};
</script>

<style lang="scss" scoped>
.header {
  background: #f0f0f0;
  padding: 30px 0px 20px 0px;
  position: fixed;
  top: 0;
  left: 9.5rem;
  z-index: 60;
  right: 3rem;
  z-index: 2; }
  @media only screen and (max-width: 990px) {
    .header {
      left: 0;
      right: 0;
      padding: 30px 0px 20px 0px; } }
  .header .brand-logo {
    margin-top: 0px;
    padding-right: 20px;
    border-radius: 5px; }
    .header .brand-logo img {
      filter: none;
      max-width: 180px;
      margin-right: 5px; }
    .header .brand-logo span {
      font-weight: bold;
      text-transform: uppercase;
      color: #556ee6;
      display: inline-block;
      position: relative;
      top: 3px;
      font-size: 20px; }
    @media only screen and (max-width: 990px) {
      .header .brand-logo {
        display: block;
        padding-right: 0; }
        .header .brand-logo span {
          display: none; }
        .header .brand-logo img {
          filter: none;
          max-width: 165px;
          margin-right: 5px; } }
    @media only screen and (max-width: 768px) {
      .header .brand-logo img {
        max-width: 150px; } }
  .header.landing {
    left: 0px; }
    .header.landing a {
      display: flex;
      align-items: center;
      justify-content: center; }
    .header.landing .brand-logo {
      display: block; }
      .header.landing .brand-logo img {
        margin-right: 10px; }
      .header.landing .brand-logo span {
        display: block;
        top: 0; }
.header-content,
.header-left,
.header-right {
  display: flex;
  justify-content: space-between;
  align-items: center; }
.dark-light-toggle {
margin-right: 20px;
cursor: pointer; }
@media only screen and (max-width: 990px) {
  .dark-light-toggle {
    margin-right: 0px;
    margin-left: 15px; } }
.dark-light-toggle i {
  font-size: 20px; }
.dark-light-toggle .light {
  display: none; }
.profile_log {
cursor: pointer; }
.profile_log .user {
  display: flex;
  position: relative;
  background-color: #ffffff;
  transition-property: all;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 2.5rem;
  border-radius: 9999px;
  border-width: 1px;
  border-color: #F3F4F6;
  cursor: pointer; }
  // .profile_log .user:hover {
  //   transform: translateY(-0.125rem);
  //   fill: rgb(7, 106, 224);
  //   background-color: rgba(7, 106, 224, 0.15);
  //   border-color: rgb(48,138,245);
  //   color: rgb(7,106,224); }
  @media only screen and (max-width: 768px) {
    .profile_log .user {
      margin-right: 0.5rem;
      margin-left: 0rem; 
      transition: 0.2s ease-in-out; } }
  .profile_log .user span {
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin-right: 0.5rem;
    color: rgb(71, 85, 105); }
  @media only screen and (max-width: 768px) {
    .profile_log .user span {
      display: none; } }
  .profile_log .user .profile {
    height: 25px;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    border-radius: 50px;
  }
  .profile_log .user .thumb {
    display: block;
    overflow: hidden;
    width: 40px;
    height: 40px;
    border-radius: 50px;
    border-color: #ffffff;
    border-style: solid;
    color: #fff;
    text-align: center;
    &:hover {
      transform: translateY(-0.125rem); } }
    .profile_log .user .thumb img {
      border-radius: 50px;
      max-width: 38px; }
  .profile_log .user .arrow i {
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    margin-top: 6px;
    display: inline-block; }
  @media only screen and (max-width: 1199px) {
    .profile_log .user .arrow {
      display: none; } }
.profile_log .dropdown-menu {
  // border: 0px;
  // padding: 0px;
  // margin: 0px;
  // top: 25px !important;
  margin-top: 0.75rem;
  transition: 0.2s ease-in-out;
  box-shadow: 0 1.5rem 4rem rgba(22, 28, 45, 0.15); }
  .profile_log .dropdown-menu .user {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    svg {
      margin-right: 1rem; } }
  .profile_log .dropdown-menu .user-email {
    border: 0 solid #e5e7eb;
    padding: 30px 20px 20px 20px; }
    .profile_log .dropdown-menu .user-email .thumb {
      margin-right: 0.5rem; }
    .profile_log .dropdown-menu .user-email .user-info {
      margin: 0px; }
    .profile_log .dropdown-menu .user-email h5, .profile_log .dropdown-menu .user-email .h5 {
      margin-bottom: 0px; }
    .profile_log .dropdown-menu .user-email span {
      font-size: 14px; }
  .profile_log .dropdown-menu .user-wallet {
    border: 0 solid #e5e7eb;
    padding: 10px 0px 0px 0px; }
    .profile_log .dropdown-menu .user-wallet .thumb {
      background-image: linear-gradient(to right, #6366f1,#a855f7,#ec4899); 
      background-color: #6366F1; 
      background-color: #8B5CF6; 
      background-color: #EC4899; 
      transition-property: all; 
      width: 40px;
      height: 40px;
      margin-right: 15px; }
    .profile_log .dropdown-menu .user-wallet .user-info {
      margin: 0px; }
    .profile_log .dropdown-menu .user-wallet h5, .profile_log .dropdown-menu .user-email .h5 {
      margin-bottom: 0px; }
    .profile_log .dropdown-menu .user-wallet span {
      font-size: 14px; }
  .profile_log .dropdown-menu .user-balance {
    // display: flex;
    // justify-content: space-around;
    // margin-bottom: 15px;
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    border-bottom-width: 1px;
    border-color: #E5E7EB;
    border-style: dashed;
    border: 0 solid #e5e7eb;
    h5 {
      margin-bottom: 0; 
      font-weight: 350;} }
    .profile_log .dropdown-menu .user-balance .address {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      color: #64748B;
    }
    .profile_log .dropdown-menu .user-balance .balance {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      margin-top: 10px;
      color: #64748B;
    }
    // .profile_log .dropdown-menu .user-balance p {
    //   margin-bottom: 0px;
    //   font-weight: 500;
    //   color: #495057; }
  .profile_log .dropdown-menu .dropdown-item {
    padding: 10px 20px;
    border-top: 1px solid #f1f1f1;
    font-weight: 400;
    display: flex;
    align-items: center; }
    .profile_log .dropdown-menu .dropdown-item:first-child {
      border: 0px; }
    .profile_log .dropdown-menu .dropdown-item.logout {
      color: #f46a6a; }
      .profile_log .dropdown-menu .dropdown-item.logout i {
        color: #f46a6a; }
    .profile_log .dropdown-menu .dropdown-item i {
      margin-right: 10px;
      font-size: 18px;
      color: #076AE0;
      font-weight: bold; }
    .profile_log .dropdown-menu .dropdown-item:hover, .profile_log .dropdown-menu .dropdown-item:focus, .profile_log .dropdown-menu .dropdown-item.active {
      background-color: #076AE0;
      color: #fff; }
      .profile_log .dropdown-menu .dropdown-item:hover i, .profile_log .dropdown-menu .dropdown-item:focus i, .profile_log .dropdown-menu .dropdown-item.active i {
        color: #fff; }
.dropdown-menu {
  position: absolute;
  z-index: 1000;
  display: none;
  min-width: 10rem;
  // padding: 0.5rem 0;
  margin: 0;
  font-size: 0.8125rem;
  color: #495057;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 0px solid rgba(0, 0, 0, 0.15);
  width: 20rem;
  z-index: 1;
  transition: height 0.3s ease-in-out;
  border-radius: 0.5rem; }
  // .dropdown-menu[data-bs-popper] {
  //   top: 100%;
  //   left: 0;
  //   margin-top: 0.125rem; }
.dropdown-menu.show {
  transition: 0.2s ease-in-out;
  display: block; }
.user-info {
  margin: 15px 0px; }
  .user-info span {
    margin-bottom: 5px;
    display: inline-block; }
.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25rem 1rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  text-decoration: none;
  white-space: nowrap;
  background-color: transparent;
  transition: 0.2s ease-in-out;
  border: 0; }
  .dropdown-item:hover, .dropdown-item:focus {
    color: #1e2125;
    background-color: #e9ecef; }
  .dropdown-item.active, .dropdown-item:active {
    color: #fff;
    text-decoration: none;
    background-color: #556ee6; }
  .dropdown-item.disabled, .dropdown-item:disabled {
    color: #adb5bd;
    pointer-events: none;
    background-color: transparent; }
.dropdown-menu.dropdown-menu-right.notification-list.mt-3.show {
  position: absolute;
  right: 1rem;
  transition: 0.2s ease-in-out; }
.dropdown-menu.dropdown-menu-right.network-list.mt-3.show {
  position: absolute;
  right: -3.5rem;
  max-height: 100vh;
  transition: 0.2s ease-in-out; }
.dropdown-menu.dropdown-menu-right.mt-3.show {
  position: absolute;
  right: 1rem;
  transition: 0.2s ease-in-out; }
.notification {
  transition: 0.2s ease-in-out;
  cursor: pointer; }
  .notification .notify-bell {
    display: flex;
    position: relative;
    background-color: #ffffff;
    transition-property: all;
    justify-content: center;
    align-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    border-width: 1px;
    border-color: #F3F4F6;
    cursor: pointer;
    margin-right: 1rem; }
    .notification .notify-bell:hover {
      transform: translateY(-0.125rem);
      fill: rgb(7, 106, 224);
      background-color: rgba(7, 106, 224, 0.15);
      border-color: rgb(73,108,233);
      color: rgb(7,106,224);
    }
    @media only screen and (max-width: 990px) {
      .notification .notify-bell {
        margin-right: 0.5rem;
        margin-left: 0.5rem; } }
    .notification .notify-bell i {
      font-size: 22px;
      color: #343a40; }
  .selectnetwork .network {
    display: flex;
    position: relative;
    background-color: #ffffff;
    transition-property: all;
    justify-content: center;
    align-items: center;
    width: auto;
    height: 2.5rem;
    border-radius: 9999px;
    border-width: 1px;
    border-color: #F3F4F6;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    margin-right: 1rem; }
    .selectnetwork .network:hover {
      transform: translateY(-0.125rem);
      fill: #076AE0;
      background-color: rgba(7, 106, 224, 0.15);
      border-color: rgb(48,138,245);
      color: rgb(7,106,224);
    }
    @media only screen and (max-width: 768px) {
      .selectnetwork .network {
        margin-right: 0.5rem;
        margin-left: 0rem; } }
  .selectnetwork .network img {
    margin-right: -0.5rem; }
    @media only screen and (max-width: 768px) {
      .selectnetwork .network img {
        margin-right: 0.5rem; } }
  .selectnetwork .network span {
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin-right: 0.5rem;
    margin-left: 1rem;
    color: rgb(71,85,105); }
    @media only screen and (max-width: 768px) {
      .selectnetwork .network span {
        display: none; } }
  .selectnetwork .network .network-word {
    @media only screen and (max-width: 992px) {
      .selectnetwork .network .network-word {
        display: none; } } }
  .selectnetwork .dropdown-menu {
    margin-top: 0.75rem;
    box-shadow: 0 1.5rem 4rem rgba(22, 28, 45, 0.15); }
    .selectnetwork .dropdown-menu .box {
      overflow-y: auto;
      position: fixed;
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
      right: 1.5rem;
      left: 4rem;
      max-height: 20rem;
      background-color: white;
      box-shadow: 0 1.5rem 4rem rgba(22, 28, 45, 0.15);
      background-clip: padding-box;
      border: 0px solid rgba(0, 0, 0, 0.15);
      border-radius: 0.5rem;
      @media (min-width: 640px) {
        position: absolute;
        left: 0;
        transform-origin: top left;
        max-height: 100vh;
        padding-top: 1.5rem;
        padding-bottom: 1.5rem;
        box-shadow: 0 1.5rem 4rem rgba(22, 28, 45, 0.15);
        background-clip: padding-box;
        border: 0px solid rgba(0, 0, 0, 0.15);
        border-radius: 0.5rem;
      }
    }
    .selectnetwork .dropdown-menu .box .title {
      padding-left: 1rem;
      padding-right: 1rem;
      padding-bottom: 0.5rem;
      @media (min-width: 640px) { 
      padding-left: 1.5rem;
      padding-right: 1.5rem; } }
      .selectnetwork .dropdown-menu .box .title .title-header {
        display: flex;
        justify-content: space-between;
        align-items: center;}
        .selectnetwork .dropdown-menu .box .title .title-header .title-text {
          font-size: 0.875rem;
          line-height: 1.25rem;
          color: rgb(100,116,139);
          font-weight: 600; }
    .selectnetwork .dropdown-menu .box .network-items {
      border-radius: 0.5rem;
      margin-left: 0.75rem;
      margin-right: 0.75rem;
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      
      &:hover {
        // border-bottom: 1px solid rgb(48, 138, 245);
        // border-top: 1px solid rgb(48, 138, 245);
        // border-left: 1px solid rgb(48, 138, 245);
        // border-right: 1px solid rgb(48, 138, 245);
        background-color: rgba(48, 138, 245,0.2);
      }

      @media (min-width: 640px) {
        padding-left: 1rem;
        padding-right: 1rem; } }
      .selectnetwork .dropdown-menu .box .network-items button {
        display: flex;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        align-items: center;
        width: 100%; 
        @media (max-width: 768px) {
        padding-left: 0.5rem;
        padding-right: 1rem; } }
      .selectnetwork .dropdown-menu .box .network-items .items-name {
        display: flex;
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 500;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex-direction: column;
        @media (min-width: 640px) {
          font-size: 1rem;
          line-height: 1.3rem; } }
        .selectnetwork .dropdown-menu .box .network-items .items-name .item-title {
          color: black;
          font-size: 0.875rem;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap; }
        .selectnetwork .dropdown-menu .box .network-items .items-name .item-balance {
          color: #6a6d7c;
          font-size: 0.875rem;
          font-weight: 400;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
.notify-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 9999px;
  opacity: 1;
  background-color: rgb(250, 62, 62);
  // @media (min-width: 640px) {
  //   width: 0.75rem;
  //   height: 0.75rem; }
}
  .notification .dropdown-menu {
    border: 0px;
    padding: 15px 20px 10px;
    margin: 0px;
    // top: 25px !important;
    width: 330px;
    box-shadow: 0 36px 48px rgba(27, 25, 148, 0.08);
    border-radius: 5px; }
    .notification .dropdown-menu h4, .notification .dropdown-menu .h4 {
      border-bottom: 1px solid #f1f1f1;
      padding-bottom: 15px;
      font-size: 16px; }
    .notification .dropdown-menu a {
      display: inline-block;
      border-bottom: 1px solid #f1f1f1;
      padding: 10px 0px; }
      .notification .dropdown-menu a:last-child {
        border: 0px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        color: #343a40; }
        .notification .dropdown-menu a:last-child i {
          margin-left: 5px;
          font-size: 18px; }
      .notification .dropdown-menu a p {
        margin-bottom: 0px;
        color: #495057;
        font-weight: 500;
        font-size: 14px; }
      .notification .dropdown-menu a span {
        font-size: 13px;
        color: #495057; }
      .notification .dropdown-menu a span.icon {
        height: 40px;
        width: 40px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50px; }
        .notification .dropdown-menu a span.icon i {
          font-size: 20px; }
      .notification .dropdown-menu a span.success {
        background: #34c38f; }
      .notification .dropdown-menu a span.fail {
        background: #f46a6a; }
      .notification .dropdown-menu a span.pending {
        background: #f1b44c; }
.smart-contract-address h5:hover {
  background-color: rgba(7, 106, 224, 0.15);
}
.smart-contract-address h5 {
  margin-bottom: 0;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  background-color: #F3F4F6;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: 0.5rem; }
.wallet-info {
  margin-bottom: 1rem;
}
</style>
