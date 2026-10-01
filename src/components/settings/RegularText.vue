<script lang="ts" setup>
const props = defineProps({
  text: {
    type: String,
    default: 'No data',
  },
})
</script>

<template>
  <span>{{ props.text }}</span>
</template>
