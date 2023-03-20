<template>
  <layout :active="3">
    <div class="row">
      <div className="row invoice-card-row">
        <div class="col-xxl-6">
          <div class="card">
            <div class="card-body">
              <div class="token-list">
                <div class="title">
                  <div class="title-col">
                    <div class="content">
                      <div class="text">Activities</div>
                      <img src="@/assets/svg/colon.svg"/>
                    </div>
                  </div>
                </div>
              </div>
              <div class="token-listDetail">
                <div class="token-table">
                  <div style="overflow: visible; border-radius: 0.75rem;">
                    <TransactionList></TransactionList>
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
import Layout from "@/components/Layout.vue";
import TransactionList from "@/components/TransactionList.vue";
</script>

<style lang="less" scoped>
.token-listDetail .token-table {
  display: flex;
  margin-left: -1rem;
  margin-right: -1rem;
  flex-direction: column;

  @media (min-width: 640px) {
    margin-left: 0;
    margin-right: 0; } }
.token-listDetail {
  border-radius: 0.75rem;
  margin-top: 1rem; }
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
  padding: 20px;
  background: transparent;
  border-radius: 15px; }
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
  align-items: center;
  @media (max-width: 640px) {
    margin-left: 0rem;  } }
.token-list .title .title-col .content .text {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600; }
.token-list .title .title-col .content img {
  display: inline-flex;
  transition-property: background-color, border-color, color, fill, stroke;
  justify-content: center;
  align-items: center;
  width: 1rem;
  height: 1rem;
  margin-left: 0.75rem; }
</style>