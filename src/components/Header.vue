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
                  <!-- <span>Hexlink</span> -->
                </router-link>
              </div>
              <!-- <div class="search">
                <form action="#" v-on:submit.prevent="">
                  <div class="input-group">
                    <input type="text" class="form-control" placeholder="Search Here" />
                    <span class="input-group-text"><i class="icofont-search"></i></span>
                  </div>
                </form>
              </div> -->
            </div>

            <div class="header-right">
              <!-- <div class="dark-light-toggle" @click="themeToggle()">
                <span class="dark"><i class="icofont-moon"></i></span>
                <span class="light"><i class="icofont-sun-alt"></i></span>
              </div> -->
              <div class="notification dropdown" @click="activeDropDown('notification')"
                :class="active_ === 'notification' && 'show'">
                <div class="notify-bell" data-toggle="dropdown">
                  <span><i class="icofont-alarm"></i></span>
                </div>
                <div class="
                    dropdown-menu dropdown-menu-right
                    notification-list
                    mt-3
                  " :class="active_ === 'notification' && 'show'">
                  <h4>Announcements</h4>
                  <div class="lists">
                    <router-link to="#" class="">
                      <div class="d-flex align-items-center">
                        <span class="me-3 icon success"><i class="icofont-check"></i></span>
                        <div>
                          <p>Account created successfully</p>
                          <span>2020-11-04 12:00:23</span>
                        </div>
                      </div>
                    </router-link>
                    <router-link to="#" class="">
                      <div class="d-flex align-items-center">
                        <span class="me-3 icon fail"><i class="icofont-close"></i></span>
                        <div>
                          <p>2FA verification failed</p>
                          <span>2020-11-04 12:00:23</span>
                        </div>
                      </div>
                    </router-link>
                    <router-link to="#" class="">
                      <div class="d-flex align-items-center">
                        <span class="me-3 icon success"><i class="icofont-check"></i></span>
                        <div>
                          <p>Device confirmation completed</p>
                          <span>2020-11-04 12:00:23</span>
                        </div>
                      </div>
                    </router-link>
                    <router-link to="#" class="">
                      <div class="d-flex align-items-center">
                        <span class="me-3 icon pending"><i class="icofont-warning"></i></span>
                        <div>
                          <p>Phone verification pending</p>
                          <span>2020-11-04 12:00:23</span>
                        </div>
                      </div>
                    </router-link>

                    <router-link to="./settings-activity">More <i class="icofont-simple-right"></i></router-link>
                  </div>
                </div>
              </div>

              <div class="profile_log dropdown" @click="activeDropDown('profile')" :class="active_ && 'show'">
                <div class="user" data-toggle="dropdown">
                  <span class="thumb"><img :src="user?.photoURL" :size="64" referrerpolicy="no-referrer" /></span>
                  <span class="arrow"><i class="icofont-angle-down"></i></span>
                </div>
                <div class="dropdown-menu dropdown-menu-right mt-3" :class="active_ === 'profile' && 'show'">
                  <div class="user-email">
                    <div class="user">
                      <span class="thumb"><img :src="user?.photoURL" :size="64" referrerpolicy="no-referrer" /></span>
                      <div class="user-info">
                        <h5>{{ user?.displayName }}</h5>
                        <span>{{ user?.email }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="user-balance">
                    <div class="available">
                      <p>Available</p>
                      <span>0.00 BTC</span>
                    </div>
                    <div class="total">
                      <p>Total</p>
                      <span>0.00 USD</span>
                    </div>
                  </div>
                  <router-link to="profile" class="dropdown-item">
                    <i class="icofont-ui-user"></i>Profile
                  </router-link>
                  <router-link to="wallet" class="dropdown-item">
                    <i class="icofont-wallet"></i>Wallet
                  </router-link>
                  <!-- <router-link to="settings-profile" class="dropdown-item">
                    <i class="icofont-ui-settings"></i> Setting
                  </router-link> -->
                  <router-link to="/activities" class="dropdown-item">
                    <i class="icofont-history"></i> Activity
                  </router-link>
                  <!-- <router-link to="lock" class="dropdown-item">
                    <i class="icofont-lock"></i>Lock
                  </router-link> -->
                  <router-link to="signin" class="dropdown-item logout">
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
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth';

export default {
  name: "Header",
  data() {
    const store = useAuthStore();
    const user = store.currentUser!;
    return {
      user,
      active_: "",
      themes: "",
    };
  },
  methods: {
    activeDropDown(value: any) {
      this.active_ = this.active_ === value ? "" : value;
    },
    themeToggle(value: { isOk: any; theme: string; }) {
      let element = document.body;
      let value_ = value && value.isOk;
      this.themes = this.themes !== "" ? "" : "dark-theme";
      element.classList = value_ ? value.theme : this.themes;
      localStorage.setItem("theme", value_ ? value.theme : this.themes);
    },
  },
  created() {
    let theme = localStorage.getItem("theme");
    this.themeToggle({ theme, isOk: true });
    this.themes = theme;
  },
};
</script>

<style lang="less" scoped>
.header {
  background: #f0f0f0;
  padding: 30px 0px 20px 0px;
  position: fixed;
  top: 0;
  left: 9.5rem;
  right: 0;
  z-index: 2; }
  @media only screen and (max-width: 880px) {
    .header {
      left: 0;
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
    @media only screen and (max-width: 880px) {
      .header .brand-logo {
        display: block; }
        .header .brand-logo span {
          display: none; } }
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
@media only screen and (max-width: 880px) {
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
  align-items: center; }
  .profile_log .user .thumb {
    height: 35px;
    width: 35px;
    // border-radius: 50px;
    color: #fff;
    text-align: center; }
    .profile_log .user .thumb img {
      border-radius: 50px;
      max-width: 35px; }
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
  border: 0px;
  padding: 0px;
  margin: 0px;
  top: 25px !important;
  box-shadow: 0 1.5rem 4rem rgba(22, 28, 45, 0.15);
  border-radius: 5px;
  background-color: #fff;
  min-width: 240px; }
  .profile_log .dropdown-menu .user-email {
    padding: 20px 20px 10px; }
    .profile_log .dropdown-menu .user-email .thumb {
      margin-right: 10px; }
    .profile_log .dropdown-menu .user-email .user-info {
      margin: 0px; }
    .profile_log .dropdown-menu .user-email h5, .profile_log .dropdown-menu .user-email .h5 {
      margin-bottom: 0px; }
    .profile_log .dropdown-menu .user-email span {
      font-size: 14px; }
  .profile_log .dropdown-menu .user-balance {
    display: flex;
    justify-content: space-around;
    margin-bottom: 15px; }
    .profile_log .dropdown-menu .user-balance p {
      margin-bottom: 0px;
      font-weight: 500;
      color: #495057; }
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
      color: #556ee6;
      font-weight: bold; }
    .profile_log .dropdown-menu .dropdown-item:hover, .profile_log .dropdown-menu .dropdown-item:focus, .profile_log .dropdown-menu .dropdown-item.active {
      background-color: #556ee6;
      color: #fff; }
      .profile_log .dropdown-menu .dropdown-item:hover i, .profile_log .dropdown-menu .dropdown-item:focus i, .profile_log .dropdown-menu .dropdown-item.active i {
        color: #fff; }
.dropdown-menu {
  position: absolute;
  z-index: 1000;
  display: none;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0;
  font-size: 0.8125rem;
  color: #495057;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem; }
  .dropdown-menu[data-bs-popper] {
    top: 100%;
    left: 0;
    margin-top: 0.125rem; }
.dropdown-menu.show {
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
  right: 1rem; }
.dropdown-menu.dropdown-menu-right.mt-3.show {
  position: absolute;
  right: 0rem; }
.notification {
  cursor: pointer; }
  .notification .notify-bell {
    margin-right: 30px; }
    @media only screen and (max-width: 880px) {
      .notification .notify-bell {
        margin-right: 15px;
        margin-left: 15px; } }
    .notification .notify-bell i {
      font-size: 20px;
      color: #343a40; }
  .notification .dropdown-menu {
    border: 0px;
    padding: 15px 20px 10px;
    margin: 0px;
    top: 25px !important;
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
</style>
