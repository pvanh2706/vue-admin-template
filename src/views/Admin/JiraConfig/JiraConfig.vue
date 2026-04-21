<template>
  <admin-layout>
    <PageBreadcrumb pageTitle="Jira Configuration" />

    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <el-card v-loading="loading">
        <!-- Empty State: No configuration -->
        <div v-if="!hasConfig && !editMode">
          <JiraConnectionForm mode="create" @saved="handleConfigSaved" />
        </div>

        <!-- Connected State: Configuration exists -->
        <div v-else-if="hasConfig && !editMode">
          <JiraConnectionInfo @edit="handleEdit" @disconnect="handleDisconnect" />
          <JiraProjectSettings />
        </div>

        <!-- Edit Mode -->
        <div v-else-if="editMode">
          <JiraConnectionForm
            mode="edit"
            :initial-data="config"
            @saved="handleConfigSaved"
            @cancelled="handleCancelEdit"
          />
        </div>
      </el-card>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import JiraConnectionForm from './components/JiraConnectionForm.vue'
import JiraConnectionInfo from './components/JiraConnectionInfo.vue'
import JiraProjectSettings from './components/JiraProjectSettings.vue'
import { useJiraConfigState } from '@/composables/jira/useJiraConfigState'
import { useJiraConnection } from '@/composables/jira/useJiraConnection'

const { config, loading, hasConfig } = useJiraConfigState()
const { fetchConfig } = useJiraConnection()

const editMode = ref(false)

function handleEdit() {
  editMode.value = true
}

function handleCancelEdit() {
  editMode.value = false
}

function handleConfigSaved() {
  editMode.value = false
  // Config is already updated in state by useJiraConnection
}

function handleDisconnect() {
  editMode.value = false
  // Config is already cleared in state by useJiraConnection
}

onMounted(async () => {
  await fetchConfig()
})
</script>
