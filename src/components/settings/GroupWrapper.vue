<script lang="ts" setup>
import type { SettingsGroup } from '../../types/settings.ts'

const props = defineProps<SettingsGroup>()
</script>

<template>
  <div class="settings-group">
    <div v-if="props.title" class="settings-group__title dimmer-muted">{{ props.title }}</div>
    <div v-if="props.type === 'group'" class="settings-group-container">
      <div
        v-for="parameter in props.parameters"
        :key="parameter.title"
        class="settings-group-parameter"
        :class="{ 'settings-group-parameter--fulsize': parameter?.fullsize }"
      >
        <div class="settings-group-parameter__info">
          <div class="settings-group-parameter__title">
            {{ parameter.title }}
          </div>
          <div class="settings-group-parameter__description muted">
            {{ parameter.description }}
          </div>
        </div>
        <div class="settings-group-parameter__control">
          <template v-if="parameter.component">
            <component :is="parameter.component" v-bind="parameter.props"></component>
          </template>
        </div>
      </div>
    </div>

    <div v-else-if="props.type === 'textarea'" class="settings-group-container">
      <template v-for="parameter in props.parameters" :key="parameter.title">
        <component :is="parameter.component" v-bind="parameter.props"></component>
      </template>
    </div>

    <div v-if="props.footer" class="settings-group__footer dimmer-muted">
      {{ props.footer }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-group {
  margin-top: 24px;

  &:first-of-type {
    margin-top: 0;
  }

  &__container {
    margin: 4px 0;
  }

  &__title {
    padding-left: 12px;
    font-weight: 600;
    font-size: var(--font-sm);
    user-select: none;
  }

  &__footer {
    padding: 0 12px;
    font-size: var(--font-sm);
    user-select: none;
  }
}

.settings-group-container {
  width: 100%;
  margin: 4px 0 8px;
  border-radius: var(--radius-md);
  border: var(--card-border);
  background-color: var(--card-background);
  box-shadow: var(--card-shadow);

  .settings-group-parameter:last-child {
    border-bottom: 0;
  }
}

.settings-group-parameter {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: var(--card-border);
  min-height: 62px;
  font-size: 15px;
  gap: 8px;

  &__info {
    flex-grow: 1;
  }

  &__title {
    font-weight: var(--font-bold);
    user-select: none;
  }

  &__description {
    font-size: var(--font-sm);
    user-select: none;
  }

  &__control {
    display: flex;
    justify-content: flex-end;
    gap: 4px;
    width: 280px;
  }

  &--fulsize {
    flex-direction: column;
    justify-content: left;
    align-items: baseline;

    .settings-group-parameter__control {
      width: 100%;
      justify-content: flex-start;
    }
  }
}

@media screen and (max-width: 600px) {
  .settings-group-parameter {
    flex-direction: column;
    justify-content: left;
    align-items: baseline;

    &__control {
      width: 100%;
      justify-content: flex-start;
    }
  }
}
</style>
