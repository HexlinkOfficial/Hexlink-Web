<style lang="less" scoped>
.content-body {
  margin-left: 100px;
}

@media only screen and (max-width: 767px) {
  .content-body {
    margin-left: 0px;
    margin-bottom: 50px;
  }
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
}

.card>hr {
  margin-right: 0;
  margin-left: 0;
}

.card>.list-group {
  border-top: inherit;
  border-bottom: inherit;
}

.card>.list-group:first-child {
  border-top-width: 0;
  border-top-left-radius: calc(0.25rem - 1px);
  border-top-right-radius: calc(0.25rem - 1px);
}

.card>.list-group:last-child {
  border-bottom-width: 0;
  border-bottom-right-radius: calc(0.25rem - 1px);
  border-bottom-left-radius: calc(0.25rem - 1px);
}

.card>.card-header+.list-group,
.card>.list-group+.card-footer {
  border-top: 0;
}

.card {
  margin-bottom: 30px;
  height: calc(100% - 30px);
  border: 0;
  box-shadow: 0px 0px 40px 0px rgba(82, 63, 105, 0.12);
}

.card.h-unset {
  height: unset;
}

.card.no-shadow {
  box-shadow: 0 0.75rem 1.5rem rgba(68, 63, 75, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f1f1;
  background: transparent;
  padding: 20px;
}

.card-title {
  font-size: 16px;
  margin-bottom: 0px;
  color: #495057;
  font-weight: 600;
}

.card .card-body {
  padding: 20px;
  background: transparent;
  border-radius: 15px;
}

.card .card-footer {
  padding: 20px;
  background: #fff;
}

.card-body {
  flex: 1 1 auto;
  padding: 1rem 1rem;
}

.invite-content .input-group-text {
  background: #556ee6;
  color: #fff;
}

.invite-content .social-share-link {
  margin-top: 15px;
}

.invite-content .social-share-link a {
  display: inline-block;
  margin-right: 10px;
}

.invite-content .social-share-link a i {
  font-size: 20px;
}

.invite-content .social-share-link a i.icofont-facebook {
  color: #3b5998;
}

.invite-content .social-share-link a i.icofont-twitter {
  color: #1da1f2;
}

.invite-content .social-share-link a i.icofont-whatsapp {
  color: #25d366;
}

.invite-content .social-share-link a i.icofont-telegram {
  color: #0088cc;
}

.input-group {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;
}

.input-group>.form-control,
.input-group>.form-select {
  position: relative;
  flex: 1 1 auto;
  width: 1%;
  min-width: 0;
}

.input-group>.form-control:focus,
.input-group>.form-select:focus {
  z-index: 3;
}

.input-group .btn {
  position: relative;
  z-index: 2;
}

.input-group .btn:focus {
  z-index: 3;
}

.price-widget {
  border-radius: 10px;
  margin: 0px 0px 30px;
}

.price-widget a {
  display: block;
}

.bg-btc {
  background: #F7931A;
}

.bg-eth {
  background: #282828;
}

.bg-usdt {
  background: #2CA07A;
}

.bg-xrp {
  background: #346AA9;
}

.bg-ltc {
  background: #838383;
}

.bg-ada {
  background: #3CC8C8;
}

.bg-eos {
  background: #19191A;
}

.bg-xmr {
  background: #FF6600;
}

.bg-xtz {
  background: #A6DF00;
}

.bg-xem {
  background: #41bf76;
}

.bg-neo {
  background: #58BF00;
}

.bg-dash {
  background: #1c75bc;
}

.bg-etc {
  background: #669073;
}

.bg-dgb {
  background: #0066cc;
}

.bg-dcr {
  background: #3b7cfb;
}

.bg-rep {
  background: #40a2cb;
}

.price-content {
  position: absolute;
  left: 15px;
  top: 10px;
}

.price-content i {
  padding: 5px 7px;
  border-radius: 100px;
  margin-right: 5px;
  margin-top: 11px;
  position: relative;
  top: 13px;
  font-size: 32px;
  color: #fff;
  line-height: 40px;
}

.price-content span {
  color: #fff;
  font-size: 20px;
  font-weight: 500;
}

.price-content h5,
.price-content .h5 {
  margin-top: 0px;
  color: #fff;
  margin-left: 55px;
  opacity: 0.85;
  font-weight: normal;
}

.welcome-profile {
  background: linear-gradient(to right, #5bcfc5 25%, #3197b7 100%);
  color: #fff;
  transition: all .5s ease-in-out;
  box-shadow: 0px 5px 5px 0px rgb(82 63 105 / 5%);
}

.welcome-profile:after {
  background: linear-gradient(to right, rgba(255, 255, 255, 0.1) 0%, rgba(49, 151, 183, 0) 100%);
  transform: rotate(45deg);
  height: 90px;
  width: 90px;
  content: "";
  position: absolute;
  bottom: -20px;
  right: 0;
}

.welcome-profile .card-body img {
  border: 4px solid #fff;
  border-radius: 100px;
  width: 60px;
}

.welcome-profile .card-body h4,
.welcome-profile .card-body .h4 {
  color: #fff;
  margin-top: 10px;
  font-size: 18px;
}

.welcome-profile .card-body p {
  color: #fff;
  opacity: 0.75;
}

.welcome-profile .card-body ul {
  text-align: left;
}

.welcome-profile .card-body ul li {
  padding: 15px 0px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.welcome-profile .card-body ul li:last-child {
  border: 0px;
}

.welcome-profile .card-body ul li a {
  color: #f2f2f2;
  display: flex;
  align-items: center;
  transition: all 0.25 ease-in-out;
}

.welcome-profile .card-body ul li a span {
  background: #fff;
  padding: 5px;
  border-radius: 50px;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  transition: all 0.25 ease-in-out;
}

.welcome-profile .card-body ul li a span.verified {
  color: #34c38f;
}

.welcome-profile .card-body ul li a span.not-verified {
  color: #f46a6a;
}

.trade-form p {
  font-size: 13px;
  color: #495057;
}

.trade-form p a {
  color: #556ee6;
}

.form-label {
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.home-chart .form-select {
  width: 150px;
  height: auto;
  border: 0px;
  padding: 0px;
  background: transparent;
}

.chart-price-value {
  text-align: center;
}

.chart-price-value span {
  display: inline-block;
  margin-bottom: 5px;
  font-size: 14px;
}

.trade-balance {
  position: relative;
  height: 380px;
}

.position-value {
  position: relative;
  height: 480px;
}

.coin-name i {
  font-size: 20px;
  margin-right: 5px;
}
</style>
<template>
  <layout :active="1">
    <div class="content-body">
      <div class="container">
        <div class="row">
          <div class="col-xxl-6 col-xl-6 col-lg-12">
            <div class="card">
              <div class="card-body">
                <div class="invite-content">
                  <h4>Invite a friend and get $30</h4>
                  <p>
                    You will receive up to $30 when they 1.Buy Crypto 2.
                    Deposit 3. Launch their FIRST airdrop 🔥.
                    <router-link to="#">Learn more</router-link>
                  </p>

                  <div class="copy-link">
                    <form action="#">
                      <div class="input-group">
                        <input type="text" class="form-control" v-bind:value="message" />
                        <!-- <span class="input-group-text c-pointer" @click="doCopy">Copy</span> -->
                        <span class="btn btn-primary" @click="doCopy">Copy</span>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xxl-6 col-xl-6 col-lg-12">
            <div class="card">
              <div class="card-body">
                <div class="invite-content">
                  <h4>Get free BTC every day</h4>
                  <p>
                    Earn free Sui in rewards by completing a learning
                    mission daily or inviting friends to Hexlink 🚀.
                    <router-link to="#">Learn more</router-link>
                  </p>

                  <router-link to="#" class="btn btn-primary">Invite friends to join</router-link>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xxl-3 col-xl-6 col-lg-6">
            <div class="card welcome-profile">
              <div class="card-body">
                <img :src="user?.photoURL" :size="64" referrerpolicy="no-referrer" />
                <h4>Welcome, {{ user?.displayName }}!</h4>
                <p>
                  Looks like you are not verified yet. Verify yourself to use
                  the full potential of Qash.
                </p>

                <ul>
                  <li>
                    <router-link to="#">
                      <span class="verified"><i class="icofont-check-alt"></i></span>
                      Verify account
                    </router-link>
                  </li>
                  <li>
                    <router-link to="#">
                      <span class="not-verified"><i class="icofont-close-line"></i></span>
                      Two-factor authentication (2FA)
                    </router-link>
                  </li>
                  <li>
                    <router-link to="#">
                      <span class="not-verified"><i class="icofont-close-line"></i></span>
                      Deposit money
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script lang="ts">
// import BalanceChart from "../../components/qCash/BalanceChart.vue";
// import AnalyticsChart from "../../components/qCash/home/AnalyticsChart.vue";
import Layout from "../components/Layout.vue";
// import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import { useAuthStore } from '@/stores/auth';

export default {
  components: {
    Layout,
    // BalanceChart,
    // AnalyticsChart,
    // PerfectScrollbar,
  },
  data() {
    const store = useAuthStore();
    const user = store.currentUser!;
    return {
      user,
      message: "https://play.hexlink.io/join/12345",
    };
  },
  methods: {
    doCopy: function () {
      this.$copyText(this.message).then(
        function () {
          alert("Copied");
        },
        function () {
          alert("Can not copy");
        }
      );
    },
  },
};
</script>