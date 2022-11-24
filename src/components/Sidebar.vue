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
            <span class="icon-grey"><i class="icofont-ui-home"></i></span>
          </router-link>
        </li>
        <li>
          <router-link to="/testabout" data-toggle="tooltip" data-placement="right" title="Trade"
            :class="active === 2 && 'active'">
            <span class="icon-grey"><i class="icofont-stack-exchange"></i></span>
          </router-link>
        </li>
        <li>
          <router-link to="/collectible" data-toggle="tooltip" data-placement="right" title="Wallet"
            :class="active === 3 && 'active'">
            <span class="icon-grey"><i class="icofont-wallet"></i></span>
          </router-link>
        </li>
        <li>
          <router-link to="/activities" data-toggle="tooltip" data-placement="right" title="Price"
            :class="active === 4 && 'active'">
            <span class="icon-grey"><i class="icofont-price"></i></span>
          </router-link>
        </li>
        <li class="logout">
          <router-link to="/signin" data-toggle="tooltip" data-placement="right" title="Signout">
            <span class="icon-grey"><i class="icofont-power"></i></span>
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
  background: #fff;
  position: fixed;
  left: 20px;
  height: calc(95%);
  width: 6.5rem;
  top: 2.5%;
  z-index: 3;
  bottom: 20px;
  border-radius: 25px; }
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
      height: 60px;
      left: 0;
      border-radius: 0px; } }
.menu {
  margin-top: 100px; }
  @media only screen and (max-width: 767px) {
    .menu {
      margin-top: 4px; } }
  @media only screen and (max-width: 767px) {
    .menu ul {
      display: flex;
      justify-content: space-around;
      align-items: center; } }
  .menu ul li {
    list-style-type: none;
    text-align: center; }
    .menu ul li a {
      padding: 13px 18px;
      display: inline-block;
      margin-bottom: 20px;
      border-radius: 15px; }
      .menu ul li a:hover, 
      .menu ul li a:focus, 
      .menu ul li a:active {
        background: rgba(91, 207, 197, 0.1);
        .menu ul li:hover a:hover i {
          color: #5BCFC5;
          font-size: 24px;
          opacity: 1; } }
      .menu ul li a.router-link-active {
        background: rgba(91,207,197,0.15); }
        .menu ul li a.router-link-active i {
          color: #5BCFC5;
          font-size: 24px;
          opacity: 1; }
      .menu ul li a i {
        color: #9fa4a6;
        font-size: 24px; }
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
  color: #000; }
  .copyright a {
    color: #000;
    font-size: 12px; }
  @media only screen and (max-width: 767px) {
    .copyright {
      display: none; } }
</style>