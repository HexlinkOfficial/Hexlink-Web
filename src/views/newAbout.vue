<style lang="less" scoped>
.content-body {
  margin-left: 9.5rem;
}

@media only screen and (max-width: 880px) {
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

.card {
  margin-bottom: 1.875rem;
  background-color: #fff;
  transition: all .5s ease-in-out;
  position: relative;
  border: 0px solid transparent;
  border-radius: 1.75rem;
  box-shadow: 0px 5px 5px 0px rgba(82, 63, 105, 0.05);
  height: calc(100% - 30px);
}

@media only screen and (max-width: 575px) {
  .card {
    margin-bottom: 0.938rem;
    height: calc(100% - 0.938rem);
  }
}

.card-body {
  padding: 1.875rem;
}

@media only screen and (max-width: 575px) {
  .card-body {
    padding: 1rem;
  }
}

.card-title {
  font-size: 20px;
  font-weight: 500;
  color: #000;
  text-transform: capitalize;
}

.card-title--large {
  font-size: 1.5rem;
}

.card-title--medium {
  font-size: 1rem;
}

.card-title--small {
  font-size: 0.875rem;
}

.card-header {
  border-color: #f5f5f5;
  position: relative;
  background: transparent;
  padding: 1.5rem 1.875rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media only screen and (max-width: 575px) {
  .card-header {
    padding: 1.25rem 1rem 1.25rem;
  }
}

[data-theme-version="dark"] .card-header {
  border-color: #2e2e42;
}

.card-header .card-title {
  margin-bottom: 0px;
}

.card-header .subtitle {
  padding-top: 5px;
  font-size: 14px;
  line-height: 1.5;
}

.card-footer {
  border-color: #f5f5f5;
  background: transparent;
  padding: 1.25rem 1.875rem 1.25rem;
}

[data-theme-version="dark"] .card-footer {
  border-color: #2e2e42;
}

// dashboard card
.invoice-card-row .invoice-card {
  overflow: hidden;
  position: relative;
}

.invoice-card-row .invoice-card .icon {
  height: 60px;
  width: 60px;
  line-height: 54px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  text-align: center;
}

.invoice-card-row .invoice-card .card-body {
  padding: 35px 30px 45px 30px;
}

.invoice-card-row .invoice-card .invoice-num {
  font-size: 38px;
  margin-bottom: 5px;
}

.invoice-card-row .invoice-card:after {
  position: absolute;
  content: "";
}

@media only screen and (max-width: 575px) {
  .invoice-card-row .invoice-card .card-body {
    padding: 20px 20px 25px 20px;
  }

  .invoice-card-row .invoice-card .invoice-num {
    font-size: 30px;
  }
}

.invoice-card-row>div:nth-child(1) .invoice-card:after {
  height: 120px;
  width: 120px;
  transform: rotate(40deg);
  top: -35px;
  right: -35px;
  border-radius: 1.75rem;
  background: -moz-linear-gradient(left, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
  background: -webkit-linear-gradient(left, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
  background: linear-gradient(to right, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#26ffffff', endColorstr='#00ffffff', GradientType=1);
}

.invoice-card-row>div:nth-child(2) .invoice-card:after {
  height: 150px;
  width: 150px;
  transform: rotate(40deg);
  bottom: -40px;
  right: -30px;
  border-radius: 1.75rem;
  background: -moz-linear-gradient(left, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  background: -webkit-linear-gradient(left, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  background: linear-gradient(to right, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#26ffffff', endColorstr='#00ffffff', GradientType=1);
}

.invoice-card-row>div:nth-child(3) .invoice-card:after {
  height: 100px;
  width: 100px;
  transform: rotate(-45deg);
  top: -35px;
  right: 30px;
  border-radius: 1.75rem;
  background: -moz-linear-gradient(left, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
  background: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
  background: linear-gradient(to right, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#26ffffff', endColorstr='#00ffffff', GradientType=1);
}

.invoice-card-row>div:nth-child(4) .invoice-card:after {
  height: 100px;
  width: 100px;
  transform: rotate(145deg);
  bottom: -45px;
  right: 0px;
  border-radius: 1.75rem;
  background: -moz-linear-gradient(left, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
  background: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
  background: linear-gradient(to right, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#26ffffff', endColorstr='#00ffffff', GradientType=1);
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
  z-index: 1;
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
  background: #556ee6 !important;
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

img,
svg {
  vertical-align: middle;
}
</style>
<template>
  <layout :active="1">
    <div class="content-body">
      <div class="container">
        <div class="row">
          <div className="row invoice-card-row">
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
    </div>
  </layout>
</template>

<script lang="ts">
import Layout from "../components/Layout.vue";
import { useAuthStore } from '@/stores/auth';

export default {
  components: {
    Layout,
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