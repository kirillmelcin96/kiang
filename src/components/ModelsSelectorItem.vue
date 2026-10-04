<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { OllamaModel } from '../types/api'
import { bytesToGb, contextLengthToK } from '../utils/units'
import { shortModelName } from '../utils/general'

const hovered = ref(false)

const props = defineProps<{
  model: OllamaModel
}>()

const emit = defineEmits<{
  'change-model': [value: string]
}>()

const modelName = computed(() => {
  if (hovered.value === false) {
    return shortModelName(props.model.name)
  }

  return props.model.name
})

const paramsString = computed(() => {
  const s = bytesToGb(props.model.size) // Size
  const p = props.model.details.parameter_size // Parameters
  const q = props.model.details.quantization_level // Quantization
  const cl = contextLengthToK(props.model.details?.context_length) // Context Length

  if (hovered.value === true) {
    return `Size: ${s} • Parameters: ${p} • Quantization: ${q} • Context Length: ${cl}`
  }

  return `S: ${s} • P: ${p} • Q: ${q} • CL: ${cl}`
})

function changeModel(model: string) {
  emit('change-model', model)
}
</script>

<template>
  <div
    class="dropdown-list__item"
    @click="changeModel(props.model.name)"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <p>{{ modelName }}</p>
    <p class="muted">
      {{ paramsString }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.dropdown-list__item {
  cursor: pointer;
  padding: 8px 10px;
  border-radius: 8px;
  user-select: none;

  p {
    margin: 0;
  }

  &:hover {
    background-color: var(--button-chatsbar-background-hover);
  }
}
</style>
