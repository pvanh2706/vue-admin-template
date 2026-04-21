<template>
  <div class="jira-connection-info">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Jira Connection</h3>
      <JiraStatusBadge :status="connectionStatus" />
    </div>

    <el-descriptions :column="2" border>
      <el-descriptions-item label="Jira Instance">
        <a :href="config?.jiraUrl" target="_blank" class="text-blue-500 hover:underline">
          {{ config?.jiraUrl }}
        </a>
      </el-descriptions-item>
      <el-descriptions-item label="Connected Email">
        {{ config?.jiraEmail }}
      </el-descriptions-item>
      <el-descriptions-item label="Connected Since">
        {{ formatDate(config?.createdAt) }}
      </el-descriptions-item>
      <el-descriptions-item label="Last Tested">
        {{ formatDate(config?.lastTested) || 'Never' }}
      </el-descriptions-item>
      <el-descriptions-item label="Last Synced">
        {{ formatDate(config?.lastSynced) || 'Never' }}
      </el-descriptions-item>
    </el-descriptions>

    <div class="flex gap-3 mt-6">
      <el-button @click="handleTest" :loading="testing">
        Test Connection
      </el-button>
      <el-button v-if="isAdmin" type="primary" @click="$emit('edit')">
        Edit
      </el-button>
      <el-button v-if="isAdmin" type="danger" @click="handleDisconnect" :loading="loading">
        Disconnect
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useJiraConfigState } from '@/composables/jira/useJiraConfigState'
import { useJiraConnection } from '@/composables/jira/useJiraConnection'
import JiraStatusBadge from '@/components/jira/JiraStatusBadge.vue'

interface Emits {
  (e: 'edit'): void
  (e: 'disconnect'): void
}

const emit = defineEmits<Emits>()

const { config, loading } = useJiraConfigState()
const { testConnection, deleteConfig } = useJiraConnection()

const testing = ref(false)

// Phase 1: Mock admin (always true for testing)
// TODO: Replace with actual auth check when user store is implemented
const isAdmin = ref(true)

const connectionStatus = computed(() => {
  if (!config.value) return 'disconnected'
  if (config.value.isConnected) return 'connected'
  return 'error'
})

async function handleTest() {
  if (!config.value) return

  testing.value = true

  await testConnection({
    jiraUrl: config.value.jiraUrl,
    jiraEmail: config.value.jiraEmail,
    jiraApiToken: '', // Backend will use stored token
  })

  testing.value = false
}

async function handleDisconnect() {
  const success = await deleteConfig()
  if (success) {
    emit('disconnect')
  }
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString()
}
</script>
