<script lang="ts" setup>
import ArrowRightUp from '../../icons/ArrowRightUp.vue'

const props = defineProps({
  text: {
    type: String,
    default: 'Open',
  },
  link: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <a :href="props.link" target="_blank" class="settings-link-button">
    {{ props.text }}<ArrowRightUp class="settings-link-button__arrow" />
  </a>
</template>

<style lang="scss" scoped>
.settings-link-button {
  &__arrow {
    margin-bottom: -3px;
  }
}
</style>
