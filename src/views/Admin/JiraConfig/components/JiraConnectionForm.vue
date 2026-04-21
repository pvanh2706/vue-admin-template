<template>
  <div class="jira-connection-form">
    <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">
      {{ mode === 'edit' ? 'Edit Jira Configuration' : 'Connect to Jira' }}
    </h3>

    <el-form :model="formData" :rules="rules" ref="formRef" label-position="top">
      <el-form-item label="Jira Instance URL" prop="jiraUrl">
        <el-input
          v-model="formData.jiraUrl"
          placeholder="https://yourcompany.atlassian.net"
          :disabled="loading"
        />
        <template #extra>
          <span class="text-sm text-gray-500">Your Jira Cloud or Data Center URL</span>
        </template>
      </el-form-item>

      <el-form-item label="Email Address" prop="jiraEmail">
        <el-input
          v-model="formData.jiraEmail"
          type="email"
          placeholder="your-email@company.com"
          :disabled="loading"
        />
        <template #extra>
          <span class="text-sm text-gray-500">Email used to login to Jira</span>
        </template>
      </el-form-item>

      <el-form-item label="API Token" prop="jiraApiToken">
        <el-input
          v-model="formData.jiraApiToken"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter your Jira API token"
          :disabled="loading"
        >
          <template #append>
            <el-button @click="showPassword = !showPassword" :icon="showPassword ? 'View' : 'Hide'">
              {{ showPassword ? 'Hide' : 'Show' }}
            </el-button>
          </template>
        </el-input>
        <template #extra>
          <span class="text-sm text-gray-500">
            <a
              href="https://id.atlassian.com/manage-profile/security/api-tokens"
              target="_blank"
              class="text-blue-500 hover:underline"
            >
              Create API token
            </a>
            in your Atlassian account settings
          </span>
        </template>
      </el-form-item>

      <div class="flex gap-3 mt-6">
        <el-button
          type="primary"
          @click="handleTest"
          :loading="testing"
          :disabled="!isFormValid || loading"
        >
          Test Connection
        </el-button>
        <el-button
          type="success"
          @click="handleSave"
          :loading="loading"
          :disabled="!testPassed && !forceSave"
        >
          Save Configuration
        </el-button>
        <el-button v-if="mode === 'edit'" @click="handleCancel" :disabled="loading">
          Cancel
        </el-button>
      </div>

      <div v-if="testResult" class="mt-4">
        <el-alert
          :type="testResult.success ? 'success' : 'error'"
          :title="testResult.message"
          :closable="false"
        />
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useJiraConnection } from '@/composables/jira/useJiraConnection'
import { useJiraConfigState } from '@/composables/jira/useJiraConfigState'
import type { JiraConfig } from '@/types/jira/config'

interface Props {
  initialData?: JiraConfig | null
  mode?: 'create' | 'edit'
}

interface Emits {
  (e: 'saved'): void
  (e: 'cancelled'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  initialData: null,
})

const emit = defineEmits<Emits>()

const { saveConfig, testConnection } = useJiraConnection()
const { loading } = useJiraConfigState()

const formRef = ref<FormInstance>()
const showPassword = ref(false)
const testing = ref(false)
const testPassed = ref(false)
const forceSave = ref(false)
const testResult = ref<{ success: boolean; message: string } | null>(null)

const formData = reactive({
  jiraUrl: '',
  jiraEmail: '',
  jiraApiToken: '',
})

const rules: FormRules = {
  jiraUrl: [
    { required: true, message: 'Jira URL is required', trigger: 'blur' },
    { type: 'url', message: 'Must be a valid URL', trigger: 'blur' },
    { pattern: /^https:\/\//, message: 'URL must start with https://', trigger: 'blur' },
  ],
  jiraEmail: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Must be a valid email', trigger: 'blur' },
  ],
  jiraApiToken: [
    { required: true, message: 'API token is required', trigger: 'blur' },
    { min: 8, message: 'API token must be at least 8 characters', trigger: 'blur' },
  ],
}

const isFormValid = computed(() => {
  return formData.jiraUrl && formData.jiraEmail && formData.jiraApiToken.length >= 8
})

async function handleTest() {
  const valid = await formRef.value?.validate()
  if (!valid) return

  testing.value = true
  testResult.value = null

  const success = await testConnection({
    jiraUrl: formData.jiraUrl,
    jiraEmail: formData.jiraEmail,
    jiraApiToken: formData.jiraApiToken,
  })

  testing.value = false
  testPassed.value = success
  testResult.value = {
    success,
    message: success ? 'Connection successful!' : 'Connection failed. Please check your credentials.',
  }
}

async function handleSave() {
  const valid = await formRef.value?.validate()
  if (!valid) return

  const success = await saveConfig({
    jiraUrl: formData.jiraUrl,
    jiraEmail: formData.jiraEmail,
    jiraApiToken: formData.jiraApiToken,
  })

  if (success) {
    emit('saved')
  }
}

function handleCancel() {
  emit('cancelled')
}

onMounted(() => {
  if (props.initialData) {
    formData.jiraUrl = props.initialData.jiraUrl
    formData.jiraEmail = props.initialData.jiraEmail
    // API token is not returned from backend for security
    formData.jiraApiToken = ''
  }
})
</script>
