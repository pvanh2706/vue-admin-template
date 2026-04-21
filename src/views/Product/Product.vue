<template>
    <AdminLayout>
        <PageBreadcrumb :pageTitle="currentPageTitle" />
        
        <!-- Hiển thị ProductList hoặc ProductForm -->
        <ProductList 
            v-if="!showForm"
            @add-product="handleAddProduct"
            @edit-product="handleEditProduct"
        />
        
        <ProductForm 
            v-else
            :product="selectedProduct ?? undefined"
            :mode="formMode"
            @cancel="handleCancel"
            @save="handleSave"
        />
    </AdminLayout>
</template>

<script setup lang="ts">
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import ProductList from '@/components/products/ProductList.vue';
import ProductForm from '@/components/products/ProductForm.vue';

import { ref } from 'vue';

interface ProductData {
    id?: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: string;
    sku?: string;
    brand?: string;
    weight?: number;
    image?: string;
    description?: string;
}

const currentPageTitle = ref('Quản lý sản phẩm');
const showForm = ref(false);
const formMode = ref<'add' | 'edit'>('add');
const selectedProduct = ref<ProductData | null>(null);

const handleAddProduct = () => {
    formMode.value = 'add';
    selectedProduct.value = null;
    showForm.value = true;
};

const handleEditProduct = (product: ProductData) => {
    formMode.value = 'edit';
    selectedProduct.value = product;
    showForm.value = true;
};

const handleCancel = () => {
    showForm.value = false;
    selectedProduct.value = null;
};

const handleSave = (productData: ProductData) => {
    console.log('Saving product:', productData);
    // Xử lý lưu sản phẩm ở đây
    showForm.value = false;
    selectedProduct.value = null;
};
</script>