<script lang="ts" setup>
import { useAppUpdateStore } from '../stores/updateStore.ts'

const updateStore = useAppUpdateStore()
</script>

<template>
  <div class="update-available" @click="updateStore.showUpdateModal = true">
    Update is available
    <p class="update-available__version">v{{ updateStore.updateVersion }} · What's new?</p>
  </div>
</template>

<style lang="scss" scoped>
.update-available {
  margin-top: 12px;
  border-radius: var(--radius-md);
  font-weight: var(--font-bold);
  width: 100%;
  padding: 12px 8px;
  color: var(--button-update-color);
  cursor: pointer;
  text-align: center;
  background: var(--button-update-background);
  transition: var(--transition-speed-default);
  // border: 1px solid #ffffff10;
  // box-shadow: 0 -1px 24px -8px rgba(0,0,0,0.7);

  &:hover {
    padding: 16px 8px;
    // transform: translateY(-2px);
    color: var(--button-update-color-hover);
    background: var(--button-update-background-hover);
    box-shadow: var(--button-update-shadow);

    .update-available__version {
      color: var(--button-version-color-hover);
    }
  }

  &__version {
    margin: 0;
    padding: 0;
    margin-top: 4px;
    color: var(--button-version-color);
  }
}
</style>
