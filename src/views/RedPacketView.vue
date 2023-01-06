<style lang="less" scoped>
.content-body {
  margin-left: 9.5rem; }
@media only screen and (max-width: 990px) {
  .content-body {
    margin-left: 0px;
    margin-bottom: 50px; } }
.wallet-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem; }
.connect-wallet-button {
  display: flex;
  justify-content: center;
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
    width: 200px; }
  @media (min-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    width: 200px; }
  opacity: 1;
  background-color: rgb(7, 106, 224);
  color: white; }
.connection-status {
  display: flex; 
  p {
    margin-right: 1rem;
    margin-bottom: 0rem; }}
.checkmark {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px #7ac142;
  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both; }
.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #7ac142;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
.checkmark__check .animateElement {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards; }
@keyframes stroke {
  100% {
    stroke-dashoffset: 0; } }
@keyframes scale {
  0%, 100% {
    transform: none; }
  50% {
    transform: scale3d(1.1, 1.1, 1); } }
@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 30px #7ac142; } }
.crossmark {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  stroke-width: 2;
  stroke: #ff0000;
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px #ff0000;
  animation: fillred .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both; }
.crossmark__circle.animateElement {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #ff0000;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
.cross__path {
  stroke: #ffffff;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  transform-origin: 50% 50% 0; }
.cross__path--right {
  animation: 0.3s ease 0.8s normal forwards 1 running stroke; }
.cross__path--left {
  animation: 1s ease 0.8s normal forwards 1 running stroke; }
@keyframes fillred {
  100% {
    box-shadow: inset 0px 0px 0px 30px #ff0000; } }
@keyframes stroke {
  100% {
    stroke-dashoffset: 0; } }
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  height: calc(100% - 30px);
  margin-bottom: 1.875rem;
  transition: all .5s ease-in-out;
  border: 0px solid transparent;
  border-radius: 1rem;
  box-shadow: 0px 5px 5px 0px rgba(82, 63, 105, 0.05); }
.card-body {
  flex: 1 1 auto;
  padding: 20px;
  background: transparent;
  border-radius: 15px; }
@media only screen and (max-width: 575px) {
  .card {
    margin-bottom: 0.938rem;
    height: calc(100% - 0.938rem); }
  .card-body {
    padding: 1rem; } }
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
.red-packet {
  visibility: visible;
  height: auto;
  display: block;
  padding: 0px; }
.red-packet .mode-and-share {
display: flex;
gap: 16px;
margin: 16px; }
.red-packet .mode-and-share .game-mode {
  display: block;
  flex: 1 1 0%;
  p {
    margin: 0px;
    font-weight: 400;
    line-height: 1.5;
    font-size: 14px; } }
.mode-dropdown {
  flex: 1 1 0%;
  font-weight: 400;
  line-height: 1.4375em;
  color: rgb(7, 16, 27);
  box-sizing: border-box;
  position: relative;
  cursor: text;
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  border-radius: 8px;
  background-color: rgb(242, 246, 250);
  font-size: 14px;
  overflow: unset !important; }
.mode-dropdown::before {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border: 2px solid #333;
  border-top: 2px solid rgb(242, 246, 250);
  border-right: 2px solid rgb(242, 246, 250);
  transform: rotate(-45deg);
  right: 20px;
  top: 15px;
  z-index: 10000;
  transition: 0.5s;
  pointer-events: none; }
.mode-dropdown.active::before {
  top: 22px;
  transform: rotate(-225deg); }
.mode-text {
  padding-right: 32px;
  padding: 11px 12px;
  height: 18px;
  min-height: unset;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  appearance: none;
  user-select: none;
  border-radius: 15px;
  cursor: pointer;
  // padding: 4px 0px 5px;
  border: 0px;
  box-sizing: content-box;
  background: none;
  margin: 0px;
  -webkit-tap-highlight-color: transparent;
  display: block;
  min-width: 0px;
  width: 100%; }
.mode-input {
  bottom: 0px;
  left: 0px;
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 100%;
  box-sizing: border-box; }
.mode-drop-tri {
  font-size: 0px;
  display: inline-block;
  background-repeat: no-repeat;
  background-position: center center;
  flex-shrink: 0;
  aspect-ratio: 1 / 1;
  position: absolute;
  right: 7px;
  pointer-events: none;
  width: 22.5px;
  height: 22.5px;
  top: calc(50% - 11.25px);
  color: rgb(118, 127, 141);
  font-weight: 400;
  line-height: 1.4375em;
  cursor: text; }
.share-input-div {
  flex: 1 1 0%;
  font-weight: 400;
  line-height: 1.4375em;
  color: rgb(7, 16, 27);
  box-sizing: border-box;
  position: relative;
  cursor: text;
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  border-radius: 8px;
  background-color: rgb(242, 246, 250);
  font-size: 14px;
  overflow: unset !important; }
.red-packet .mode-and-share .share-number {
  display: block;
  flex: 1 1 0%; 
  p {
    margin: 0px;
    font-weight: 400;
    line-height: 1.5;
    font-size: 14px; } }
.shares-input {
  padding: 11px 12px;
  height: 18px;
  border: 0px;
  box-sizing: content-box;
  background: none;
  margin: 0px;
  -webkit-tap-highlight-color: transparent;
  display: block;
  min-width: 0px;
  width: 100%; }
.red-packet .total-amount {
  display: flex;
  gap: 16px;
  margin: 16px; }
.red-packet .total-amount .box {
  position: relative;
  padding: 10px 12px;
  padding-right: 12px;
  padding-left: 12px;
  font-weight: 400;
  line-height: 1.4375em;
  color: rgb(7, 16, 27);
  box-sizing: border-box;
  cursor: text;
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  border-radius: 8px;
  background-color: rgb(242, 246, 250);
  font-size: 14px;
  overflow: unset !important; }
.total-amount-text {
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  color: rgb(118, 127, 141);
  white-space: nowrap;
  margin-bottom: 0rem;
  position: absolute;
  top: 10px;
  left: 12px; }
.red-packet .total-amount .box .amount-input {
  flex: 2 1 0%;
  font-size: 18px;
  font-weight: 700;
  padding-top: 22px !important;
  padding-bottom: 0px !important;
  padding-left: 0px !important;
  padding: 11px 12px;
  height: 18px;
  border: 0px;
  box-sizing: content-box;
  background: none;
  margin: 0px;
  -webkit-tap-highlight-color: transparent;
  display: block;
  min-width: 0px;
  width: 100%; }
.red-packet .total-amount .box .input-info-show {
  display: flex;
  flex: 1 1 0%;
  height: 100%;
  flex-direction: column;
  align-items: flex-end;
  row-gap: 4px; 
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4375em;
  color: rgb(7, 16, 27);
  cursor: text; 
  .available-balance {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    font-size: 13px;
    line-height: 18px;
    color: rgb(118, 127, 141);
    white-space: nowrap;
    margin: 0px;
    font-weight: 400;
    span {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      color: rgb(7, 16, 27);
      line-height: 18px;
      font-weight: 700;
      margin-left: 4px;
      margin: 0px;
      font-size: 14px; } }
    .total-choose-token {
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      font-size: 14px;
      column-gap: 12px;
      font-weight: 400;
      line-height: 1.4375em;
      color: rgb(7, 16, 27);
      cursor: text;
      .max-amount-button {
        position: relative;
        margin: 0px;
        appearance: none;
        max-width: 100%;
        background-color: rgba(28, 104, 243, 0.1);
        color: rgb(28, 104, 243);
        border-radius: 4px;
        font-size: 14px;
        line-height: 18px;
        padding: 3px 12px;
        cursor: pointer;
        display: inline-flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        height: 24px;
        white-space: nowrap;
        transition: background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        outline: 0px;
        text-decoration: none;
        border: 0px;
        vertical-align: middle;
        box-sizing: border-box;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        .button-text {
          padding: 0px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: rgb(28, 104, 243);
          font-size: 14px;
          line-height: 18px;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          font-weight: 400; }
        .button-outline {
          overflow: hidden;
          pointer-events: none;
          position: absolute;
          z-index: 0;
          inset: 0px;
          color: rgb(28, 104, 243);
          font-size: 14px;
          line-height: 18px;
          cursor: pointer;
          white-space: nowrap;
          user-select: none;
          -webkit-tap-highlight-color: transparent; } } } }
.token-select {
  position: relative;
  margin: 0px;
  appearance: none;
  max-width: 100%;
  font-family: -apple-system, system-ui, sans-serif;
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  height: 24px;
  border-radius: 16px;
  white-space: nowrap;
  transition: background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  outline: 0px;
  text-decoration: none;
  border: 0px;
  padding: 0px;
  vertical-align: middle;
  box-sizing: border-box;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  .token-icon {
    margin-left: 4px;
    font-size: 18px;
    margin-top: 0px;
    margin-bottom: 0px;
    border-radius: 50%;
    background-size: cover;
    width: 20px;
    height: 20px;
    color: rgb(7, 16, 27) !important;
    margin-right: 0px !important;
    position: relative;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    flex-shrink: 0;
    line-height: 1;
    overflow: hidden;
    user-select: none;
    background-color: rgb(255, 255, 255);
    font-weight: 700; }
  .token-name {
    overflow: hidden;
    text-overflow: ellipsis;
    padding-left: 8px;
    padding-right: 8px;
    white-space: nowrap;
    cursor: pointer;
    font-size: 14px;
    line-height: 18px;
    font-weight: 700;
    color: rgb(7, 16, 27);
    user-select: none;
    -webkit-tap-highlight-color: transparent; }
  .token-dropdown {
    -webkit-tap-highlight-color: transparent;
    font-size: 16px;
    cursor: pointer;
    margin: 0px 4px 0px -4px;
    color: rgb(118, 127, 141) !important;
    display: inline-block;
    background-repeat: no-repeat;
    background-position: center center;
    flex-shrink: 0;
    aspect-ratio: 1 / 1;
    height: 24px;
    width: 24px;
    line-height: 18px;
    font-weight: 700;
    user-select: none; } }
input:focus {
  outline: none; }
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;}
/* Firefox */
input[type=number] {
  -moz-appearance: textfield; }
.mode-options {
  position: absolute;
  top: 50px;
  width: 100%;
  background: #fff;
  box-shadow: 0 30px 30px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  overflow: hidden;
  display: none; }
.mode-dropdown.active .mode-options{
  display: block;
  z-index: 50; }
.mode-dropdown .mode-options div {
  padding: 12px 20px;
  cursor: pointer; }
.mode-dropdown .mode-options div:hover {
  background: rgb(242, 246, 250);
  color: #999; }
.token-wallet-icon {
  margin-left: 4px;
  font-size: 18px;
  margin-top: 0px;
  margin-bottom: 0px;
  background-size: cover;
  width: 20px;
  height: 20px;
  color: rgb(7, 16, 27) !important;
  margin-right: 0px !important;
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 1;
  overflow: hidden;
  user-select: none;
  background-color: rgb(255, 255, 255);
  font-weight: 700; }
.red-packet-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px; }
.red-packet-button p {
  margin-bottom: 0; }
.submit-redPacket-grey {
  display: flex;
  justify-content: center;
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
    width: 200px; }
  @media (min-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    width: 200px; }
  opacity: 1;
  background-color: #999;
  color: white; }
.submit-redPacket-blue {
  display: flex;
  justify-content: center;
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
    width: 200px; }
  @media (min-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    width: 200px; }
  opacity: 1;
  background-color: rgb(7, 106, 224);
  color: white; }
.red-packet-model {
  margin: 16px;
}
</style>

<template>
  <layout :active="1">
    <h1 style="margin-bottom: 1rem;">Red Packet</h1>
    <div class="row">
      <div className="row invoice-card-row">
        <div class="col-xxl-6">
          <div class="card">
            <div class="card-body">
              <div class="token-list">
                <div class="title">
                  <div class="title-col">
                    <div class="content">
                      <div class="text">Put Luck in the packet</div>
                      <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M2 9C2.55228 9 3 8.55228 3 8C3 7.44772 2.55228 7 2 7C1.44772 7 1 7.44772 1 8C1 8.55228 1.44772 9 2 9Z"
                          fill="black" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                          d="M2 3C2.55228 3 3 2.55228 3 2C3 1.44772 2.55228 1 2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3Z"
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
                    <button class="listView-button" @click="sendLuck = true; luckHistory = false"
                      :class="sendLuck && 'show'">Send Luck</button>
                    <button class="listView-button" @click="luckHistory = true; sendLuck = false"
                      :class="luckHistory && 'show'">Luck History</button>
                  </div>
                </div>
              </div>
              <div class="red-packet">
                <div class="mode-and-share">
                  <div class="game-mode">
                    <p>Split Mode</p>
                    <div class="mode-dropdown" :class="openDropdown && 'active'" @click="openDropdown = !openDropdown;">
                      <div class="mode-text">{{ mode }}</div>
                      <input class="mode-input" type="text" placeholder="select" readonly>
                      <div class="mode-options">
                        <div @click="modeChoose('Random')">Random</div>
                        <div @click="modeChoose('Average')">Average</div>
                      </div>
                      <!-- <span class="mode-drop-tri">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                  <path fill="currentColor"
                                    d="m11.434 15.434-5.068-5.068A.8.8 0 0 1 6.93 9h10.14a.8.8 0 0 1 .565 1.366l-5.068 5.068a.8.8 0 0 1-1.132 0Z">
                                  </path>
                                </svg>
                              </span> -->
                    </div>
                  </div>
                  <div class="share-number">
                    <p>Quantity</p>
                    <div class="share-input-div">
                      <input v-model="quantity" id="red-packet-share" class="shares-input" autocomplete="off"
                        placeholder="0" type="number" autocorrect="off" inputmode="decimal" pattern="^[0-9]$"
                        spellcheck="false">
                    </div>
                  </div>
                </div>
                <div class="total-amount">
                  <div class="box">
                    <p class="total-amount-text">Total Amount</p>
                    <input v-model="total_amount" id="red-packet-amount" class="amount-input" autocomplete="off"
                      placeholder="0.0" required="true" type="number" autocorrect="off" title="Token Amount"
                      inputmode="decimal" min="0" minlength="1" maxlength="79" pattern="^[0-9]*[.,]?[0-9]*$"
                      spellcheck="false">
                    <div class="input-info-show">
                      <div class="token-select">
                        <div class="token-wallet-icon">
                          <img style="width: 20px; height: 20px;" v-bind:src="walletIcon">
                        </div>
                        <span class="token-name">{{ wallet }}</span>
                        <span class="token-dropdown">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill="currentColor"
                              d="m11.434 15.434-5.068-5.068A.8.8 0 0 1 6.93 9h10.14a.8.8 0 0 1 .565 1.366l-5.068 5.068a.8.8 0 0 1-1.132 0Z">
                            </path>
                          </svg>
                        </span>
                      </div>
                      <div class="total-choose-token">
                        <div class="max-amount-button">
                          <span class="button-text">MAX</span>
                          <span class="button-outline"></span>
                        </div>
                        <div class="token-select">
                          <div class="token-icon">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
                                fill="#627EEA" />
                              <path d="M16.1069 7L16 7.39592V18.8837L16.1069 19L21 15.848L16.1069 7Z" fill="#C0CBF6" />
                              <path d="M16 7L11 15.848L16 19V13.4241V7Z" fill="white" />
                              <path d="M16.0608 20.354L16 20.4392V24.7958L16.0608 25L21 17L16.0608 20.354Z"
                                fill="#C0CBF6" />
                              <path d="M16 25V20.354L11 17L16 25Z" fill="white" />
                              <path d="M16 19L21 16.1735L16 14V19Z" fill="#8197EE" />
                              <path d="M11 16.1735L16 19V14L11 16.1735Z" fill="#C0CBF6" />
                            </svg>
                          </div>
                          <span class="token-name">ETH</span>
                          <span class="token-dropdown">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                              <path fill="currentColor"
                                d="m11.434 15.434-5.068-5.068A.8.8 0 0 1 6.93 9h10.14a.8.8 0 0 1 .565 1.366l-5.068 5.068a.8.8 0 0 1-1.132 0Z">
                              </path>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="red-packet-button">
                <p>{{ inputReminder() }}</p>
                <button :class="checkInput() ? 'submit-redPacket-blue' : 'submit-redPacket-grey'"
                  @click="checkInput() && sendRedPacket()">
                  Next
                </button>
              </div>
              <div class="wallet-bar">
                <p v-if='account!=""' style="margin-bottom: 0rem; margin-left: 0.875rem;">
                  <img style="width: 25px; height: 25px; margin-right: 0.5rem;" v-bind:src="walletIcon">
                  <b>{{ wallet }}</b>
                </p>
                <p v-if='account==""' style="margin-bottom: 0rem; margin-left: 0.875rem;">Wallet: <b>No wallet</b></p>
                <p style="margin-bottom: 0rem; margin-left: 0.875rem;">Account: <b>{{ truncateAddress(account) }}</b></p>
                <p style="margin-bottom: 0rem;">Network ID: <b>{{ chainId>0 ? chainId : "No Network" }}</b></p>
                <p style="margin-bottom: 0rem;">Network: <b>{{ chainId > 0 ? networkName : "No Network" }}</b></p>
                <div class="connection-status">
                  <p>Connection Status:</p>
                  <svg v-if='account!=""' class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                    <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                  <svg v-if='account==""' class="crossmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="crossmark__circle" cx="26" cy="26" r="25" fill="none" />
                    <path class="cross__path cross__path--right" fill="none" d="M16,16 l20,20" />
                    <path class="cross__path cross__path--left" fill="none" d="M16,36 l20,-20" />
                  </svg>
                </div>
                <button v-if='account==""' class="connect-wallet-button" @click="connectWallet">
                  <svg style="margin-right: 10px;" width="18" height="18" viewBox="0 0 18 18" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M16 2.50025V3.51125C16.5304 3.51125 17.0391 3.72196 17.4142 4.09703C17.7893 4.47211 18 4.98081 18 5.51125V15.5112C18 16.0416 17.7893 16.5504 17.4142 16.9254C17.0391 17.3005 16.5304 17.5112 16 17.5112H2C1.46957 17.5112 0.96086 17.3005 0.58579 16.9254C0.21071 16.5504 0 16.0416 0 15.5112V5.51125C0 4.46625 0.835 3.51825 1.813 3.23925L12.813 0.0962511C13.1851 -0.0100989 13.5768 -0.0286089 13.9573 0.0421711C14.3377 0.112951 14.6966 0.271091 15.0055 0.504141C15.3145 0.737191 15.5651 1.03878 15.7377 1.38516C15.9102 1.73154 16 2.11326 16 2.50025ZM12.5 9.01123C12.1022 9.01123 11.7206 9.16933 11.4393 9.45063C11.158 9.73193 11 10.1134 11 10.5112C11 10.909 11.158 11.2906 11.4393 11.5719C11.7206 11.8532 12.1022 12.0112 12.5 12.0112C12.8978 12.0112 13.2794 11.8532 13.5607 11.5719C13.842 11.2906 14 10.909 14 10.5112C14 10.1134 13.842 9.73193 13.5607 9.45063C13.2794 9.16933 12.8978 9.01123 12.5 9.01123ZM14 2.50025C14.0001 2.42966 13.9852 2.35986 13.9563 2.29544C13.9274 2.23102 13.8853 2.17345 13.8326 2.1265C13.7798 2.07955 13.7178 2.04429 13.6505 2.02305C13.5832 2.00181 13.5121 1.99506 13.442 2.00325L13.362 2.01925L8.14 3.51125H14V2.50025Z"
                      fill="white" />
                  </svg>
                  Connect Wallet
                </button>
                <button v-if='account!=""' class="connect-wallet-button" @click="disconnect">
                  <svg style="margin-right: 10px;" width="18" height="18" viewBox="0 0 18 18" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M16 2.50025V3.51125C16.5304 3.51125 17.0391 3.72196 17.4142 4.09703C17.7893 4.47211 18 4.98081 18 5.51125V15.5112C18 16.0416 17.7893 16.5504 17.4142 16.9254C17.0391 17.3005 16.5304 17.5112 16 17.5112H2C1.46957 17.5112 0.96086 17.3005 0.58579 16.9254C0.21071 16.5504 0 16.0416 0 15.5112V5.51125C0 4.46625 0.835 3.51825 1.813 3.23925L12.813 0.0962511C13.1851 -0.0100989 13.5768 -0.0286089 13.9573 0.0421711C14.3377 0.112951 14.6966 0.271091 15.0055 0.504141C15.3145 0.737191 15.5651 1.03878 15.7377 1.38516C15.9102 1.73154 16 2.11326 16 2.50025ZM12.5 9.01123C12.1022 9.01123 11.7206 9.16933 11.4393 9.45063C11.158 9.73193 11 10.1134 11 10.5112C11 10.909 11.158 11.2906 11.4393 11.5719C11.7206 11.8532 12.1022 12.0112 12.5 12.0112C12.8978 12.0112 13.2794 11.8532 13.5607 11.5719C13.842 11.2906 14 10.909 14 10.5112C14 10.1134 13.842 9.73193 13.5607 9.45063C13.2794 9.16933 12.8978 9.01123 12.5 9.01123ZM14 2.50025C14.0001 2.42966 13.9852 2.35986 13.9563 2.29544C13.9274 2.23102 13.8853 2.17345 13.8326 2.1265C13.7798 2.07955 13.7178 2.04429 13.6505 2.02305C13.5832 2.00181 13.5121 1.99506 13.442 2.00325L13.362 2.01925L8.14 3.51125H14V2.50025Z"
                      fill="white" />
                  </svg>
                  Disconnect
                </button>
              </div>
              <div class="red-packet-model">
                <div class="red-packet-title">
                  <div class="title">Red Packet</div>
                  <div class="amount">{{ quantity }} ETH</div>
                </div>
                <div class="red-packet-account">
                </div>
                <div class="red-packet-confirmation"></div>
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
import Layout from "../components/Layout.vue";
import { useAuthStore } from '@/stores/auth';
import { BigNumber } from "bignumber.js";
import Web3Model from "web3modal";
import { ethers } from "ethers";
import { providerOptions } from "../services/web3/providerOptions";
import { truncateAddress } from "@/services/web3/account";
// import { configureChains, createClient } from "@wagmi/core";
// import { arbitrum, mainnet, polygon } from "@wagmi/core/chains";
// import { Web3Modal } from "@web3modal/html";
// import {
//   EthereumClient,
//   modalConnectors,
//   walletConnectProvider,
// } from "@web3modal/ethereum";

const store = useAuthStore();
const user = store.currentUser;
const goerliScan = `https://goerli.etherscan.io/address/${user!.walletAddress}`;
const isDeployed = ref<boolean>(true);
const loading = ref<boolean>(true);
const balance = ref<number>(0);
const chain = "GOERLI";
const chainId = ref<number>(-1);
const account = ref<string>("");
const network = ref<any>();
const networkName = ref<string>("");
const sendLuck = ref<boolean>(true);
const luckHistory = ref<boolean>(false);
const wallet = ref<string>("");
const walletIcon = ref<string>("");
const accountBalance = ref<number>(0);
const mode = ref<string>("Random"); // 0 for random, 1 for average
const openDropdown = ref<boolean>(false);
const quantity = ref<number>(0);
const total_amount = ref<number>(0.0);
// TODO: Implement Web3Model V2

const sendRedPacket = () => {
  console.log({
    mode: mode.value,
    quantity: quantity.value,
    amount: total_amount.value
  })
}

const inputReminder = () => {
  if (quantity.value == 0 || quantity.value.toString() == "") return "Enter Quantity";
  else if (total_amount.value == 0.0 || total_amount.value.toString() == "") return "Enter Total Amount";
  else return "";
}

const checkInput = () => {
  if (inputReminder() == "") {
    return true;
  } else {
    return false;
  }
}

const modeChoose = (gameMode: "Random" | "Average") => {
  mode.value = gameMode;
}

const web3Modal = new Web3Model({
  cacheProvider: true,
  providerOptions
});

const connectWallet = async () => {
  // check if metamask is installed
  if (typeof window.ethereum == 'undefined') {
    console.log('MetaMask is not installed!');
  }
  try {
    const provider = await web3Modal.connect();
    const library = new ethers.providers.Web3Provider(provider);
    const accounts = await library.listAccounts();
    network.value = await library.getNetwork();
    if (accounts) account.value = accounts[0];
    chainId.value = network.value.chainId;
    networkName.value = network.value.name;
    console.log("Network: ", network.value.name);
    console.log("Account: ", account.value);
    console.log(library);
    if (library.connection.url == "metamask") {
      wallet.value = "metamask";
      walletIcon.value = "https://i.postimg.cc/7PMD1BN4/metamask-icon.png";
    } else if (library.connection.url == "eip-1193:") {
      wallet.value = library.provider.wc._peerMeta.name;
      if (library.provider.wc._peerMeta.icons != null) {
        walletIcon.value = library.provider.wc._peerMeta.icons[0];
      } else {
        walletIcon.value = "https://i.postimg.cc/j29hn62F/9035092-wallet-icon.png";
      }
    }
    store.connectOwallet(account.value, network.value, chainId.value);
    const etherProvider = ethers.getDefaultProvider(network.value);
    etherProvider.getBalance(account.value).then((balance) => {
      // convert a currency unit from wei to ether
      accountBalance.value = Number(ethers.utils.formatEther(balance));
    })
  } catch (error) {
    console.log(error);
  }
}

const refreshState = () => {
  account.value = "";
  chainId.value = -1;
  network.value = "";
  console.log("Logged out!")
  store.disconnectOwallet();
};

const disconnect = async () => {
  await web3Modal.clearCachedProvider();
  refreshState();
}

onMounted(async () => {
  if (web3Modal.cachedProvider) {
    connectWallet();
  }
})
// const chains = [mainnet, polygon];
// // Wagmi Core Client
// const { provider } = configureChains(chains, [
//   walletConnectProvider({ projectId: "51b27c0586113c177a6b6f67db61294c" }),
// ]);
// const wagmiClient = createClient({
//   autoConnect: true,
//   connectors: modalConnectors({ appName: "web3Modal", chains }),
//   provider,
// });

// // Web3Modal and Ethereum Client
// const ethereumClient = new EthereumClient(wagmiClient, chains);
// const web3modal = new Web3Modal(
//   { projectId: "51b27c0586113c177a6b6f67db61294c" },
//   ethereumClient
// );


</script>