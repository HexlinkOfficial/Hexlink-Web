<template>
    <a-list item-layout="horizontal" :data-source="txes" style="width: 100%;">
        <template #renderItem="{ item }">
            <a-list-item>
                <a-descriptions bordered>
                    <a-descriptions-item label="From">{{item.from}}</a-descriptions-item>
                    <a-descriptions-item label="To">{{item.to}}</a-descriptions-item>
                    <a-descriptions-item label="Amount">{{item.amount}}</a-descriptions-item>
                </a-descriptions>
            </a-list-item>
        </template>
    </a-list>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Transaction } from "@/services/web3/account";

const txes = ref<Transaction[]>([]);

onMounted(() => {

});
</script>