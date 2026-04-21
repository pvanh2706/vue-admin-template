<template>
    <div class="product-list-container">
        <!-- Header với nút thêm sản phẩm -->
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">
                Danh sách sản phẩm
            </h2>
            <el-button 
                type="primary" 
                @click="$emit('add-product')"
                class="!bg-blue-600 hover:!bg-blue-700"
            >
                <span class="flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Thêm sản phẩm
                </span>
            </el-button>
        </div>

        <!-- Bảng danh sách sản phẩm -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <el-table 
                :data="products" 
                style="width: 100%"
                class="product-table"
                stripe
            >
                <el-table-column prop="id" label="ID" width="80" />
                
                <el-table-column label="Hình ảnh" width="100">
                    <template #default="{ row }">
                        <img 
                            :src="row.image" 
                            :alt="row.name"
                            class="w-16 h-16 object-cover rounded"
                        />
                    </template>
                </el-table-column>
                
                <el-table-column prop="name" label="Tên sản phẩm" min-width="200" />
                
                <el-table-column prop="category" label="Danh mục" width="150" />
                
                <el-table-column label="Giá" width="150">
                    <template #default="{ row }">
                        <span class="font-semibold text-green-600">
                            {{ formatPrice(row.price) }}
                        </span>
                    </template>
                </el-table-column>
                
                <el-table-column prop="stock" label="Tồn kho" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag 
                            :type="row.stock > 10 ? 'success' : row.stock > 0 ? 'warning' : 'danger'"
                            size="small"
                        >
                            {{ row.stock }}
                        </el-tag>
                    </template>
                </el-table-column>
                
                <el-table-column label="Trạng thái" width="120" align="center">
                    <template #default="{ row }">
                        <el-tag 
                            :type="row.status === 'active' ? 'success' : 'info'"
                            size="small"
                        >
                            {{ row.status === 'active' ? 'Đang bán' : 'Tạm ngưng' }}
                        </el-tag>
                    </template>
                </el-table-column>
                
                <el-table-column label="Thao tác" width="200" align="center" fixed="right">
                    <template #default="{ row }">
                        <div class="flex gap-2 justify-center">
                            <el-button 
                                type="primary" 
                                size="small"
                                @click="$emit('edit-product', row)"
                                link
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                                Sửa
                            </el-button>
                            
                            <el-button 
                                type="danger" 
                                size="small"
                                @click="handleDelete(row)"
                                link
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                                Xóa
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <!-- Phân trang -->
            <div class="flex justify-end p-4">
                <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    :total="total"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// Định nghĩa các events emit
defineEmits(['add-product', 'edit-product']);

// Data mẫu
const products = ref([
    {
        id: 1,
        name: 'MacBook Pro 16"',
        category: 'Laptop',
        price: 2499,
        stock: 15,
        status: 'active',
        image: '/images/product/product-01.png'
    },
    {
        id: 2,
        name: 'iPhone 15 Pro Max',
        category: 'Điện thoại',
        price: 1199,
        stock: 8,
        status: 'active',
        image: '/images/product/product-02.png'
    },
    {
        id: 3,
        name: 'Samsung Galaxy S24',
        category: 'Điện thoại',
        price: 999,
        stock: 0,
        status: 'inactive',
        image: '/images/product/product-03.png'
    },
    {
        id: 4,
        name: 'AirPods Pro',
        category: 'Phụ kiện',
        price: 249,
        stock: 25,
        status: 'active',
        image: '/images/product/product-04.png'
    },
    {
        id: 5,
        name: 'Dell XPS 13',
        category: 'Laptop',
        price: 1299,
        stock: 12,
        status: 'active',
        image: '/images/product/product-01.png'
    }
]);

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(products.value.length);

// Format giá tiền
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price * 1000);
};

// Xử lý xóa sản phẩm
const handleDelete = (row: typeof products.value[0]) => {
    ElMessageBox.confirm(
        `Bạn có chắc chắn muốn xóa sản phẩm "${row.name}"?`,
        'Xác nhận xóa',
        {
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            type: 'warning',
        }
    )
        .then(() => {
            // Xử lý xóa ở đây
            ElMessage.success('Xóa sản phẩm thành công');
        })
        .catch(() => {
            ElMessage.info('Đã hủy xóa');
        });
};

// Xử lý phân trang
const handleSizeChange = (val: number) => {
    pageSize.value = val;
    console.log(`${val} items per page`);
};

const handleCurrentChange = (val: number) => {
    currentPage.value = val;
    console.log(`current page: ${val}`);
};
</script>

<style scoped>
.product-list-container {
    padding: 20px;
}

.product-table {
    border-radius: 8px;
}

:deep(.el-table__header) {
    background-color: #f9fafb;
}

:deep(.el-table__body-wrapper) {
    border-radius: 0 0 8px 8px;
}
</style>
