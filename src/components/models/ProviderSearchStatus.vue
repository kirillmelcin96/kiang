<script lang="ts" setup>
import { computed } from 'vue'
import TrendingArrowIcon from '../../icons/TrendingArrow.vue'
import SearchIcon from '../../icons/Search.vue'
import SearchNoneIcon from '../../icons/SearchNone.vue'
import RotatingLoadingIcon from '../common/RotatingLoading.vue'

const props = defineProps<{
  status: 'loading' | 'results' | 'trending' | 'no-results'
}>()

const statuses = {
  trending: {
    icon: TrendingArrowIcon,
    text: 'Trending models',
  },
  loading: {
    icon: RotatingLoadingIcon,
    text: 'Searching...',
  },
  results: {
    icon: SearchIcon,
    text: 'Search results',
  },
  'no-results': {
    icon: SearchNoneIcon,
    text: 'No models found',
  },
}

const currentStatus = computed(() => {
  return statuses[props.status]
})
</script>

<template>
  <div class="provider-status"><component :is="currentStatus.icon" /> {{ currentStatus.text }}</div>
</template>

<style lang="scss" scoped>
.provider-status {
  color: var(--muted-color);
  font-weight: var(--font-bold);
  margin-bottom: 12px;
  user-select: none;

  svg {
    margin-bottom: -6px;
    margin-right: 4px;
    width: 22px;
    height: 22px;
  }
}
</style>
