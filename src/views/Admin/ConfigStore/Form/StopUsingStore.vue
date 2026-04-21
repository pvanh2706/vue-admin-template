<template>
    <div class="flex flex-col items-center justify-center p-4">
        <Warning title="Ngừng chi nhánh" />
        <h1 class="font-semibold text-lg">Ngừng chi nhánh</h1>
        <p>Bạn có chắc chắn muốn ngừng chi nhánh này?</p>
    </div>
  

    <p class="font-semibold">Lý do dừng dịch vụ</p>
    <AppSelect v-model="stopReason" :placeholder="'Chọn lý do dừng dịch vụ'">
        <el-option label="Lý do 1" value="Lý do 1" />
        <el-option label="Lý do 2" value="Lý do 2" />
        <el-option label="Lý do 3" value="Lý do 3" />
    </AppSelect>

    <el-select v-model="value" placeholder="Select.." style="width: 240px">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import AppSelect from '@/components/ui/element-plus/AppSelect.vue';
import Warning from '@/components/ui/images/Warning.vue';
import { ref } from 'vue';

const stopReason = ref('');

const value = ref('')

const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
</script>