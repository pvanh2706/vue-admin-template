<template>
    <div>
        <p>Mã cửa hàng</p>
        <AppInput 
            v-model="formData.storeCode" 
            type="text" 
            placeholder="Nhập mã cửa hàng"
            :clearable="false"
        />

        <p class="mt-4">Tên cửa hàng</p>
        <AppInput 
            v-model="formData.storeName" 
            type="text" 
            placeholder="Nhập tên cửa hàng"
            :clearable="false"
        />

        <p class="mt-4">Số điện thoại</p>
        <AppInput 
            v-model="formData.storePhone" 
            type="text" 
            placeholder="Nhập số điện thoại"
            :clearable="false"
        />

        <p class="mt-4">Email</p>
        <AppInput 
            v-model="formData.storeEmail" 
            type="text" 
            placeholder="Nhập email"
            :clearable="false"
        />

        <p class="mt-4">Mã số thuế</p>
        <AppInput 
            v-model="formData.storeTaxNumber" 
            type="text" 
            placeholder="Nhập mã số thuế"
            :clearable="false"
        />

        <p class="mt-4">Website</p>
        <AppInput 
            v-model="formData.storeWebsite" 
            type="text" 
            placeholder="Nhập website"
            :clearable="false"
        />

    </div>
</template>
<script setup lang="ts">

import AppInput from '@/components/ui/element-plus/AppInput.vue'
import { computed, reactive } from 'vue'
import { useRoute } from 'vue-router'

interface FormData {
    storeCode: string
    storeName: string
    storePhone: string
    storeEmail: string
    storeTaxNumber: string
    storeWebsite: string
}
const route = useRoute()
const isEdit = computed(() => !!route.params.id)

const formData = reactive<FormData>({
    storeCode: '',
    storeName: '',
    storePhone: '',
    storeEmail: '',
    storeTaxNumber: '',
    storeWebsite: ''
})
</script>
