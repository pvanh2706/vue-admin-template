<template>
    <FullScreenLayout>
        <div class="relative p-6 bg-gray-100 z-1 dark:bg-gray-900 sm:p-0">
            <div class="relative flex flex-col justify-center items-center w-full h-screen lg:flex-row dark:bg-gray-900">
                <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-6 py-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <div class="text-center mb-8 items-center justify-center flex flex-col">
                        <h2 class="text-2xl font-semibold mb-2">Xác nhận Email</h2>
                        <p class="text-gray-600 dark:text-gray-400">
                            Vui lòng kiểm tra hộp thư đến của bạn để xác nhận địa chỉ email.
                        </p>
                    </div>
                    <div class="mb-5 sm:mb-8">
                        <el-button type="primary" class="w-full" @click="resendVerificationEmail">
                            Gửi lại email xác nhận
                        </el-button>
                    </div>

                </div>
            </div>
        </div>
        <!-- <div class="max-w-md w-full px-6 sm:px-12">
            <div class="text-center mb-8 items-center justify-center flex flex-col">
                <h2 class="text-2xl font-semibold mb-2">Xác nhận Email</h2>
                <p class="text-gray-600 dark:text-gray-400">
                    Vui lòng kiểm tra hộp thư đến của bạn để xác nhận địa chỉ email.
                </p>
            </div>
            <div class="mb-5 sm:mb-8">
                <el-button type="primary" class="w-full" @click="resendVerificationEmail">
                    Gửi lại email xác nhận
                </el-button>
            </div>
        </div> -->
    </FullScreenLayout>
</template>

<script setup lang="ts">
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'

const resendVerificationEmail = () => {
  // Logic to resend verification email
  console.log('Resend verification email clicked')
}
</script>