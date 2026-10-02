<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useSettingsStore } from '../../../stores/settingsStore.ts'
import LoadingIcon from '../../../icons/Loading.vue'

const settingsStore = useSettingsStore()
const isLoading = ref(true)
const ollamaStatus = ref(false)

async function requestStatus() {
  const status = await settingsStore.getOllamaStatus()

  ollamaStatus.value = status
  isLoading.value = false
}

watch(
  () => settingsStore.ollamaApiUrl,
  async () => requestStatus(),
)

onMounted(() => {
  requestStatus()
})
</script>

<template>
  <div class="settings-ollama-status">
    <span v-if="isLoading" class="muted">
      <LoadingIcon class="loading-icon" />
    </span>
    <span v-else-if="!isLoading && ollamaStatus" class="settings-ollama-status--ok"> Running </span>
    <span v-else-if="!isLoading && !ollamaStatus" class="settings-ollama-status--error">
      Not connected
    </span>
  </div>
</template>

<style lang="scss" scoped>
.settings-ollama-status {
  display: inline-block;
  border-radius: var(--radius-sm);
  font-weight: var(--font-bold);
  user-select: none;

  &--ok {
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    color: var(--main-color-green);
    background-color: var(--main-color-green-background);

    &:before {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      content: '';
      margin-right: 2px;
      margin-bottom: 1px;
      background-color: var(--main-color-green);
    }
  }

  &--error {
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    color: var(--main-color-red);
    background-color: var(--main-color-red-background);

    &:before {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      content: '';
      margin-right: 2px;
      margin-bottom: 1px;
      background-color: var(--button-error-color);
    }
  }
}
</style>
