<script setup lang="ts">
import { ref } from 'vue'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'

interface Props {
  text: string
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  delay: 220,
})

const trigger = ref<HTMLElement | null>(null)
const tooltip = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const { floatingStyles } = useFloating(trigger, tooltip, {
  placement: 'top',
  middleware: [offset(5), flip(), shift({ padding: 8 })],
  whileElementsMounted: autoUpdate,
})

let timeoutId: ReturnType<typeof setTimeout> | undefined

function showTooltip() {
  clearTimeout(timeoutId)

  timeoutId = setTimeout(() => {
    isOpen.value = true
  }, props.delay)
}

function hideTooltip() {
  clearTimeout(timeoutId)
  isOpen.value = false
}

function onBlur(event: FocusEvent) {
  const nextTarget = event.relatedTarget as Node | null

  if (nextTarget && trigger.value?.contains(nextTarget)) {
    return
  }

  hideTooltip()
}
</script>

<template>
  <span
    ref="trigger"
    tabindex="0"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
    @focus="showTooltip"
    @blur="onBlur"
    @keydown.esc="hideTooltip"
  >
    <slot />

    <Teleport to="body">
      <Transition name="tooltip">
        <div
          v-if="isOpen && text"
          ref="tooltip"
          class="tooltip"
          :style="floatingStyles"
          role="tooltip"
        >
          {{ text }}
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<style lang="scss" scoped>
.tooltip-trigger {
  display: inline-flex;
  align-items: center;
  width: fit-content;
}

.tooltip {
  z-index: 9999;
  max-width: 240px;
  padding: 7px 10px;

  color: #e5e5e5;
  background: #000;
  // border: var(--card-border);
  border-radius: var(--radius-sm);

  font-size: 12px;
  font-weight: 500;
  text-align: center;
  overflow-wrap: anywhere;

  pointer-events: none;
  box-shadow: var(--card-shadow);
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.18s;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}
</style>
