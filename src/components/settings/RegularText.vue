<script lang="ts" setup>
const props = defineProps({
  text: String,
})
</script>

<template>
  <span>{{ props.text }}</span>
</template>
