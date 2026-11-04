<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import debounce from 'lodash.debounce'
import ChevronLeft from '../icons/ChevronLeft.vue'
import { useChatStore } from '../stores/chatStore.ts'
import ProviderSelector from '../components/models/ProviderSelector.vue'
import type { ModelsProvider, SearchModel } from '../types/api.ts'
import ModelsSearch from '../components/models/ModelsSearch.vue'
import { useModelsStore } from '../stores/modelsStore.ts'
import ProviderModelItem from '../components/models/ProviderModelItem.vue'
import ProviderSearchStatus from '../components/models/ProviderSearchStatus.vue'

const store = useChatStore()
const modelsStore = useModelsStore()

const provider = ref<ModelsProvider>('hf')
const searchField = ref<string>('')
const isSearching = ref<boolean>(true)
const searchResults = ref<SearchModel[]>()
const trendingResults = ref<SearchModel[]>() // For cache

function changeProvider(newProvider: ModelsProvider) {
  provider.value = newProvider
}

const fetchingSearch = debounce(async () => {
  searchResults.value = await modelsStore.searchHF(searchField.value)
  isSearching.value = false
}, 1100)

async function startSearch() {
  // In case when user clears the search field
  if (searchField.value === '') {
    isSearching.value = false
    searchResults.value = trendingResults.value // Cached value

    fetchingSearch.cancel() // Canceling debounce
    return
  }

  isSearching.value = true
  // searchResults.value = []

  fetchingSearch()
}

async function fetchTrending() {
  searchResults.value = await modelsStore.getTrendingHF()
  trendingResults.value = searchResults.value
  isSearching.value = false
}

const searchingStatus = computed(() => {
  if (isSearching.value) return 'loading'
  else if (searchField.value && !isSearching.value) {
    if (!searchResults.value?.length) return 'no-results' // 0 models found
    return 'results'
  }
  return 'trending'
})

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
    <ProviderSearchStatus :status="searchingStatus" />
    <div :class="{ 'active-search-item': isSearching }">
      <ProviderModelItem
        v-for="res in searchResults"
        :id="res.id"
        :key="res.name + '/' + res.author"
        :provider="provider"
        :name="res.name"
        :author="res.author"
        :downloads="res.downloads"
        :likes="res.likes"
      />
    </div>
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

.active-search-item {
  transition: var(--transition-speed-default);
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
