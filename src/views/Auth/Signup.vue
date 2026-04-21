<template>
    <FullScreenLayout>
        <div class="relative p-6 bg-gray-100 z-1 dark:bg-gray-900 sm:p-0">
            <div class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900">
                <div class="flex flex-col flex-1 w-full">
                    <!-- 
                        Form Sign Up
                    -->
                    <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                        <div class="flex flex-col items-center mb-8">
                            <router-link to="/" class="block">
                                <img width="120" height="25" src="/images/logo/logo.jpg" alt="Logo" />
                            </router-link>
                        </div>

                        <div class="mb-5 sm:mb-8">
                            <h1
                                class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-xs text-center">
                                Đăng ký tài khoản CodeOn POS
                            </h1>
                        </div>

                        <!-- Form Sign Up by Element Plus -->
                        <div class="mb-5 sm:mb-0">
                            <el-form ref="ruleFormRef" :model="ruleForm" :rules="signupRules" label-width="auto"
                                :hide-required-asterisk="true">

                                <!-- Họ và tên  -->
                                <el-form-item prop="name" :label-position="'top'">
                                    <template #label>
                                        <span>Họ và tên <span class="text-red-500">*</span></span>
                                    </template>
                                    <el-input v-model="ruleForm.name" autocomplete="off" />
                                </el-form-item>

                                <!-- Số điện thoại  -->
                                <el-form-item prop="phone" :label-position="'top'">
                                    <template #label>
                                        <span>Số điện thoại <span class="text-red-500">*</span></span>
                                    </template>
                                    <el-input v-model="ruleForm.phone" autocomplete="off" />
                                </el-form-item>

                                <!-- Email  -->
                                <el-form-item prop="email" :label-position="'top'">
                                    <template #label>
                                        <span>Email <span class="text-red-500">*</span></span>
                                    </template>
                                    <el-input v-model="ruleForm.email" autocomplete="off" />
                                </el-form-item>

                                <!-- Mật khẩu và Nhập lại mật khẩu trên cùng 1 dòng -->
                                <div class="grid grid-cols-2 gap-4">
                                    <!-- Mật khẩu  -->
                                    <el-form-item prop="password" :label-position="'top'">
                                        <template #label>
                                            <span>Mật khẩu <span class="text-red-500">*</span></span>
                                        </template>
                                        <el-input type="password" v-model="ruleForm.password" show-password
                                            autocomplete="new-password" />
                                    </el-form-item>

                                    <!-- Nhập lại mật khẩu  -->
                                    <el-form-item prop="confirmPassword" :label-position="'top'">
                                        <template #label>
                                            <span>Nhập lại mật khẩu <span class="text-red-500">*</span></span>
                                        </template>
                                        <el-input type="password" v-model="ruleForm.confirmPassword" show-password
                                            autocomplete="new-password" />
                                    </el-form-item>
                                </div>
                            </el-form>
                        </div>

                        <!-- Checkbox Tôi đồng ý với Điều khoản và Chính sách -->
                        <div class="mb-5 sm:mb-2">
                            <el-checkbox>
                                Tôi đồng ý với <a href="#" class="text-link-primary no-underline">những điều khoản sử dụng</a>
                            </el-checkbox>
                        </div>

                        <!-- Nút Đăng ký -->
                        <div class="mb-5 sm:mb-8">
                            <el-button type="primary" class="w-full" @click="handleSubmit">Đăng ký</el-button>
                        </div>
                    </div>
                </div>
                <common-grid-shape />
            </div>
        </div>
    </FullScreenLayout>
</template>

<script setup lang="ts">
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import CommonGridShape from '@/components/common/CommonGridShape.vue'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { RuleForm } from './types/auth-form.type'
import type { FormInstance } from 'element-plus'
import { signupRules } from './rules/auth.rules'

const ruleFormRef = ref<FormInstance>()
const ruleForm = ref<RuleForm>({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    email: '',
})

const handleSubmit = () => {
    ruleFormRef.value?.validate((valid) => {
        if (valid) {
            console.log('submit!', ruleForm.value)
        } else {
            console.log('error submit!!')
        }
    })
}


</script>
