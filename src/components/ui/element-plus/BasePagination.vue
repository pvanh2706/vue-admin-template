<template>
    <div class="w-full flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 py-3">
        <!-- Left -->
        <div class="flex items-center gap-3 text-sm">
            <span class="whitespace-nowrap">Số bản ghi / trang</span>

            <el-select v-model="localPageSize" class="w-32" value-key="value" @change="onSizeChange">
                <el-option v-for="s in pageSizes" :key="s" :label="`${s}`" :value="s" />
            </el-select>
        </div>

        <!-- Right -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <span class="text-sm text-gray-500 whitespace-nowrap">
                Hiển thị {{ from }}–{{ to }} trên {{ total }} kết quả
            </span>

            <div class="flex items-center gap-1">
                <!-- First -->
                <el-button text :disabled="localPage === 1" @click="goFirst"> « </el-button>

                <!-- Prev -->
                <el-button text :disabled="localPage === 1" @click="goPrev"> ‹ </el-button>

                <!-- Pager -->
                <el-pagination v-model:current-page="localPage" :page-size="localPageSize" :total="total" layout="pager"
                    background class="!mb-0" @current-change="onPageChange" />

                <!-- Next -->
                <el-button text :disabled="localPage === totalPages" @click="goNext"> › </el-button>

                <!-- Last -->
                <el-button text :disabled="localPage === totalPages" @click="goLast"> » </el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'

interface Props {
    total: number
    page: number
    pageSize: number
    pageSizes?: number[]
}

const props = withDefaults(defineProps<Props>(), {
    pageSizes: () => [10, 20, 50, 100],
})

const emit = defineEmits<{
    (e: 'update:page', v: number): void
    (e: 'update:pageSize', v: number): void
    (e: 'change', payload: { page: number; pageSize: number }): void
}>()

/* local state để dùng v-model nội bộ */
const localPage = ref(props.page)
// const localPageSize = ref(props.pageSize)
// Ép kiểu thành number 
const localPageSize = ref(Number(props.pageSize))

watch(
    () => props.page,
    (v) => (localPage.value = v),
)
watch(
    () => props.pageSize,
    //   (v) => (localPageSize.value = v),
    (v) => (localPageSize.value = Number(v)),
)

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / localPageSize.value)))

const from = computed(() =>
    props.total === 0 ? 0 : (localPage.value - 1) * localPageSize.value + 1,
)

const to = computed(() => Math.min(localPage.value * localPageSize.value, props.total))

/* actions */

function trigger() {
    emit('update:page', localPage.value)
    emit('update:pageSize', localPageSize.value)
    emit('change', {
        page: localPage.value,
        pageSize: localPageSize.value,
    })
}

function onPageChange(p: number) {
    localPage.value = p
    trigger()
}

function onSizeChange() {
    localPage.value = 1
    trigger()
}

function goFirst() {
    localPage.value = 1
    trigger()
}

function goLast() {
    localPage.value = totalPages.value
    trigger()
}

function goPrev() {
    if (localPage.value > 1) {
        localPage.value--
        trigger()
    }
}

function goNext() {
    if (localPage.value < totalPages.value) {
        localPage.value++
        trigger()
    }
}
</script>

<style>
/* active page giống ảnh */
.el-pagination.is-background .el-pager li.is-active {
    background-color: #3b82f6;
    color: white;
}

/* Fix: Hiển thị giá trị đã chọn trong el-select */
.el-select .el-select__placeholder {
    display: inline !important;
    opacity: 1 !important;
}

.el-select .el-select__placeholder.is-transparent {
    opacity: 1 !important;
    color: var(--el-text-color-regular, #606266) !important;
}

/* Fix: Căn giữa số trong el-select */
.el-select .el-select__wrapper {
    display: flex !important;
    align-items: center !important;
}

.el-select .el-select__selection {
    display: flex !important;
    align-items: center !important;
}

.el-select .el-select__placeholder {
    line-height: normal !important;
    transform: none !important;
    top: auto !important;
    position: static !important;
}
</style>
