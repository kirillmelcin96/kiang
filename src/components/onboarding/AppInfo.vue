<script lang="ts" setup>
import ArrowRightIcon from '../../icons/ArrowRight.vue'

const emit = defineEmits(['next-step'])
</script>

<template>
  <div class="onboarding-container">
    <img src="/images/128x128@2x.png" alt="" class="onboarding-container__icon" />
    <h1>Welcome to Kiang</h1>
    <p class="muted">A lightweight UI for Ollama</p>
    <div class="onboarding-features">
      <p>- Chat with AI models locally</p>
      <p>- No telemtry, no ads</p>
      <p>- Your chats belongs only to you</p>
      <p>- Completely free and open-source</p>
    </div>
    <button class="onboarding-continue-button" @click="emit('next-step')">
      Continue <ArrowRightIcon />
    </button>
  </div>
</template>

<style lang="scss" scoped></style>
