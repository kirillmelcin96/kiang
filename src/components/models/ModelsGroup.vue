<script lang="ts" setup>
import { ref } from 'vue'
import ChevronDown from '../../icons/ChevronDown.vue'
import RotatingLoading from '../common/RotatingLoading.vue'

const showGroup = ref(true)

const props = defineProps({
  title: {
    type: String,
    default: 'Title',
  },
  count: {
    type: Number,
    default: 0,
  },
  reload: Boolean,
})
</script>

<template>
  <div class="models-group">
    <div class="models-group-header" @click="showGroup = !showGroup">
      <ChevronDown
        class="models-group-header__chevron"
        :class="{ 'models-group-header__chevron--hide': !showGroup }"
      />
      <div class="models-group-header__text">{{ props.title }}</div>
      <div class="models-group-header__count">
        <RotatingLoading v-if="reload" />
        <span v-else>{{ props.count }}</span>
      </div>
    </div>
    <div v-if="showGroup" class="models-group__content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.models-group {
  margin: 24px 0 0;
}

.models-group-header {
  width: 100%;
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
  cursor: pointer;
  user-select: none;

  &__chevron {
    color: var(--muted-color);
    margin-top: 4px;
    transition: var(--transition-speed-default);

    &--hide {
      transform: rotateZ(-90deg);
    }
  }

  &__text {
    color: var(--muted-color);
    font-weight: var(--font-bold);
  }

  &__count {
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    background-color: var(--card-background);
    font-size: var(--font-sm);
    color: var(--muted-color);
    font-weight: var(--font-bold);
  }
}
</style>
