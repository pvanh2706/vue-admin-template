
<template>
   <AdminLayout>
        <PageBreadcrumb :pageTitle="currentPageTitle" />
        <div>Config Store Page</div>
   </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { ref } from 'vue'
const currentPageTitle = ref('Thông tin cửa hàng')
</script>