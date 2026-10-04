<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useChatStore } from '../stores/chatStore'
import ChevronDown from '../icons/SelectorVertical.vue'
import ModelsSelectorItem from './ModelsSelectorItem.vue'
import { shortModelName } from '../utils/general'

const store = useChatStore()
const isSelectorOpened = ref(false)

onMounted(() => {
  store.getLocalModels()
})

function changeModel(model: string) {
  isSelectorOpened.value = false
  store.model = model
}

function switchSelector() {
  if (!store.model) return
  isSelectorOpened.value = !isSelectorOpened.value
}
</script>

<template>
  <div class="dropdown">
    <div v-if="store.model" class="dropdown-button" @click="switchSelector">
      <span>{{ shortModelName(store.model) }}<ChevronDown /></span>
    </div>
    <div v-else class="no-models muted">
      <p>No models detected</p>
      <p>Please, check <a @click="store.openSettings">Ollama Instance settings</a></p>
    </div>
    <div v-if="isSelectorOpened" class="dropdown-list">
      <ModelsSelectorItem
        v-for="model in store.availableModels"
        :key="model.name"
        class="dropdown-list__item"
        :model="model"
        @change-model="changeModel"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dropdown {
  position: relative;
}

.dropdown-button {
  text-decoration: underline dashed;
  text-underline-offset: 4px;
  cursor: pointer;
  transform: translateX(11px);
  color: var(--muted-color);
  font-size: 18px;
  transition: var(--transition-speed-default);
  text-align: center;

  &:hover {
    color: var(--button-modelselector-hover);
  }

  svg {
    width: 22px;
    height: 22px;
    margin-bottom: -5px;
    margin-left: -1px;
  }
}

.dropdown-list {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: calc(100% + 10px);
  padding: 4px 4px;
  border-radius: 12px;
  background-color: var(--button-chatsbar-background);
  border: 1px solid var(--border-color);
  box-shadow: var(--card-shadow);
  min-width: 420px;
}

.no-models {
  font-size: 18px;
  text-align: center;

  p {
    margin: 0;
  }

  a {
    cursor: pointer;
  }
}
</style>
