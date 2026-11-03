<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import debounce from 'lodash.debounce'
import ChevronLeft from '../icons/ChevronLeft.vue'
import { useChatStore } from '../stores/chatStore.ts'
import ProviderSelector from '../components/models/ProviderSelector.vue'
import type { ModelsProvider, SearchModel } from '../types/api.ts'
import ModelsSearch from '../components/models/ModelsSearch.vue'
import { useModelsStore } from '../stores/modelsStore.ts'
import ProviderModelItem from '../components/models/ProviderModelItem.vue'

const store = useChatStore()
const modelsStore = useModelsStore()

const provider = ref<ModelsProvider>('hf')
const searchField = ref<string>('')
const isSearching = ref<boolean>(true)
const searchResults = ref<SearchModel[]>()

function changeProvider(newProvider: ModelsProvider) {
  provider.value = newProvider
}

const startSearch = debounce(() => {}, 1000)

async function fetchTrending() {
  searchResults.value = await modelsStore.getTrendingHF()
  isSearching.value = false
}

onMounted(() => {
  fetchTrending()
})
</script>

<template>
  <div class="chat-list-container">
    <button style="margin-right: auto" @click="store.openModels">
      <ChevronLeft style="margin: 2px 2px 0 -4px" /> Back to models
    </button>
    <h3 class="add-model-header">Choose a provider:</h3>
    <ProviderSelector :provider="provider" @change-provider="changeProvider" />
    <ModelsSearch
      v-model="searchField"
      placeholder="Search models by name or link..."
      style="margin-bottom: 20px"
      @update:model-value="startSearch"
    />
    <ProviderModelItem
      v-for="res in searchResults"
      :key="res.name + '/' + res.author"
      :name="res.name"
      :author="res.author"
      :downloads="res.downloads"
      :likes="res.likes"
    />
  </div>
</template>

<style lang="scss" scoped>
.add-model-header {
  margin: 12px 0 12px;
}

.provider-chooser {
  width: auto;
  margin-right: auto;
  display: inline-flex;
  gap: 4px;
  border-radius: var(--radius-md);
  padding: 4px;
  background-color: var(--body-background);

  &__item {
    padding: 6px 12px;
    cursor: pointer;
    transition: var(--transition-speed-default);
    font-size: var(--font-sm);
    font-weight: var(--font-bold);
    border-radius: var(--radius-sm);

    &:hover {
      color: var(--body-text-color);
    }

    &--active {
      background-color: var(--button-default-background);
      color: var(--body-text-color);
    }
  }
}
</style>
