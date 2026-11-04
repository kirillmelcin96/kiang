<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
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
</script>

<template>
  <div class="settings-ollama-info">
    <LoadingIcon v-if="isLoading" class="loading-icon" />
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
</style>
