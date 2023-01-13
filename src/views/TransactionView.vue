<style lang="less" scoped>
.content-body {
  margin-left: 9.5rem; }
@media only screen and (max-width: 990px) {
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
.card>hr {
  margin-right: 0;
  margin-left: 0; } 
.card>.list-group {
  border-top: inherit;
  border-bottom: inherit; }
.card>.list-group:first-child {
  border-top-width: 0;
  border-top-left-radius: calc(0.25rem - 1px);
  border-top-right-radius: calc(0.25rem - 1px); }
.card>.list-group:last-child {
  border-bottom-width: 0;
  border-bottom-right-radius: calc(0.25rem - 1px);
  border-bottom-left-radius: calc(0.25rem - 1px); }
.card>.card-header+.list-group,
.card>.list-group+.card-footer {
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
  border-radius: 1rem;
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

.dashboard-header {
  flex: 1;
  display: inline-block;
  width: 100%;
  background-color: var(--white);
  border-radius: var(--radius-large);
  border: 1px solid var(--fade-grey-dark-3);
  transition: all .3s;
  display: flex;
  align-items: center;
  padding: 20px; }
  .dashboard-header .profile-pic {
    position: relative;
    display: inline-block;
    vertical-align: bottom;
    max-width: 80px;
    min-width: 80px;
    max-height: 80px; }
    .dashboard-header .profile-pic img {
      border-radius: 50px;
      height: 80px;
      width: 80px;
    }
  .dashboard-header .welcome {
    padding: 0 2rem; }
    .dashboard-header .welcome .title {
      font-size: 1rem;
      margin-bottom: 0;
      font-weight: 500; }
    .dashboard-header .welcome .sub-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
      padding: 0;
      color: black; }
  .dashboard-header .user-balance {
    padding: 0 2rem; }
    .dashboard-header .user-balance .title {
      font-size: 1rem;
      margin-bottom: 0;
      font-weight: 500; }
    .dashboard-header .user-balance .sub-title {
      font-size: 2rem;
      font-weight: 600;
      margin: 0;
      padding: 0;
      color: black; }
.cta {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 23px;
  height: 23px;
  margin-left: 20px;
  background: white;
  border-radius: 6px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
  @media only screen and (max-width: 767px) {
    margin-left: 0;
  } }
  .cta .cta-title {
    display: flex; }
    .cta .cta-title svg {
      width: 15px;
      opacity: .8; }
    .cta .cta-title .white-text {
      color: #fff;
      line-height: 1.5;
      font-size: 1em;
      font-weight: 300;
      margin: 0;
      padding: 0; }
  .cta .cta-link {
    display: block;
    font-weight: 500;
    margin-top: 0.5rem;
    cursor: pointer;
    text-decoration: none;
    line-height: 1.5;
    font-size: 1em;
    color: hsl(0 0% 99%); }
.token-list {
  display: grid;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  @media (min-width: 640px) {
    display: flex; } }
  .token-list .title {
    display: grid;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.75rem;
  
    @media (min-width: 640px) {
      display: flex; } }
    .token-list .title .title-col {
      display: flex; 
      justify-content: space-between; 
      grid-column: span 4 / span 4; }
      .token-list .title .title-col .content {
        display: flex;
        margin-left: 0.75rem;
        margin-left: 0.875rem;
        align-items: center; }
        .token-list .title .title-col .content .text {
          font-size: 1.25rem;
          line-height: 1.75rem;
          font-weight: 600; }
        .token-list .title .title-col .content svg {
          display: inline-flex;
          transition-property: background-color, border-color, color, fill, stroke;
          justify-content: center;
          align-items: center;
          width: 1rem;
          height: 1rem;
          margin-left: 0.75rem; }
  .token-list .views {
    margin-top: 0.75rem;
    grid-column: span 4 / span 4;
  
    @media (min-width: 640px) {
      display: flex;
      margin-top: 0; } }
    .token-list .views .detail-view {
      display: flex;
      padding: 0.125rem;
      transition-property: background-color, border-color, color, fill, stroke;
      border-radius: 50px;
      border-style: solid;
      border-width: 1px;
      border-color: rgb(71, 85, 105);
    
      @media (min-width: 640px) {
        margin-left: 0.75rem;
        margin-left: 0.875rem;
        max-width: 28rem; } }
      .token-list .views .detail-view button {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        padding-left: 0.75rem;
        padding-right: 0.75rem;
        color: #000;
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 800;
        line-height: 1.25rem;
        width: 50%;
        border-radius: 50px;
        @media (min-width: 640px) {
          padding-left: 1.5rem;
          padding-right: 1.5rem;
          width: 150px; }
        @media (min-width: 768px) {
          padding-left: 1.5rem;
          padding-right: 1.5rem;
          width: 150px; } }
      .token-list .views .detail-view .listView-button {
        opacity: 1;
        background-color: rgba(7, 106, 224,0);
        color: rgb(71, 85, 105); }
      .token-list .views .detail-view .listView-button.show {
        opacity: 1;
        background-color: rgb(7, 106, 224);
        color: white; }
.account-setup {
  display: flex;
  flex-direction: row;
  justify-content: space-between; }
  .account-setup h4 {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    margin-left: 0.875rem; }
    .account-setup .icon-grey {
      color: #076AE0;
    }
  .account-setup .cta-button {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 800;
    line-height: 1.25rem;
    width: 100px;
    border-radius: 50px;
    opacity: 1;
    background-color: rgb(7, 106, 224);
    color: white; }
img,
svg {
  vertical-align: middle; }
.invite-content .input-group-text {
  background: #556ee6;
  color: #fff; }
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
.info {
  display: none; }
.transaction-history {
  padding-bottom: 0.5rem;
  padding-top: 0.5rem;
  border-radius: 1rem; }
.transaction-box {
  position: relative; }
  .transaction-box .transaction-date {
    top: 0;
    font-weight: 500;
    font-size: .875rem;
    line-height: 1.25rem;
    padding-bottom: 1rem;
    padding-top: 1rem; }
    .transaction-box .transaction-date .date-text {
      font-size: .875rem;
      line-height: 1.25rem;
      color: #6a6d7c; }
  .transaction-box .transaction-details {
    position: relative;
    border-top: 1px solid rgb(226 232 240);
    border-bottom: 1px solid rgb(226 232 240); }
    .transaction-box .transaction-details .record {
      padding-bottom: 1rem;
      padding-top: 1rem;
      margin-left: -0.5rem;
      margin-right: -0.5rem;
      cursor: pointer;
      @media (min-width: 640px) {
        padding-left: 1.5rem;
        padding-right: 1.5rem; } }
    .transaction-box .transaction-details .record:hover {
      background: #e5e7eb; }
      .transaction-box .transaction-details .record .record-info {
        display: flex;
        align-items: center; }
        .transaction-box .transaction-details .record .record-info .action {
          display: none;
          position: relative;
          @media (min-width: 640px) {
            display: block; } }
          .transaction-box .transaction-details .record .record-info .action .action-chain {
            display: flex;
            align-items: center;
            justify-content: center;
            top: -0.25rem;
            left: -0.25rem;
            width: 1rem;
            height: 1rem;
            border-radius: 50px;
            object-fit: cover;
            position: absolute;
            box-shadow: 0 0 0 1px rgb(241 245 249); }
            .transaction-box .transaction-details .record .record-info .action .action-chain img {
              height: 1rem; }
          .transaction-box .transaction-details .record .record-info .action .action-itself {
            border-radius: 50px;
            background-color: #ecedef;
            border: 1px solid #d9d9d9;
            display: flex;
            width: 2rem;
            height: 2rem;
            align-items: center;
            justify-content: center; }
            .transaction-box .transaction-details .record .record-info .action .action-itself svg {
              display: block;
              vertical-align: middle;
              height: 1rem;
              width: 1rem;
              color: #6a6d7c; }
        .transaction-box .transaction-details .record .record-info .display-info {
          overflow-y: visible;
          overflow-x: auto;
          white-space: nowrap;
          text-overflow: ellipsis;
          flex-wrap: wrap;
          flex: 1 1;
          width: 100%;
          gap: 1rem;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          align-items: center;
          @media (min-width: 640px) {
            padding-left: 1rem;
            overflow-x: visible; }
          @media (min-width: 768px) {
            display: flex; }
          @media (min-width: 1024px) {
            display: grid;
            gap: 1.25rem; }
          @media (min-width: 1280px) {
            gap: 1.5rem; } }
          .transaction-box .transaction-details .record .record-info .display-info .action-detail {
            display: flex;
            align-items: center;
            margin-bottom: 0.25rem;
            grid-column: span 4/span 4;
            @media (min-width: 1280px) {
              grid-column: span 3/span 3; }
            @media (min-width: 640px) {
              margin-bottom: 0;} }
            .transaction-box .transaction-details .record .record-info .display-info .action-detail .text {
              display: flex;
              margin-bottom: 0.25rem;
              @media (min-width: 768px) {
                display: block; }
              @media (min-width: 640px) {
                margin-bottom: 0; } }
              .transaction-box .transaction-details .record .record-info .display-info .action-detail .text .top {
                display: flex; }
                .transaction-box .transaction-details .record .record-info .display-info .action-detail .text .top .mobile {
                  display: flex;
                  align-items: center;
                  padding-right: 0.5rem;
                  @media (min-width: 1280px) {
                    display: none; } }
                  .transaction-box .transaction-details .record .record-info .display-info .action-detail .text .top .mobile canvas {
                    display: block;
                    vertical-align: middle;
                    border-radius: 50px;
                    flex-shrink: 0;
                    box-shadow: 0 0 0 1px rgb(241 245 249); }
                  .transaction-box .transaction-details .record .record-info .display-info .action-detail .text .top .mobile image {
                    display: block;
                    width: 1rem;
                    height: 1rem;
                    border-radius: 50px;
                    object-fit: cover;
                    box-shadow: 0 0 0 1px rgb(241 245 249);
                    transition-property: transform;
                    @media (min-width: 640px) {
                      display: none; } }
                .transaction-box .transaction-details .record .record-info .display-info .action-detail .text .top .desktop {
                  font-weight: 600;
                  white-space: nowrap;
                  flex-shrink: 1; }
                  .transaction-box .transaction-details .record .record-info .display-info .action-detail .text .top .desktop span {
                    margin-left: 0.25rem;
                    font-weight: 400;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    color: #6a6d7c;
                    display: none;
                    @media (min-width: 640px) {
                      display: inline-flex; } }
              .transaction-box .transaction-details .record .record-info .display-info .action-detail .text .time {
                margin-left: 1rem;
                white-space: nowrap;
                color: #6a6d7c;
                @media (min-width: 640px) {
                  margin-left: 0; } }
                .transaction-box .transaction-details .record .record-info .display-info .action-detail .text .time .time-text {
                  display: flex; }
.account {
  overflow: visible;
  justify-content: flex-start;
  align-items: center;
  grid-column: span 3/span 3;
  display: none;
  @media (min-width: 1536px) {
    grid-column: span 2/span 2; }
  @media (min-width: 1280px) {
    display: flex; } }
  .account .group {
    position: relative; }
  .account .group .account-details {
    display: flex;
    align-items: center;
    background-color: rgb(241 245 249);
    border-radius: 50px;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-bottom: 0.5rem;
    padding-top: 0.5rem;
    font-weight: 500; }
    .account .group .account-details .text-sm {
      font-size: .875rem;
      line-height: 1.25rem; }
  .account .group .account-hidden {
    display: none; }
    .account .group .account-hidden .hidden-content {
      display: flex;
      align-items: center;
      position: absolute;
      left: 50%;
      z-index: 10;
      transform: translateX(-50%);
      border-radius: 0.375rem;
      padding: 1rem;
      background-color: #fff;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
      .account .group .account-hidden .hidden-content .hidden-text {
        font-size: .875rem;
        line-height: 1.25rem;
        margin-left: 0.75rem; }
        .account .group .account-hidden .hidden-content .hidden-text .text1 {
          display: flex;
          align-items: center;
          font-weight: 500;
          white-space: nowrap; }
        .account .group .account-hidden .hidden-content .hidden-text .text2 {
          font-size: .875rem;
          line-height: 1.25rem; }
.transaction-action-details {
  grid-column: span 7/span 7;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  @media (min-width: 640px) {
    display: flex;
    flex: 1 1; }
  @media (min-width: 1280px) {
    grid-column: span 5/span 5; } }
  .transaction-action-details .details {
    display: flex;
    align-items: center;
    @media (min-width: 640px) {
      flex: 1 1;
      justify-content: flex-start; } }
    .transaction-action-details .details .from {
      display: flex;
      align-items: center; }
      .transaction-action-details .details .from canvas {
        height: 2rem;
        width: 2rem;
        border-radius: 50px;
        flex-shrink: 0;
        @media (min-width: 640px) {
          width: 2.5rem;
          height: 2.5rem; } }
      .transaction-action-details .details .from .text-info {
        display: flex;
        flex-direction: column;
        min-width: 0;
        margin-left: 0.75rem; }
        .transaction-action-details .details .from .text-info .info1 {
          color: rgb(15,23,42);
          font-weight: 500;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis; }
        .transaction-action-details .details .from .text-info .info2 {
          color: rgb(100,116,139);
          font-size: .875rem;
          line-height: 1.25rem; }
    .transaction-action-details .details .sign {
      margin-left: 0.25rem;
      margin-right: 0.25rem;
      font-size: .875rem;
      line-height: 1.25rem;
      margin-left: 1rem;
      @media (min-width: 640px) {
        margin-left: 0.5rem;
        margin-right: 0.5rem; } }
    .transaction-action-details .details .to {
      display: flex;
      align-items: center;
      overflow-y: visible;
      overflow-x: hidden;
      margin-left: 1rem;
      @media (min-width: 640px) {
        overflow-x: visible; } }
      .transaction-action-details .details .to .text-top {
        display: flex;
        font-weight: 500;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #0d8838;
        @media (min-width: 415px) {
          text-overflow: clip; } }
      .transaction-action-details .details .to .text-bottom {
        font-size: .875rem;
        line-height: 1.25rem;
        color: rgb(100,116,139);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 7rem;
        @media (min-width: 640px) {
          max-width: 10rem; } }
      .transaction-action-details .details .to .hidden {
        visibility: hidden;
        overflow: visible;
        margin-left: 0.75rem; }
        .transaction-action-details .details .to .hidden .hidden-content {
          position: absolute;
          margin: auto;
          margin-top: -0.75rem;
          margin-bottom: 0; }
</style>
<template>
  <layout :active="1">
    <div class="content-body">
      <div class="container">
        <h1 style="margin-bottom: 1rem;">Transactions</h1>
        <div class="row" style="padding-top: 16px;">
          <div className="row invoice-card-row">
            <div class="col-xxl-6">
              <div class="card">
                <div class="card-body">
                  <div class="token-list">
                    <div class="title">
                      <div class="title-col">
                        <div class="content">
                          <div class="text">History</div>
                          <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 9C2.55228 9 3 8.55228 3 8C3 7.44772 2.55228 7 2 7C1.44772 7 1 7.44772 1 8C1 8.55228 1.44772 9 2 9Z"
                              fill="black" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M2 3C2.55228 3 3 2.55228 3 2C3 1.44772 2.55228 1 2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3Z"
                              fill="black" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                              d="M2 15C2.55228 15 3 14.5523 3 14C3 13.4477 2.55228 13 2 13C1.44772 13 1 13.4477 1 14C1 14.5523 1.44772 15 2 15Z"
                              fill="black" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="views">
                      <div class="detail-view">
                        <button class="listView-button" @click="completed = false; pending = false; canceled = false; all = true" :class="all && 'show'">All</button>
                        <button class="listView-button" @click="all = false; pending = false; canceled = false; completed = true" :class="completed && 'show'">Completed</button>
                        <button class="listView-button" @click="all = false; completed = false; canceled = false; pending = true" :class="pending && 'show'">Pending</button>
                        <button class="listView-button" @click="all = false; completed = false; pending = false; canceled = true" :class="canceled && 'show'">Canceled</button>
                      </div>
                    </div>
                  </div>
                  <div class="transaction-history">
                    <div>
                      <div class="transaction-box">
                        <div class="transaction-date">
                          <div class="date-text">December 21, 2022</div>
                        </div>
                        <div class="transaction-details">
                          <div class="record">
                            <div class="record-info">
                              <div class="action">
                                <div class="action-chain">
                                  <!-- ethereum logo -->
                                  <img src="https://token.metaswap.codefi.network/assets/networkLogos/ethereum.svg"/>
                                </div>
                                <div class="action-itself">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-subdued">
                                    <line x1="7" y1="17" x2="17" y2="7"></line>
                                    <polyline points="7 7 17 7 17 17"></polyline>
                                  </svg>
                                </div>
                              </div>
                              <div class="display-info">
                                <div class="action-detail">
                                  <div class="text">
                                    <div class="top">
                                      <div class="mobile">
                                        <canvas width="16" height="16" style="width: 16px; height: 16px;"></canvas>
                                        <img src="https://token.metaswap.codefi.network/assets/networkLogos/ethereum.svg" alt="">
                                      </div>
                                      <div class="desktop">
                                        Receive
                                        <span></span>
                                      </div>
                                    </div>
                                    <div class="time">
                                      <div class="time-text">11:56 pm</div>
                                    </div>
                                  </div>
                                </div>
                                <div class="account">
                                  <div class="group">
                                    <div class="account-details">
                                      <div>
                                        <canvas width="24" height="24" style="width: 24px; height: 24px; border-radius: 50px; flex-shrink: 0;"></canvas>
                                      </div>
                                      <div class="text-sm">0x271...fed9</div>
                                    </div>
                                    <div class="account-hidden">
                                      <div class="hidden-content">
                                        <div>
                                          <canvas width="24" height="24" style="width: 24px; height: 24px; display: block; vertical-align: middle; flex-shrink: 0; border-radius: 50px;"></canvas>
                                        </div>
                                        <div class="hidden-text">
                                          <div class="text1">
                                            <div>0x271...fed9</div>
                                            <div>
                                              <a href="https://etherscan.io/address/0x271f70ed8b8154010d06ce809d78f8a2665efed9" target="_blank" style="padding: 0.25rem; border-radius: 50px; display: flex; ">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1rem; height: 1rem; color: #6a6d7c;">
                                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                  <polyline points="15 3 21 3 21 9"></polyline>
                                                  <line x1="10" y1="14" x2="21" y2="3"></line>
                                                </svg>
                                              </a>
                                            </div>
                                          </div>
                                          <div class="text2">0x271f70ed8b8154010d06ce809d78f8a2665efed9</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="transaction-action-details">
                                  <div class="details">
                                    <div class="from">
                                      <canvas width="32" height="32" style="width: 32px; height: 32px;"></canvas>
                                      <span class="text-info">
                                        <span class="info1">From</span>
                                        <span class="info2">0xa3f5...5e679e</span>
                                      </span>
                                    </div>
                                    <div class="sign">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                      </svg>
                                    </div>
                                    <div class="to">
                                      <div style="position: relative;">
                                        <img src="https://token.metaswap.codefi.network/assets/networkLogos/ethereum.svg" style="height: 2rem; width: 2rem; min-width: 2rem; object-fit: cover; border-radius: 50px;"/>
                                      </div>
                                      <div style="margin-left: 0.75rem;">
                                        <div class="text-top">
                                          <div>
                                            <span>+</span>
                                            0.030
                                            <span style="margin-left: 0.25rem;">ETH</span>
                                          </div>
                                          <div></div>
                                        </div>
                                        <div class="text-bottom">
                                          <span>ETH</span>
                                        </div>
                                      </div>
                                      <div class="hidden">
                                        <div class="hidden-content">
                                          <button class="inline-flex justify-center items-center w-6 h-6 text-slate-500 dark:text-slate-400 transition-colors"
                                            data-tip="true" data-for="token-more-1-0x0000000000000000000000000000000000000000"><svg
                                              xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                                              <circle cx="12" cy="12" r="1"></circle>
                                              <circle cx="12" cy="5" r="1"></circle>
                                              <circle cx="12" cy="19" r="1"></circle>
                                            </svg>
                                            <div id="token-more-1-0x0000000000000000000000000000000000000000-hidden"></div>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="more-details"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { isContract } from "@/web3/account";
import Layout from "../components/Layout.vue";
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from "@/stores/profile";
import { BigNumber } from "bignumber.js";

const profile = useProfileStore().profile;
const isDeployed = ref<boolean>(true);
const loading = ref<boolean>(true);
const tokens = profile.tokens;
const all = ref<boolean>(true);
const completed = ref<boolean>(false);
const pending = ref<boolean>(false);
const canceled = ref<boolean>(false);

onMounted(async () => {
  const auth = useAuthStore();
  const accountAddress = profile.account?.address;
  isDeployed.value = await isContract(accountAddress);
  loading.value = false;
});

const visiableTokens = computed(() => {
  return Object.values(tokens.value).filter(t => t.preference?.display || false);
});

const totalAssets = computed(() => {
  let total: BigNumber = BigNumber(0);
  for (const token of visiableTokens.value) {
    if (token.balance && token.price) {
      total = total.plus(token.balance.normalized.times(token.price));
    }
  }
  // return total.plus(BigNumber(dynamicBalance.value));
  return total;
});

const dynamicBalance = computed(() => {
  return BigNumber(Math.floor(Math.random() * 100));
});
</script>