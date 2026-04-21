<template>
    <div class="p-4">
        <img src="https://via.placeholder.com/150" alt="">
        <h1 class="text-2xl font-bold">Branch Form</h1>

        <p class="mt-4">Tên chi nhánh</p>
        <AppInput v-model="branchName" placeholder="Nhập tên chi nhánh" />

        <div class="mt-4 flex flex-row gap-4">
            <div class="flex-1">
            <p>Hotline</p>
            <AppInput v-model="hotline" placeholder="Nhập hotline" />
            </div>
            <div class="flex-1">
            <p>Địa chỉ</p>
            <AppInput v-model="address" placeholder="Nhập địa chỉ" />
            </div>
        </div>

        <p class="mt-4">Tên chi nhánh</p>
        <AppInput v-model="branchName" placeholder="Nhập tên chi nhánh" />

        <p class="mt-4">Tên chi nhánh</p>
        <AppInput v-model="branchName" placeholder="Nhập tên chi nhánh" />

        <div class="mt-4 flex flex-row gap-4">
            <div class="flex-1">
            <p>Hotline</p>
            <AppInput v-model="hotline" placeholder="Nhập hotline" />
            </div>
            <div class="flex-1">
            <p>Địa chỉ</p>
            <AppInput v-model="address" placeholder="Nhập địa chỉ" />
            </div>
        </div>
         <p class="mt-4">Tên chi nhánh</p>
        <AppInput v-model="branchName" placeholder="Nhập tên chi nhánh" />
         <p class="mt-4">Tên chi nhánh</p>
        <AppInput v-model="branchName" placeholder="Nhập tên chi nhánh" />
         <p class="mt-4">Tên chi nhánh</p>
        <AppInput v-model="branchName" placeholder="Nhập tên chi nhánh" />
         <p class="mt-4">Tên chi nhánh</p>
        <AppInput v-model="branchName" placeholder="Nhập tên chi nhánh" />
         <p class="mt-4">Tên chi nhánh</p>
        <AppInput v-model="branchName" placeholder="Nhập tên chi nhánh" />
         <p class="mt-4">Tên chi nhánh</p>
        <AppInput v-model="branchName" placeholder="Nhập tên chi nhánh" />
         <p class="mt-4">Tên chi nhánh</p>
        <AppInput v-model="branchName" placeholder="Nhập tên chi nhánh" />
         <p class="mt-4">Tên chi nhánh</p>
        <AppInput v-model="branchName" placeholder="Nhập tên chi nhánh" />
         <p class="mt-4">Tên chi nhánh</p>
        <AppInput v-model="branchName" placeholder="Nhập tên chi nhánh" />
         <p class="mt-4">Tên chi nhánh</p>
        <AppInput v-model="branchName" placeholder="Nhập tên chi nhánh" />
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const branchName = ref('')
const hotline = ref('')
const address = ref('')
</script>