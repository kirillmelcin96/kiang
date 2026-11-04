<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useModelsStore } from '../stores/modelsStore.ts'
import ModelsSearch from '../components/models/ModelsSearch.vue'
import ModelsGroup from '../components/models/ModelsGroup.vue'
import ModelItem from '../components/models/ModelItem.vue'
import type { OllamaModel, OllamaModelRunning } from '../types/api.ts'
import PlusIcon from '../icons/Plus.vue'
import RefreshIcon from '../icons/Refresh.vue'
import { useChatStore } from '../stores/chatStore.ts'

const store = useChatStore()
const modelsStore = useModelsStore()

const installedModels = ref<OllamaModel[]>()
const runningModels = ref<OllamaModelRunning[]>()
const reload = ref<boolean>(true)

async function requestApi() {
  installedModels.value = []
  runningModels.value = []
  reload.value = true

  const installedModelsRequest = await modelsStore.requestOllamaApi('/api/tags', 'GET')
  installedModels.value = installedModelsRequest.models

  const runningModelsRequest = await modelsStore.requestOllamaApi('/api/ps', 'GET')
  runningModels.value = runningModelsRequest.models

  reload.value = false
}

/**
 * Simple search function for installed and running models
 */
function searchModels(searchQuery: string, list: OllamaModel[] | OllamaModelRunning[]) {
  const query = searchQuery.trim().toLowerCase()

  return list.filter((model) => model.name.toLowerCase().includes(query))
}

const filterInstalledModels = computed(() => {
  return searchModels(modelsStore.searchField, installedModels.value || [])
})

const filterRunningModels = computed(() => {
  return searchModels(modelsStore.searchField, runningModels.value || [])
})

onMounted(() => {
  requestApi()
})
</script>

<template>
  <div class="chat-list-container">
    <div class="chat-list-buttons__container">
      <button class="chat-list-buttons button-refresh-models" @click="requestApi">
        <RefreshIcon /> Reload
      </button>
      <button class="chat-list-buttons button-new-model" @click="store.openAddModel">
        <PlusIcon /> New Model
      </button>
    </div>
    <ModelsSearch v-model="modelsStore.searchField" />
    <ModelsGroup
      title="Installed Models"
      :count="filterInstalledModels?.length || 0"
      :reload="reload"
    >
      <ModelItem v-for="m in filterInstalledModels" :key="m.name" :model="m" :unload="false" />
    </ModelsGroup>
    <ModelsGroup title="Running Models" :count="filterRunningModels?.length || 0" :reload="reload">
      <ModelItem v-for="m in filterRunningModels" :key="m.name" :model="m" :unload="true" />
    </ModelsGroup>
  </div>
</template>

<style lang="scss" scoped>
.chat-list-buttons {
  display: inline-block;
  width: auto;
  padding: 8px 13px;
  font-weight: var(--font-bold);
  border-radius: var(--radius-md);

  svg {
    margin-bottom: -2px;
    margin-right: 2px;
  }

  &__container {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}

.button-new-model {
  color: var(--button-primary-color);
  background-color: var(--button-primary-background);
}
</style>
