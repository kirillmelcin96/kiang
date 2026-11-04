<script lang="ts" setup>
import { formatBigNumbers } from '../../utils/units.ts'
import type { SearchModel } from '../../types/api'
import DownloadIcon from '../../icons/Download.vue'
import LikeIcon from '../../icons/Like.vue'
import { useModelsStore } from '../../stores/modelsStore.ts'

const modelsStore = useModelsStore()

const props = defineProps<SearchModel>()

function selectModel() {
  modelsStore.openModal(props.id, props.provider)
}
</script>

<template>
  <div class="provider-model-item" @click="selectModel">
    <div class="provider-model-item__title">
      <b>{{ props.name }}</b>
      <div style="text-align: right">
        <div v-if="props?.downloads" class="muted provider-model-item__stats">
          <DownloadIcon /> {{ formatBigNumbers(props.downloads) }}
        </div>
        <div v-if="props?.likes" class="muted provider-model-item__stats">
          <LikeIcon /> {{ formatBigNumbers(props.likes) }}
        </div>
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

    b {
      max-width: calc(100% - 135px);
    }
  }

  &__stats {
    display: inline-block;
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
