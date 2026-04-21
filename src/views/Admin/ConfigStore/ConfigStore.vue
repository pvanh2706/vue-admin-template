<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <!-- Main container với responsive padding -->
    <div
      class="rounded border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-3 text-gray-700 dark:text-gray-400"
    >
      <div class="flex flex-row items-center gap-3">
        <h3 class="text-sm font-semibold dark:text-white/90">PTH_Cửa hàng Phạn Thế Hiển</h3>
        <el-button type="primary" plain :icon="Edit" @click="dialogVisible = true">Sửa cửa hàng</el-button>
        <!-- <el-button type="primary" plain :icon="Edit" style="color: white;">Sửa cửa hàng</el-button> -->
      </div>

      <div class="flex flex-row items-center gap-5 mt-4">
        <span class="text-sm flex-1"><span class="font-semibold">Hotline: </span>0123456789</span>
        <span class="text-sm flex-1"
          ><span class="font-semibold">Email: </span>info@example.com</span
        >
      </div>

      <div class="flex flex-row items-center gap-5 mt-4">
        <span class="text-sm flex-1"
          ><span class="font-semibold">Mã số thuế: </span>0123456789</span
        >
        <span class="text-sm flex-1"
          ><span class="font-semibold">Website: </span>toidicodedo.com</span
        >
      </div>
    </div>

    <div
      class="mt-4 rounded border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-3 text-gray-700 dark:text-gray-400"
    >
      <div class="flex flex-row items-center justify-between gap-3">
        <h3 class="text-sm font-semibold dark:text-white/90">Danh sách Chi nhánh</h3>
        <el-button type="primary" plain :icon="Plus" @click="branchDialogVisible = true">Thêm chi nhánh</el-button>
        <!-- <el-button type="primary" plain :icon="Edit" style="color: white;">Sửa cửa hàng</el-button> -->
      </div>
      <div class="mt-4">
        <el-table :data="tableData" class="branch-table" :scrollbar-always-on="true" height="200px">
          <!-- <el-table-column label="Tên chi nhánh" width="300">
                        <template #default="scope">
                            <div class="flex align-items-center">
                                <img width="25" height="25" src="/images/logo/logo.jpg" alt="Logo" />
                                <span class="ml-2">{{ scope.row.name }}</span>
                            </div>
                        </template>
                    </el-table-column> -->

          <el-table-column width="300">
            <!-- CUSTOM HEADER -->
            <template #header>
              <div style="display: flex; justify-content: space-between; align-items: center">
                <span style="color: #409eff; font-weight: 600"> Tên chi nhánh </span>
              </div>
            </template>

            <!-- CELL -->
            <template #default="scope">
              <div class="flex align-items-center">
                <img width="25" height="25" src="/images/logo/logo.jpg" alt="Logo" />
                <span class="ml-2">{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column width="200">
            <template #header>
              <div class="flex align-items-center">
                <span class="ml-2"> Hotline </span>
              </div>
            </template>

            <template #default="scope">
              <div class="flex align-items-center">
                <span class="ml-2">{{ scope.row.phone }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Email" width="250">
            <template #header>
              <div class="flex align-items-center">
                <span class="ml-2"> Email </span>
              </div>
            </template>

            <template #default="scope">
              <div class="flex align-items-center">
                <span class="ml-2">{{ scope.row.email }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Tài khoản" width="200">
            <template #header>
              <div class="flex align-items-center">
                <span class="ml-2"> Tài khoản </span>
              </div>
            </template>

            <template #default="scope">
              <div class="flex align-items-center">
                <span class="ml-2">{{ scope.row.numberAccount }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Trạng thái" width="120">
            <template #header>
              <div class="flex align-items-center justify-center">
                <span class="ml-2"> Trạng thái </span>
              </div>
            </template>
            <template #default="scope">
              <div class="flex align-items-center justify-center">
                <el-tag
                  :key="scope.row.id"
                  :type="scope.row.status === 'active' ? 'success' : 'danger'"
                  effect="light"
                  >{{ scope.row.status }}</el-tag
                >
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Thao tác" width="280">
            <template #default="scope">
              <div class="flex items-center text-sm">
                <el-button
                  :icon="Edit"
                  link
                  @click="handleEdit(scope.$index, scope.row)"
                  title="Chỉnh sửa"
                />
                <!-- Thêm icon pause -->
                <el-button
                  :icon="VideoPause"
                  link
                  @click="handleEdit(scope.$index, scope.row)"
                  title="Ngừng sử dụng"
                />
                <el-button
                  type="danger"
                  link
                  :icon="Delete"
                  @click="handleDelete(scope.$index, scope.row)"
                  title="Xóa"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Pagination -->
      <div
        class="mt-4 dark:text-gray-400 dark:bg-white/[0.03] border-gray-200 dark:border-gray-800 rounded"
      >
        <BasePagination
          v-model:page="query.page"
          v-model:pageSize="query.pageSize"
          :total="total"
          @change="loadData"
        />
      </div>
    </div>

    <!-- Form Thêm/Sửa cửa hàng -->
    <AppDialog class="mt-4" v-model="dialogVisible" title="Chỉnh sửa cửa hàng" :width="500" :draggable="true">
        <StoreForm />
        <template #footer>
            <AppButton @click="dialogVisible = false">Hủy bỏ</AppButton>
            <AppButton variant="primary" @click="handleSave">Tạo đơn vị</AppButton>
        </template>
    </AppDialog>

    <!-- Form Ngừng sử dụng chi nhánh -->
    <AppDialog class="mt-4" v-model="stopDialogVisible" title="Ngừng sử dụng chi nhánh" :width="400" :draggable="true">
        <StopUsingStore />
        <template #footer>
            <AppButton @click="stopDialogVisible = false">Hủy bỏ</AppButton>
            <AppButton variant="danger" @click="handleStop">Xác nhận</AppButton>
        </template>
    </AppDialog>
    <!-- Form thêm chi nhánh -->
    <AppDialog class="mt-4" v-model="branchDialogVisible" title="Thêm chi nhánh" :width="600" :draggable="true">
        <BranchForm />
        <template #footer>
            <AppButton @click="branchDialogVisible = false">Hủy bỏ</AppButton>
            <AppButton variant="primary" @click="handleSave">Tạo đơn vị</AppButton>
        </template>
    </AppDialog>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import StoreForm from './StoreForm.vue'
import StopUsingStore from './Form/StopUsingStore.vue'
import BranchForm from './Form/BranchForm.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import BasePagination from '@/components/ui/element-plus/BasePagination.vue'
import AppDialog from '@/components/ui/element-plus/AppDialog.vue'
import { Timer, Plus, Edit, Delete, VideoPause } from '@element-plus/icons-vue'
import { ConfigStore } from '@/views/Admin/ConfigStore/types/config-store.type'
import { ref, computed, reactive } from 'vue'

const currentPageTitle = ref('Thông tin cửa hàng')
const dialogVisible = ref(false);
const stopDialogVisible = ref(false);
const branchDialogVisible = ref(false);

const handleEdit = (index: number, row: ConfigStore) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: ConfigStore) => {
  console.log(index, row)
    stopDialogVisible.value = true
}

const handleSave = () => {
  console.log('Save')
}

const handleStop = () => {
  console.log('Stop')
}

const tableData: ConfigStore[] = [
  {
    id: '1',
    name: 'Cửa hàng 1',
    phone: '0123456789',
    email: 'store1@example.com',
    numberAccount: '123456789',
    status: 'active',
  },
  {
    id: '2',
    name: 'Cửa hàng 2',
    phone: '0123456789',
    email: 'store2@example.com',
    numberAccount: '123456789',
    status: 'inactive',
  },
  {
    id: '3',
    name: 'Cửa hàng 3',
    phone: '0123456789',
    email: 'store3@example.com',
    numberAccount: '123456789',
    status: 'active',
  },
  {
    id: '4',
    name: 'Cửa hàng 4',
    phone: '0123456789',
    email: 'store4@example.com',
    numberAccount: '123456789',
    status: 'inactive',
  },
]

const query = reactive({
  page: 1,
  pageSize: 10,
})

const total = ref(50)

function loadData({ page, pageSize }) {
  query.page = 1
  query.pageSize = 10

  console.log('load', query)
  // apiGetList(query)
}
// const total = ref(50)
// const currentPage = ref(1)
// const pageSize = ref(10)

// const pageSizes = [10, 20, 50, 100]

// const from = computed(() => (currentPage.value - 1) * pageSize.value + 1)

// const to = computed(() =>
//   Math.min(currentPage.value * pageSize.value, total.value)
// )

// const handlePageChange = (page: number) => {
//   currentPage.value = page
//   console.log("Page:", page)
// }

// const handleSizeChange = (size: number) => {
//   pageSize.value = size
//   currentPage.value = 1
//   console.log("Page size:", size)
// }
</script>

<style scoped>
/* Để Element Plus tự quản lý scroll cho fixed columns */
.branch-table {
  width: 100%;
}
</style>
