<template>
    <div class="product-form-container">
        <!-- Header với nút quay lại -->
        <div class="flex items-center gap-4 mb-6">
            <el-button 
                @click="$emit('cancel')"
                circle
                class="!bg-gray-100 hover:!bg-gray-200"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
            </el-button>
            <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">
                {{ mode === 'add' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm' }}
            </h2>
        </div>

        <!-- Form -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <el-form 
                ref="formRef"
                :model="formData" 
                :rules="rules"
                label-width="150px"
                label-position="left"
            >
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Cột trái -->
                    <div class="space-y-4">
                        <el-form-item label="Tên sản phẩm" prop="name">
                            <el-input 
                                v-model="formData.name" 
                                placeholder="Nhập tên sản phẩm"
                                size="large"
                            />
                        </el-form-item>

                        <el-form-item label="Danh mục" prop="category">
                            <el-select 
                                v-model="formData.category" 
                                placeholder="Chọn danh mục"
                                size="large"
                                class="w-full"
                            >
                                <el-option label="Laptop" value="Laptop" />
                                <el-option label="Điện thoại" value="Điện thoại" />
                                <el-option label="Tablet" value="Tablet" />
                                <el-option label="Phụ kiện" value="Phụ kiện" />
                                <el-option label="Đồng hồ" value="Đồng hồ" />
                            </el-select>
                        </el-form-item>

                        <el-form-item label="Giá (VNĐ)" prop="price">
                            <el-input-number 
                                v-model="formData.price" 
                                :min="0"
                                :step="1000"
                                :controls="true"
                                size="large"
                                class="w-full"
                            />
                        </el-form-item>

                        <el-form-item label="Tồn kho" prop="stock">
                            <el-input-number 
                                v-model="formData.stock" 
                                :min="0"
                                size="large"
                                class="w-full"
                            />
                        </el-form-item>

                        <el-form-item label="Trạng thái" prop="status">
                            <el-radio-group v-model="formData.status" size="large">
                                <el-radio value="active">Đang bán</el-radio>
                                <el-radio value="inactive">Tạm ngưng</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>

                    <!-- Cột phải -->
                    <div class="space-y-4">
                        <el-form-item label="Mã SKU" prop="sku">
                            <el-input 
                                v-model="formData.sku" 
                                placeholder="Nhập mã SKU"
                                size="large"
                            />
                        </el-form-item>

                        <el-form-item label="Thương hiệu" prop="brand">
                            <el-input 
                                v-model="formData.brand" 
                                placeholder="Nhập thương hiệu"
                                size="large"
                            />
                        </el-form-item>

                        <el-form-item label="Trọng lượng (kg)" prop="weight">
                            <el-input-number 
                                v-model="formData.weight" 
                                :min="0"
                                :step="0.1"
                                :precision="2"
                                size="large"
                                class="w-full"
                            />
                        </el-form-item>

                        <el-form-item label="Hình ảnh" prop="image">
                            <div class="w-full">
                                <el-upload
                                    class="avatar-uploader"
                                    action="#"
                                    :show-file-list="false"
                                    :auto-upload="false"
                                    :on-change="handleImageChange"
                                >
                                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                                    <div v-else class="upload-placeholder">
                                        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                        </svg>
                                        <span class="text-sm text-gray-500">Tải ảnh lên</span>
                                    </div>
                                </el-upload>
                            </div>
                        </el-form-item>
                    </div>
                </div>

                <!-- Mô tả sản phẩm full width -->
                <el-form-item label="Mô tả" prop="description" class="mt-4">
                    <el-input 
                        v-model="formData.description" 
                        type="textarea"
                        :rows="4"
                        placeholder="Nhập mô tả chi tiết sản phẩm"
                    />
                </el-form-item>

                <!-- Các nút thao tác -->
                <el-form-item class="mt-8">
                    <div class="flex gap-3">
                        <el-button 
                            type="primary" 
                            size="large"
                            @click="handleSubmit"
                            :loading="loading"
                            class="!bg-blue-600 hover:!bg-blue-700"
                        >
                            <span class="flex items-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                {{ mode === 'add' ? 'Thêm sản phẩm' : 'Cập nhật' }}
                            </span>
                        </el-button>
                        
                        <el-button 
                            size="large"
                            @click="$emit('cancel')"
                        >
                            Hủy
                        </el-button>
                        
                        <el-button 
                            type="info" 
                            size="large"
                            @click="handleReset"
                            plain
                        >
                            Đặt lại
                        </el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { FormInstance, FormRules, UploadFile } from 'element-plus';
import { ElMessage } from 'element-plus';

interface ProductData {
    name: string;
    category: string;
    price: number;
    stock: number;
    status: string;
    sku: string;
    brand: string;
    weight: number;
    image: string;
    description: string;
}

const props = defineProps<{
    product?: ProductData;
    mode: 'add' | 'edit';
}>();

const emit = defineEmits<{
    cancel: [];
    save: [product: ProductData];
}>();

const formRef = ref<FormInstance>();
const loading = ref(false);
const imageUrl = ref('');

// Form data
const formData = reactive<ProductData>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    status: 'active',
    sku: '',
    brand: '',
    weight: 0,
    image: '',
    description: ''
});

// Validation rules
const rules = reactive<FormRules<ProductData>>({
    name: [
        { required: true, message: 'Vui lòng nhập tên sản phẩm', trigger: 'blur' },
        { min: 3, max: 200, message: 'Tên sản phẩm từ 3-200 ký tự', trigger: 'blur' }
    ],
    category: [
        { required: true, message: 'Vui lòng chọn danh mục', trigger: 'change' }
    ],
    price: [
        { required: true, message: 'Vui lòng nhập giá sản phẩm', trigger: 'blur' },
        { type: 'number', min: 0, message: 'Giá phải lớn hơn 0', trigger: 'blur' }
    ],
    stock: [
        { required: true, message: 'Vui lòng nhập số lượng tồn kho', trigger: 'blur' }
    ],
    sku: [
        { required: true, message: 'Vui lòng nhập mã SKU', trigger: 'blur' }
    ]
});

// Watch product prop để cập nhật form khi edit
watch(() => props.product, (newProduct) => {
    if (newProduct && props.mode === 'edit') {
        Object.assign(formData, {
            name: newProduct.name || '',
            category: newProduct.category || '',
            price: newProduct.price || 0,
            stock: newProduct.stock || 0,
            status: newProduct.status || 'active',
            sku: newProduct.sku || '',
            brand: newProduct.brand || '',
            weight: newProduct.weight || 0,
            image: newProduct.image || '',
            description: newProduct.description || ''
        });
        imageUrl.value = newProduct.image || '';
    }
}, { immediate: true });

// Xử lý thay đổi hình ảnh
const handleImageChange = (file: UploadFile) => {
    if (file.raw) {
        imageUrl.value = URL.createObjectURL(file.raw);
        formData.image = imageUrl.value;
    }
};

// Submit form
const handleSubmit = async () => {
    if (!formRef.value) return;
    
    await formRef.value.validate((valid) => {
        if (valid) {
            loading.value = true;
            
            // Simulate API call
            setTimeout(() => {
                loading.value = false;
                ElMessage.success(
                    props.mode === 'add' 
                        ? 'Thêm sản phẩm thành công!' 
                        : 'Cập nhật sản phẩm thành công!'
                );
                emit('save', { ...formData });
            }, 1000);
        } else {
            ElMessage.error('Vui lòng điền đầy đủ thông tin!');
        }
    });
};

// Reset form
const handleReset = () => {
    formRef.value?.resetFields();
    imageUrl.value = '';
};
</script>

<style scoped>
.product-form-container {
    padding: 20px;
}

.avatar-uploader {
    width: 100%;
}

:deep(.avatar-uploader .el-upload) {
    border: 2px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
    width: 100%;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
}

:deep(.avatar-uploader .el-upload:hover) {
    border-color: #409eff;
}

.avatar {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
}

.upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

:deep(.el-form-item__label) {
    font-weight: 500;
    color: #374151;
}

:deep(.dark .el-form-item__label) {
    color: #e5e7eb;
}
</style>
