<template>
  <div class="sidebar">
    <div class="brand-logo">
      <router-link to="/"><img src="../assets/logo/blue-logo.svg" alt="" />
      </router-link>
    </div>
    <div class="menu">
      <ul>
        <li>
          <router-link to="/testhome" data-toggle="tooltip" data-placement="right" title="Home"
            :class="active === 1 && 'active'">
            <span><i class="icofont-ui-home"></i></span>
          </router-link>
        </li>
        <li>
          <router-link to="/testabout" data-toggle="tooltip" data-placement="right" title="Trade"
            :class="active === 2 && 'active'">
            <span><i class="icofont-stack-exchange"></i></span>
          </router-link>
        </li>
        <li>
          <router-link to="/collections" data-toggle="tooltip" data-placement="right" title="Wallet"
            :class="active === 3 && 'active'">
            <span><i class="icofont-wallet"></i></span>
          </router-link>
        </li>
        <li>
          <router-link to="/testhome" data-toggle="tooltip" data-placement="right" title="Price"
            :class="active === 4 && 'active'">
            <span><i class="icofont-price"></i></span>
          </router-link>
        </li>
        <li class="logout">
          <router-link to="/testabout" data-toggle="tooltip" data-placement="right" title="Signout">
            <span><i class="icofont-power"></i></span>
          </router-link>
        </li>
      </ul>

      <p class="copyright">&#169; <router-link to="#">Hexlink</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  props: {
    active: Number,
  },
};
</script>

<style lang="less" scoped>
.sidebar {
  background: #5BCFC5;
  position: fixed;
  left: 20px;
  height: calc(95%);
  width: 5rem;
  top: 2.5%;
  z-index: 3;
  bottom: 20px;
  border-radius: 15px; }
  // @media only screen and (max-width: 1023px) {
  //   .sidebar {
  //     width: 5rem;
  //     transition: 0.4s ease-in-out;
  //     overflow: hidden; } }
  @media only screen and (max-width: 767px) {
    .sidebar {
      top: auto;
      bottom: 0;
      width: 100%;
      height: 50px;
      left: 0;
      border-radius: 0px; } }
.menu {
  margin-top: 100px; }
  @media only screen and (max-width: 767px) {
    .menu {
      margin-top: 0px; } }
  @media only screen and (max-width: 767px) {
    .menu ul {
      display: flex;
      justify-content: space-around;
      align-items: center; } }
  .menu ul li {
    list-style-type: none;
    text-align: center; }
    .menu ul li a {
      padding: 12px 15px;
      display: inline-block;
      margin-bottom: 20px;
      border-radius: 10px; }
      .menu ul li a:hover, .menu ul li a:focus, .menu ul li a:active {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        opacity: 1; }
      .menu ul li a .active {
        background: rgba(255, 255, 255, 0.15); }
        .menu ul li a .active i {
          color: #fff;
          opacity: 1; }
      .menu ul li a i {
        color: #fff;
        font-size: 24px;
        opacity: 0.75; }
    .menu ul li.logout {
      position: absolute;
      bottom: 50px;
      left: 0;
      right: 0; }
      @media only screen and (max-width: 767px) {
        .menu ul li.logout {
          position: relative;
          bottom: 0;
          left: auto;
          right: auto; } }
.copyright {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 14px;
  color: #fff; }
  .copyright a {
    color: #fff;
    font-size: 12px; }
  @media only screen and (max-width: 767px) {
    .copyright {
      display: none; } }
</style>