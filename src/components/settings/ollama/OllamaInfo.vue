<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useSettingsStore } from '../../../stores/settingsStore.ts'
import LoadingIcon from '../../../icons/Loading.vue'

const settingsStore = useSettingsStore()
const isLoading = ref(true)
const isError = ref(false)
const ollamaResponse = ref()

const props = defineProps<{
  endpoint: string
  method: 'GET' | 'POST'
  targetKey: string
}>()

async function requestApi() {
  isLoading.value = true
  isError.value = false

  const res = await settingsStore.requestOllamaApi(props.endpoint, props.method)

  isLoading.value = false

  if (res === undefined) {
    ollamaResponse.value = 'No data'
    isError.value = true
    return
  }

  ollamaResponse.value = res[props.targetKey] ?? 'No data'
}

watch(
  () => settingsStore.ollamaApiUrl,
  async () => requestApi(),
)

onMounted(() => {
  requestApi()
})

const alignContentLeft = computed(() => {
  // TODO: rewrite this function to look better. Maybe the entire component, lol...
  return (
    ollamaResponse.value instanceof Array &&
    props.targetKey === 'models' &&
    ollamaResponse.value.length
  )
})
</script>

<template>
  <div
    class="settings-ollama-info"
    :class="{
      muted: isError || isLoading,
      'settings-ollama-info--content-left': alignContentLeft,
    }"
  >
    <LoadingIcon v-if="isLoading" class="loading-icon" />
    <template v-else-if="ollamaResponse instanceof Array && props.targetKey === 'models'">
      <!-- Ollama response is empty, meaning no models were found -->
      <span v-if="!ollamaResponse.length" class="muted"> No models </span>

      <!-- TODO: Create a button to unload model from memory -->
      <!-- Models were found, display them in separated blocks -->
      <div v-for="model in ollamaResponse as Object" v-else :key="model.name" class="model-name">
        {{ model.name }}
      </div>
    </template>
    <!-- Regular text response like Ollama's version -->
    <span v-else>{{ ollamaResponse }}</span>
  </div>
</template>

<style lang="scss" scoped>
.settings-ollama-info {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;

  &--content-left {
    justify-content: left;
  }
}

.model-name {
  font-size: 14px;
  font-weight: 500;
  padding: 3px 8px;
  cursor: default;
  background-color: #ffffff15;
  // border: 1px solid #3a3a3a;
  border-radius: 8px;
  overflow-wrap: break-all;
  word-break: break-word;
}
</style>
