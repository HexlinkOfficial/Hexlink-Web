<style lang="less" scoped>
.content-body {
  margin-left: 9.5rem; }
  @media only screen and (max-width: 880px) {
    .content-body {
      margin-left: 0px;
      margin-bottom: 50px; } }
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem; }
  .card > hr {
    margin-right: 0;
    margin-left: 0; }
  .card > .list-group {
    border-top: inherit;
    border-bottom: inherit; }
    .card > .list-group:first-child {
      border-top-width: 0;
      border-top-left-radius: calc(0.25rem - 1px);
      border-top-right-radius: calc(0.25rem - 1px); }
    .card > .list-group:last-child {
      border-bottom-width: 0;
      border-bottom-right-radius: calc(0.25rem - 1px);
      border-bottom-left-radius: calc(0.25rem - 1px); }
  .card > .card-header + .list-group,
  .card > .list-group + .card-footer {
    border-top: 0; }
.card {
  margin-bottom: 30px;
  height: calc(100% - 30px);
  border: 0;
  box-shadow: 0px 0px 40px 0px rgba(82, 63, 105, 0.12); }
  .card.h-unset {
    height: unset; }
  .card.no-shadow {
    box-shadow: 0 0.75rem 1.5rem rgba(68, 63, 75, 0.1); }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f1f1;
    background: transparent;
    padding: 20px; }
  .card-title {
    font-size: 16px;
    margin-bottom: 0px;
    color: #495057;
    font-weight: 600; }
  .card .card-body {
    padding: 20px;
    background: transparent;
    border-radius: 15px; }
  .card .card-footer {
    padding: 20px;
    background: #fff; }
.card-body {
  flex: 1 1 auto;
  padding: 1rem 1rem; }
.invite-content .input-group-text {
  background: #556ee6;
  color: #fff; }

.card {
  margin-bottom: 1.875rem;
  background-color: #fff;
  transition: all .5s ease-in-out;
  position: relative;
  border: 0px solid transparent;
  border-radius: 1.75rem;
  box-shadow: 0px 5px 5px 0px rgba(82, 63, 105, 0.05);
  height: calc(100% - 30px); }
  @media only screen and (max-width: 575px) {
    .card {
      margin-bottom: 0.938rem;
      height: calc(100% - 0.938rem); } }
  .card-body {
    padding: 1.875rem; }
    @media only screen and (max-width: 575px) {
      .card-body {
        padding: 1rem; } }
  .card-title {
    font-size: 20px;
    font-weight: 500;
    color: #000;
    text-transform: capitalize; }
    .card-title--large {
      font-size: 1.5rem; }
    .card-title--medium {
      font-size: 1rem; }
    .card-title--small {
      font-size: 0.875rem; }
  .card-header {
    border-color: #f5f5f5;
    position: relative;
    background: transparent;
    padding: 1.5rem 1.875rem 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center; }
    @media only screen and (max-width: 575px) {
      .card-header {
        padding: 1.25rem 1rem 1.25rem; } }
    [data-theme-version="dark"] .card-header {
      border-color: #2e2e42; }
    .card-header .card-title {
      margin-bottom: 0px; }
    .card-header .subtitle {
      padding-top: 5px;
      font-size: 14px;
      line-height: 1.5; }
  .card-footer {
    border-color: #f5f5f5;
    background: transparent;
    padding: 1.25rem 1.875rem 1.25rem; }
    [data-theme-version="dark"] .card-footer {
      border-color: #2e2e42; }

// dashboard card
.invoice-card-row .invoice-card {
  overflow: hidden;
  position: relative; }
  .invoice-card-row .invoice-card .icon {
    height: 60px;
    width: 60px;
    line-height: 54px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    text-align: center; }
  .invoice-card-row .invoice-card .card-body {
    padding: 35px 30px 45px 30px; }
  .invoice-card-row .invoice-card .invoice-num {
    font-size: 38px;
    margin-bottom: 5px; }
  .invoice-card-row .invoice-card:after {
    position: absolute;
    content: ""; }
  @media only screen and (max-width: 575px) {
    .invoice-card-row .invoice-card .card-body {
      padding: 20px 20px 25px 20px; }
    .invoice-card-row .invoice-card .invoice-num {
      font-size: 30px; } }
.invoice-card-row > div:nth-child(1) .invoice-card:after {
  height: 120px;
  width: 120px;
  transform: rotate(40deg);
  top: -35px;
  right: -35px;
  border-radius: 1.75rem;
  background: -moz-linear-gradient(left, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
  background: -webkit-linear-gradient(left, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
  background: linear-gradient(to right, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#26ffffff', endColorstr='#00ffffff',GradientType=1 ); }
.invoice-card-row > div:nth-child(2) .invoice-card:after {
  height: 150px;
  width: 150px;
  transform: rotate(40deg);
  bottom: -40px;
  right: -30px;
  border-radius: 1.75rem;
  background: -moz-linear-gradient(left, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  background: -webkit-linear-gradient(left, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  background: linear-gradient(to right, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#26ffffff', endColorstr='#00ffffff',GradientType=1 ); }
.invoice-card-row > div:nth-child(3) .invoice-card:after {
  height: 100px;
  width: 100px;
  transform: rotate(-45deg);
  top: -35px;
  right: 30px;
  border-radius: 1.75rem;
  background: -moz-linear-gradient(left, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
  background: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
  background: linear-gradient(to right, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#26ffffff', endColorstr='#00ffffff',GradientType=1 ); }
.invoice-card-row > div:nth-child(4) .invoice-card:after {
  height: 100px;
  width: 100px;
  transform: rotate(145deg);
  bottom: -45px;
  right: 0px;
  border-radius: 1.75rem;
  background: -moz-linear-gradient(left, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
  background: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
  background: linear-gradient(to right, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#26ffffff', endColorstr='#00ffffff',GradientType=1 ); }

.invite-content .social-share-link {
  margin-top: 15px; }
  .invite-content .social-share-link a {
    display: inline-block;
    margin-right: 10px; }
    .invite-content .social-share-link a i {
      font-size: 20px; }
      .invite-content .social-share-link a i.icofont-facebook {
        color: #3b5998; }
      .invite-content .social-share-link a i.icofont-twitter {
        color: #1da1f2; }
      .invite-content .social-share-link a i.icofont-whatsapp {
        color: #25d366; }
      .invite-content .social-share-link a i.icofont-telegram {
        color: #0088cc; }
.input-group {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%; }
  .input-group > .form-control,
  .input-group > .form-select {
    position: relative;
    flex: 1 1 auto;
    width: 1%;
    min-width: 0; }
  .input-group > .form-control:focus,
  .input-group > .form-select:focus {
    z-index: 3; }
  .input-group .btn {
    position: relative;
    z-index: 1; }
    .input-group .btn:focus {
      z-index: 3; }
.price-widget {
  border-radius: 10px;
  margin: 0px 0px 30px; }
  .price-widget a {
    display: block; }
.bg-btc {
  background: #F7931A; }
.bg-eth {
  background: #282828; }

.bg-usdt {
  background: #2CA07A; }

.bg-xrp {
  background: #346AA9; }

.bg-ltc {
  background: #838383; }

.bg-ada {
  background: #3CC8C8; }

.bg-eos {
  background: #19191A; }

.bg-xmr {
  background: #FF6600; }

.bg-xtz {
  background: #A6DF00; }

.bg-xem {
  background: #41bf76; }

.bg-neo {
  background: #58BF00; }

.bg-dash {
  background: #1c75bc; }

.bg-etc {
  background: #669073; }

.bg-dgb {
  background: #0066cc; }

.bg-dcr {
  background: #3b7cfb; }

.bg-rep {
  background: #40a2cb; }
.price-content {
  position: absolute;
  left: 15px;
  top: 10px; }
  .price-content i {
    padding: 5px 7px;
    border-radius: 100px;
    margin-right: 5px;
    margin-top: 11px;
    position: relative;
    top: 13px;
    font-size: 32px;
    color: #fff;
    line-height: 40px; }
  .price-content span {
    color: #fff;
    font-size: 20px;
    font-weight: 500; }
  .price-content h5, .price-content .h5 {
    margin-top: 0px;
    color: #fff;
    margin-left: 55px;
    opacity: 0.85;
    font-weight: normal; }
.welcome-profile {
  background: #556ee6 !important; }
  .welcome-profile .card-body img {
    border: 4px solid #fff;
    border-radius: 100px;
    width: 60px; }
  .welcome-profile .card-body h4, .welcome-profile .card-body .h4 {
    color: #fff;
    margin-top: 10px;
    font-size: 18px; }
  .welcome-profile .card-body p {
    color: #fff;
    opacity: 0.75; }
  .welcome-profile .card-body ul {
    text-align: left; }
    .welcome-profile .card-body ul li {
      padding: 15px 0px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15); }
      .welcome-profile .card-body ul li:last-child {
        border: 0px; }
      .welcome-profile .card-body ul li a {
        color: #f2f2f2;
        display: flex;
        align-items: center;
        transition: all 0.25 ease-in-out; }
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
          transition: all 0.25 ease-in-out; }
          .welcome-profile .card-body ul li a span.verified {
            color: #34c38f; }
          .welcome-profile .card-body ul li a span.not-verified {
            color: #f46a6a; }
.trade-form p {
  font-size: 13px;
  color: #495057; }
  .trade-form p a {
    color: #556ee6; }
.form-label {
  margin-bottom: 0.5rem;
  font-weight: 600; }
.home-chart .form-select {
  width: 150px;
  height: auto;
  border: 0px;
  padding: 0px;
  background: transparent; }
.chart-price-value {
  text-align: center; }
  .chart-price-value span {
    display: inline-block;
    margin-bottom: 5px;
    font-size: 14px; }
.trade-balance {
  position: relative;
  height: 380px; }
.position-value {
  position: relative;
  height: 480px; }
.coin-name i {
  font-size: 20px;
  margin-right: 5px; }
img, svg {
  vertical-align: middle;
}
</style>
<template>
  <layout :active="1">
    <div class="content-body">
      <div class="container">
        <h1 style="margin-bottom: 1rem;;">Transaction</h1>
        <div class="row">
          <div className="row invoice-card-row">
            <div className="col-xxl-4 col-xl-4 col-lg-6">
              <div className="card bg-hexlink invoice-card">
                <div className="card-body d-flex">
                  <div className="icon me-3">
                    <svg width="33px" height="32px">
                      <path fill="rgb(255, 255, 255)"
                        d="M31.963,30.931 C31.818,31.160 31.609,31.342 31.363,31.455 C31.175,31.538 30.972,31.582 30.767,31.583 C30.429,31.583 30.102,31.463 29.845,31.243 L25.802,27.786 L21.758,31.243 C21.502,31.463 21.175,31.583 20.837,31.583 C20.498,31.583 20.172,31.463 19.915,31.243 L15.872,27.786 L11.829,31.243 C11.622,31.420 11.370,31.534 11.101,31.572 C10.832,31.609 10.558,31.569 10.311,31.455 C10.065,31.342 9.857,31.160 9.710,30.931 C9.565,30.703 9.488,30.437 9.488,30.167 L9.488,17.416 L2.395,17.416 C2.019,17.416 1.658,17.267 1.392,17.001 C1.126,16.736 0.976,16.375 0.976,16.000 L0.976,6.083 C0.976,4.580 1.574,3.139 2.639,2.076 C3.703,1.014 5.146,0.417 6.651,0.417 L26.511,0.417 C28.016,0.417 29.459,1.014 30.524,2.076 C31.588,3.139 32.186,4.580 32.186,6.083 L32.186,30.167 C32.186,30.437 32.109,30.703 31.963,30.931 ZM9.488,6.083 C9.488,5.332 9.189,4.611 8.657,4.080 C8.125,3.548 7.403,3.250 6.651,3.250 C5.898,3.250 5.177,3.548 4.645,4.080 C4.113,4.611 3.814,5.332 3.814,6.083 L3.814,14.583 L9.488,14.583 L9.488,6.083 ZM29.348,6.083 C29.348,5.332 29.050,4.611 28.517,4.080 C27.985,3.548 27.263,3.250 26.511,3.250 L11.559,3.250 C12.059,4.111 12.324,5.088 12.325,6.083 L12.325,27.092 L14.950,24.840 C15.207,24.620 15.534,24.500 15.872,24.500 C16.210,24.500 16.537,24.620 16.794,24.840 L20.837,28.296 L24.880,24.840 C25.137,24.620 25.463,24.500 25.802,24.500 C26.140,24.500 26.467,24.620 26.724,24.840 L29.348,27.092 L29.348,6.083 ZM25.092,20.250 L16.581,20.250 C16.205,20.250 15.844,20.101 15.578,19.835 C15.312,19.569 15.162,19.209 15.162,18.833 C15.162,18.457 15.312,18.097 15.578,17.831 C15.844,17.566 16.205,17.416 16.581,17.416 L25.092,17.416 C25.469,17.416 25.829,17.566 26.096,17.831 C26.362,18.097 26.511,18.457 26.511,18.833 C26.511,19.209 26.362,19.569 26.096,19.835 C25.829,20.101 25.469,20.250 25.092,20.250 ZM25.092,14.583 L16.581,14.583 C16.205,14.583 15.844,14.434 15.578,14.168 C15.312,13.903 15.162,13.542 15.162,13.167 C15.162,12.791 15.312,12.430 15.578,12.165 C15.844,11.899 16.205,11.750 16.581,11.750 L25.092,11.750 C25.469,11.750 25.829,11.899 26.096,12.165 C26.362,12.430 26.511,12.791 26.511,13.167 C26.511,13.542 26.362,13.903 26.096,14.168 C25.829,14.434 25.469,14.583 25.092,14.583 ZM25.092,8.916 L16.581,8.916 C16.205,8.916 15.844,8.767 15.578,8.501 C15.312,8.236 15.162,7.875 15.162,7.500 C15.162,7.124 15.312,6.764 15.578,6.498 C15.844,6.232 16.205,6.083 16.581,6.083 L25.092,6.083 C25.469,6.083 25.829,6.232 26.096,6.498 C26.362,6.764 26.511,7.124 26.511,7.500 C26.511,7.875 26.362,8.236 26.096,8.501 C25.829,8.767 25.469,8.916 25.092,8.916 Z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-white invoice-num">2478</h2>
                    <span className="text-white fs-18">Total Txn</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-4 col-xl-4 col-lg-6">
              <div className="card bg-secondary invoice-card">
                <div className="card-body d-flex">
                  <div className="icon me-3">
                    <svg width="35px" height="34px">
                      <path fill="rgb(255, 255, 255)"
                        d="M33.002,9.728 C31.612,6.787 29.411,4.316 26.638,2.583 C22.781,0.179 18.219,-0.584 13.784,0.438 C9.356,1.454 5.585,4.137 3.178,7.989 C0.764,11.840 -0.000,16.396 1.023,20.825 C2.048,25.247 4.734,29.013 8.584,31.417 C11.297,33.110 14.409,34.006 17.594,34.006 L17.800,34.006 C20.973,33.967 24.058,33.050 26.731,31.363 C27.509,30.872 27.735,29.849 27.243,29.072 C26.751,28.296 25.727,28.070 24.949,28.561 C22.801,29.922 20.314,30.660 17.761,30.693 C15.141,30.726 12.581,30.002 10.346,28.614 C7.241,26.675 5.080,23.647 4.262,20.088 C3.444,16.515 4.056,12.850 5.997,9.748 C10.001,3.353 18.473,1.401 24.876,5.399 C27.110,6.793 28.879,8.779 29.996,11.143 C31.087,13.447 31.513,16.004 31.227,18.527 C31.126,19.437 31.778,20.260 32.696,20.360 C33.607,20.459 34.432,19.809 34.531,18.892 C34.884,15.765 34.352,12.591 33.002,9.728 L33.002,9.728 Z" />
                      <path fill="rgb(255, 255, 255)"
                        d="M23.380,11.236 C22.728,10.585 21.678,10.585 21.026,11.236 L17.608,14.656 L14.190,11.243 C13.539,10.592 12.488,10.592 11.836,11.243 C11.184,11.893 11.184,12.942 11.836,13.593 L15.254,17.006 L11.836,20.420 C11.184,21.071 11.184,22.120 11.836,22.770 C12.162,23.096 12.588,23.255 13.014,23.255 C13.438,23.255 13.864,23.096 14.190,22.770 L17.608,19.357 L21.026,22.770 C21.352,23.096 21.777,23.255 22.203,23.255 C22.629,23.255 23.054,23.096 23.380,22.770 C24.031,22.120 24.031,21.071 23.380,20.420 L19.962,17.000 L23.380,13.587 C24.031,12.936 24.031,11.887 23.380,11.236 L23.380,11.236 Z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-white invoice-num">1256</h2>
                    <span className="text-white fs-18">Pending Txn</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-4 col-xl-4 col-lg-6">
              <div className="card bg-success invoice-card">
                <div className="card-body d-flex">
                  <div className="icon me-3">
                    <svg width="35px" height="34px">
                      <path fill="rgb(255, 255, 255)"
                        d="M32.482,9.730 C31.092,6.789 28.892,4.319 26.120,2.586 C22.265,0.183 17.698,-0.580 13.271,0.442 C8.843,1.458 5.074,4.140 2.668,7.990 C0.255,11.840 -0.509,16.394 0.514,20.822 C1.538,25.244 4.224,29.008 8.072,31.411 C10.785,33.104 13.896,34.000 17.080,34.000 L17.286,34.000 C20.456,33.960 23.541,33.044 26.213,31.358 C26.991,30.866 27.217,29.844 26.725,29.067 C26.234,28.291 25.210,28.065 24.432,28.556 C22.285,29.917 19.799,30.654 17.246,30.687 C14.627,30.720 12.067,29.997 9.834,28.609 C6.730,26.671 4.569,23.644 3.752,20.085 C2.934,16.527 3.546,12.863 5.486,9.763 C9.488,3.370 17.957,1.418 24.359,5.414 C26.592,6.808 28.360,8.793 29.477,11.157 C30.568,13.460 30.993,16.016 30.707,18.539 C30.607,19.448 31.259,20.271 32.177,20.371 C33.087,20.470 33.911,19.820 34.011,18.904 C34.363,15.764 33.832,12.591 32.482,9.730 L32.482,9.730 Z" />
                      <path fill="rgb(255, 255, 255)"
                        d="M22.593,11.237 L14.575,19.244 L11.604,16.277 C10.952,15.626 9.902,15.626 9.250,16.277 C8.599,16.927 8.599,17.976 9.250,18.627 L13.399,22.770 C13.725,23.095 14.150,23.254 14.575,23.254 C15.001,23.254 15.427,23.095 15.753,22.770 L24.940,13.588 C25.592,12.937 25.592,11.888 24.940,11.237 C24.289,10.593 23.238,10.593 22.593,11.237 L22.593,11.237 Z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-white invoice-num">983</h2>
                    <span className="text-white fs-18">Success Txn</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div className="col-xl-3 col-xxl-6 col-sm-6">
              <div className="card bg-secondary invoice-card">
                <div className="card-body d-flex">
                  <div className="icon me-3">
                    <svg width="33px" height="32px">
                      <path fill="rgb(255, 255, 255)"
                        d="M31.963,30.931 C31.818,31.160 31.609,31.342 31.363,31.455 C31.175,31.538 30.972,31.582 30.767,31.583 C30.429,31.583 30.102,31.463 29.845,31.243 L25.802,27.786 L21.758,31.243 C21.502,31.463 21.175,31.583 20.837,31.583 C20.498,31.583 20.172,31.463 19.915,31.243 L15.872,27.786 L11.829,31.243 C11.622,31.420 11.370,31.534 11.101,31.572 C10.832,31.609 10.558,31.569 10.311,31.455 C10.065,31.342 9.857,31.160 9.710,30.931 C9.565,30.703 9.488,30.437 9.488,30.167 L9.488,17.416 L2.395,17.416 C2.019,17.416 1.658,17.267 1.392,17.001 C1.126,16.736 0.976,16.375 0.976,16.000 L0.976,6.083 C0.976,4.580 1.574,3.139 2.639,2.076 C3.703,1.014 5.146,0.417 6.651,0.417 L26.511,0.417 C28.016,0.417 29.459,1.014 30.524,2.076 C31.588,3.139 32.186,4.580 32.186,6.083 L32.186,30.167 C32.186,30.437 32.109,30.703 31.963,30.931 ZM9.488,6.083 C9.488,5.332 9.189,4.611 8.657,4.080 C8.125,3.548 7.403,3.250 6.651,3.250 C5.898,3.250 5.177,3.548 4.645,4.080 C4.113,4.611 3.814,5.332 3.814,6.083 L3.814,14.583 L9.488,14.583 L9.488,6.083 ZM29.348,6.083 C29.348,5.332 29.050,4.611 28.517,4.080 C27.985,3.548 27.263,3.250 26.511,3.250 L11.559,3.250 C12.059,4.111 12.324,5.088 12.325,6.083 L12.325,27.092 L14.950,24.840 C15.207,24.620 15.534,24.500 15.872,24.500 C16.210,24.500 16.537,24.620 16.794,24.840 L20.837,28.296 L24.880,24.840 C25.137,24.620 25.463,24.500 25.802,24.500 C26.140,24.500 26.467,24.620 26.724,24.840 L29.348,27.092 L29.348,6.083 ZM25.092,20.250 L16.581,20.250 C16.205,20.250 15.844,20.101 15.578,19.835 C15.312,19.569 15.162,19.209 15.162,18.833 C15.162,18.457 15.312,18.097 15.578,17.831 C15.844,17.566 16.205,17.416 16.581,17.416 L25.092,17.416 C25.469,17.416 25.829,17.566 26.096,17.831 C26.362,18.097 26.511,18.457 26.511,18.833 C26.511,19.209 26.362,19.569 26.096,19.835 C25.829,20.101 25.469,20.250 25.092,20.250 ZM25.092,14.583 L16.581,14.583 C16.205,14.583 15.844,14.434 15.578,14.168 C15.312,13.903 15.162,13.542 15.162,13.167 C15.162,12.791 15.312,12.430 15.578,12.165 C15.844,11.899 16.205,11.750 16.581,11.750 L25.092,11.750 C25.469,11.750 25.829,11.899 26.096,12.165 C26.362,12.430 26.511,12.791 26.511,13.167 C26.511,13.542 26.362,13.903 26.096,14.168 C25.829,14.434 25.469,14.583 25.092,14.583 ZM25.092,8.916 L16.581,8.916 C16.205,8.916 15.844,8.767 15.578,8.501 C15.312,8.236 15.162,7.875 15.162,7.500 C15.162,7.124 15.312,6.764 15.578,6.498 C15.844,6.232 16.205,6.083 16.581,6.083 L25.092,6.083 C25.469,6.083 25.829,6.232 26.096,6.498 C26.362,6.764 26.511,7.124 26.511,7.500 C26.511,7.875 26.362,8.236 26.096,8.501 C25.829,8.767 25.469,8.916 25.092,8.916 Z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-white invoice-num">652</h2>
                    <span className="text-white fs-18">Total Invoices Sent</span>
                  </div>
                </div>
              </div>
            </div> -->
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
            <div class="col-xxl-6">
              <div class="card">
                <div class="card-header">
                  <h4 class="card-title">Transaction</h4>
                </div>
                <div class="card-body">
                  <div class="table-responsive transaction-table">
                    <table class="table table-striped responsive-table">
                      <thead>
                        <tr>
                          <th>Ledger ID</th>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Currency</th>
                          <th>Amount</th>
                          <th>Fee</th>
                          <th>Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>523640</td>
                          <td>January 15</td>
                          <td>
                            <span class="danger-arrow"><i class="icofont-arrow-down"></i> Sell</span>
                          </td>
                          <td class="coin-name">
                            <i class="cc BTC"></i>
                            Bitcoin
                          </td>
                          <td class="text-danger">-0.000242 BTC</td>
                          <td>0.02%</td>
                          <td>
                            <strong>0.25484 BTC</strong>
                          </td>
                        </tr>
                        <tr>
                          <td>523640</td>
                          <td>January 15</td>
                          <td>
                            <span class="success-arrow"><i class="icofont-arrow-up"></i>Buy</span>
                          </td>
                          <td class="coin-name">
                            <i class="cc LTC"></i>
                            Litecoin
                          </td>
                          <td class="text-success">-0.000242 BTC</td>
                          <td>0.02%</td>
                          <td>
                            <strong> 0.25484 LTC</strong>
                          </td>
                        </tr>
                        <tr>
                          <td>523640</td>
                          <td>January 15</td>
                          <td>
                            <span class="success-arrow"><i class="icofont-arrow-up"></i>Buy</span>
                          </td>
                          <td class="coin-name">
                            <i class="cc XRP"></i>
                            Ripple
                          </td>
                          <td class="text-success">-0.000242 BTC</td>
                          <td>0.02%</td>
                          <td>
                            <strong> 0.25484 LTC</strong>
                          </td>
                        </tr>
                        <tr>
                          <td>523640</td>
                          <td>January 15</td>
                          <td>
                            <span class="success-arrow"><i class="icofont-arrow-up"></i>Buy</span>
                          </td>
                          <td class="coin-name"><i class="cc DASH"></i> Dash</td>
                          <td class="text-success">-0.000242 BTC</td>
                          <td>0.02%</td>
                          <td>
                            <strong> 0.25484 LTC</strong>
                          </td>
                        </tr>
                        <tr>
                          <td>523640</td>
                          <td>January 15</td>
                          <td>
                            <span class="success-arrow"><i class="icofont-arrow-up"></i>Buy</span>
                          </td>
                          <td class="coin-name">
                            <i class="cc LTC"></i>
                            Litecoin
                          </td>
                          <td class="text-success">-0.000242 BTC</td>
                          <td>0.02%</td>
                          <td>
                            <strong> 0.25484 LTC</strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import BalanceChart from "../components/BalanceChart.vue";
// import AnalyticsChart from "../../components/qCash/home/AnalyticsChart.vue";
import CurrencyChart from "../components/CurrencyChart.vue";
import Layout from "../components/Layout.vue";
import { createToaster } from "@meforma/vue-toaster";
// import { PerfectScrollbar } from "vue3-perfect-scrollbar";

export default {
  components: {
    Layout,
    CurrencyChart,
    BalanceChart,
    // AnalyticsChart,
    // PerfectScrollbar,
  },
  data() {
    return {
      message: "https://play.hexlink.io/join/12345",
    };
  },
  methods: {
    doCopy: function () {
      this.$copyText(this.message).then(
        function () {
          // alert("Copied");
          const toaster = createToaster({ position: "top", duration: 2000});
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
};
</script>