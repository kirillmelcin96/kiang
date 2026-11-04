<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { OllamaModel } from '../../types/api'
import DeleteIcon from '../../icons/Delete.vue'
import { bytesToGb, contextLengthToK } from '../../utils/units'
import MinusCircleDashedIcon from '../../icons/MinusCircleDashed.vue'
import BasicTooltip from '../common/BasicTooltip.vue'
import CopyInBuffer from '../../icons/CopyInBuffer.vue'
import Check from '../../icons/Check.vue'

const hover = ref(false)
const copied = ref(false)

const props = defineProps<{
  model: OllamaModel
  unload: boolean
}>()

const params = computed(() => {
  return {
    size: bytesToGb(props.model.size),
    parameters: props.model.details.parameter_size,
    quantization: props.model.details.quantization_level,
    contextLength: contextLengthToK(props.model.details?.context_length),
  }
})

async function copyModelName(name: string) {
  if (copied.value) return

  copied.value = true

  await navigator.clipboard.writeText(name ?? '')

  setTimeout(() => {
    copied.value = false
  }, 1500)
}

const copyTooltipText = computed(() => {
  if (copied.value) return 'Copied!'
  return 'Copy name'
})
</script>

<template>
  <div class="model-item" @mouseenter="hover = true" @mouseleave="hover = false">
    <div class="model-item__title">
      {{ props.model.name }}
      <div v-show="hover" class="model-item__title--buttons">
        <!-- Copy button -->
        <BasicTooltip :text="copyTooltipText">
          <Check v-show="copied" class="model-item__icon" />
          <CopyInBuffer
            v-show="!copied"
            class="model-item__icon"
            @click="copyModelName(props.model.name)"
          />
        </BasicTooltip>
        <!-- Remove from memory button -->
        <BasicTooltip text="Unload model from RAM">
          <MinusCircleDashedIcon v-if="props.unload" class="model-item__icon" />
        </BasicTooltip>
        <!-- Delete from disk button -->
        <BasicTooltip text="Delete model from disk">
          <DeleteIcon class="model-item__icon model-item__icon--delete" />
        </BasicTooltip>
      </div>
    </div>
    <div class="model-item__params">
      Size: {{ params.size }} • Parameters: {{ params.parameters }} • Quantization:
      {{ params.quantization }} • Context Length: {{ params.contextLength }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.model-item {
  padding: 8px 12px;
  //   border-bottom: 1px solid var(--divider-color);
  background-color: var(--card-background);
  border: var(--card-border);
  border-radius: var(--radius-md);
  margin-bottom: 12px;

  &__icon {
    transition: var(--transition-speed-default);
    cursor: pointer;
    margin: 0 4px -2px;
    color: var(--muted-color);

    &:hover {
      color: var(--body-text-color);
    }

    // Delete icon exception
    &--delete {
      opacity: 0.6;
      color: var(--main-color-red);

      &:hover {
        opacity: 1;
        color: var(--main-color-red);
      }
    }
  }

  &__title {
    width: 100%;
    font-weight: var(--font-bold);

    &--buttons {
      display: inline-block;
    }
  }

  &__params {
    color: var(--muted-color);
  }
}
</style>
