<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import CheckIcon from '../../icons/Check.vue'
import CloseIcon from '../../icons/Close.vue'
import ArrowRightIcon from '../../icons/ArrowRight.vue'
import RefreshIcon from '../../icons/Refresh.vue'
import AlertTriangleIcon from '../../icons/AlertTriangle.vue'
import { useChatStore } from '../../stores/chatStore.ts'
import { useSettingsStore } from '../../stores/settingsStore.ts'

const store = useChatStore()
const settingsStore = useSettingsStore()

const ollamaStatus = ref(false)
const modelsCount = ref(0)

const loading = reactive({
  status: true,
  models: true,
})

async function refresh() {
  loading.models = true
  loading.status = true

  await requestStatus()
  await requestModels()
}

async function requestStatus() {
  const status = await settingsStore.getOllamaStatus()

  ollamaStatus.value = status
  loading.status = false
}

async function requestModels() {
  const models = await settingsStore.requestOllamaApi('/api/tags', 'GET')

  if (models?.models) {
    modelsCount.value = models.models.length
  }
  loading.models = false
}

const showRefreshButton = computed(() => {
  const noOllama = !loading.status && !ollamaStatus.value
  const noModels = !loading.models && modelsCount.value === 0
  return noOllama || noModels
})

function getStarted() {
  store.updateOnboardingViewed()
}

onMounted(() => {
  requestStatus()
  requestModels()
})
</script>

<template>
  <div class="onboarding-container">
    <h2>Before you start</h2>
    <p class="muted">Ollama needs to be installed and running on your computer</p>
    <div class="onboarding-features">
      <div class="onboarding-features__header">
        <div class="dimmer-muted">Status</div>
        <div v-if="showRefreshButton" class="onboarding-features__header--refresh" @click="refresh">
          <RefreshIcon /> Refresh
        </div>
      </div>
      <p v-if="loading.status" class="muted">Checking Ollama instance...</p>
      <p v-else>
        <span v-if="ollamaStatus" class="green-text"><CheckIcon /> Ollama is running</span>
        <span v-else class="red-text"><CloseIcon /> Ollama is not detected</span>
      </p>
      <p v-if="loading.models" class="muted">Checking installed models...</p>
      <p v-else>
        <span v-if="!ollamaStatus" class="red-text"><CloseIcon /> No models installed</span>
        <span v-else-if="modelsCount === 0" class="yellow-text">
          <AlertTriangleIcon /> 0 models installed
        </span>
        <span v-else class="green-text">
          <CheckIcon /> {{ modelsCount }}
          {{ modelsCount === 1 ? 'model' : 'models' }} installed</span
        >
      </p>
    </div>
    <template v-if="showRefreshButton">
      <template v-if="!ollamaStatus">
        <p class="muted">Ollama was not detected on your device.</p>
        <p class="muted">Please, install it and click the refresh button.</p>
      </template>
      <template v-else>
        <p class="muted">Ollama is detected, but no models installed.</p>
        <p class="muted">
          Please, follow our guide to install model on your device and then click the refresh
          button.
        </p>
      </template>
      <a
        href="https://github.com/kirillmelcin96/kiang#%EF%B8%8F-before-you-start"
        target="_blank"
        class="button-link"
        style="margin-top: 12px"
      >
        Installation guide
      </a>
    </template>
    <template v-else>
      <p class="muted">Ollama is detected. You can start your first chat!</p>
      <button class="onboarding-continue-button" @click="getStarted">
        Get started <ArrowRightIcon />
      </button>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
