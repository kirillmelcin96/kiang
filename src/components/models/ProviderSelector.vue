<script lang="ts" setup>
import HuggingFaceLogo from '../../icons/HuggingFaceLogo.vue'
import OllamaLogo from '../../icons/OllamaLogo.vue'
import type { ModelsProvider } from '../../types/api.ts'

const props = defineProps<{
  provider: 'hf' | 'ollama'
}>()

const emit = defineEmits<{
  'change-provider': [value: ModelsProvider]
}>()

function changeProvider(provider: ModelsProvider) {
  emit('change-provider', provider)
}
</script>

<template>
  <div class="provider-chooser">
    <div
      class="provider-chooser__item"
      :class="{ 'provider-chooser__item--active': props.provider === 'hf' }"
      @click="changeProvider('hf')"
    >
      <HuggingFaceLogo />
      Hugging face
    </div>
    <div
      class="provider-chooser__item"
      :class="{ 'provider-chooser__item--active': props.provider === 'ollama' }"
      @click="changeProvider('ollama')"
    >
      <OllamaLogo />
      Ollama
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
    user-select: none;

    &:hover {
      color: var(--body-text-color);
    }

    &--active {
      background-color: var(--button-default-background);
      color: var(--body-text-color);
    }

    svg {
      width: 18px;
      height: 18px;
      margin-bottom: -3px;
      margin-right: 4px;
    }
  }
}
</style>
