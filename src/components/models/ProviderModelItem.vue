<script lang="ts" setup>
import { formatBigNumbers } from '../../utils/units.ts'
import type { SearchModel } from '../../types/api'
import DownloadIcon from '../../icons/Download.vue'
import LikeIcon from '../../icons/Like.vue'

const props = defineProps<SearchModel>()
</script>

<template>
  <div class="provider-model-item">
    <div class="provider-model-item__title">
      <b>{{ props.name }}</b>
      <div>
        <span v-if="props?.downloads" class="muted provider-model-item__stats">
          <DownloadIcon /> {{ formatBigNumbers(props.downloads) }}
        </span>
        <span v-if="props?.likes" class="muted provider-model-item__stats">
          <LikeIcon /> {{ formatBigNumbers(props.likes) }}
        </span>
      </div>
    </div>
    <div class="provider-model-item__author">by {{ props.author }}</div>
  </div>
</template>

<style lang="scss" scoped>
.provider-model-item {
  padding: 8px 12px;
  //   border-bottom: 1px solid var(--divider-color);
  background-color: var(--card-background);
  border: var(--card-border);
  border-radius: var(--radius-md);
  margin-bottom: 12px;
  user-select: none;
  cursor: pointer;

  svg {
    margin-bottom: -1px;
    margin-right: 0;
  }

  &__title {
    display: flex;
    justify-content: space-between;
  }

  &__stats {
    font-size: var(--font-sm);
    margin: 0 0 0 12px;
  }

  &__author {
    color: var(--muted-color);
  }

  &:hover {
    b {
      text-decoration: underline dashed;
      text-underline-offset: 4px;
    }
  }
}
</style>
