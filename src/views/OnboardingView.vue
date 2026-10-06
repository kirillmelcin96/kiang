<script lang="ts" setup>
import { ref } from 'vue'
import AppInfo from '../components/onboarding/AppInfo.vue'
import CheckOllama from '../components/onboarding/CheckOllama.vue'

const nextStep = ref(false)
</script>

<template>
  <AppInfo v-if="!nextStep" @next-step="nextStep = true" />
  <CheckOllama v-else />
</template>
