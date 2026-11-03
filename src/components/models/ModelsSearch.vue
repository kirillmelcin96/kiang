<script lang="ts" setup>
const model = defineModel<string>({ required: true })

const props = withDefaults(defineProps<{ placeholder?: string }>(), {
  placeholder: 'Search models by name...',
})
</script>

<template>
  <div class="search-models-input-container">
    <input
      v-model="model"
      type="text"
      class="search-models-input"
      :placeholder="props.placeholder"
    />
    <!-- <button class="search-models-input__button">Search</button> -->
  </div>
</template>

<style lang="scss" scoped>
.search-models-input-container {
  width: 100%;
  display: flex;
  gap: 0px;
}

.search-models-input {
  flex-grow: 1;
  border: var(--card-border);
  padding: 8px 16px;
  background-color: var(--card-background);
  box-shadow: var(--card-shadow);
  // border-radius: var(--radius-md) 0px 0px var(--radius-md);
  border-radius: var(--radius-md);
  outline: none;
  font-family: var(--font-ui);
  font-size: var(--font-default);
  margin-top: 12px;

  &::placeholder {
    color: var(--textarea-placeholder);
  }
}

.search-models-input__button {
  color: var(--button-primary-color);
  background-color: var(--button-primary-background);
  border-color: var(--button-primary-background);
  font-weight: var(--font-bold);
  border-radius: 0px var(--radius-md) var(--radius-md) 0px;
}
</style>
