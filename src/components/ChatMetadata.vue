<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useChatStore } from '../stores/chatStore'
import DateTimeFormat from './utils/DateTimeFormat.vue'
import IncognitoFillIcon from '../icons/IncognitoFill.vue'
import type { Chat } from '../types/messages'
import { shortModelName } from '../utils/general'

const store = useChatStore()
const metadata = ref<Chat>()

async function requestMetadata() {
  if (store.isLoading === true) return
  const result = await store.getChatMetadata(store.chatId || 0)
  metadata.value = result
}

onMounted(() => {
  requestMetadata()
})

watch([() => store.chatId, () => store.isLoading], () => requestMetadata())
</script>

<template>
  <div v-if="metadata && metadata.messages.length !== 1" class="timestamp">
    <DateTimeFormat class="muted" :timestamp="metadata.createdAt" style="user-select: all" />
    <div class="model-badge">{{ shortModelName(metadata.model, true) }}</div>
  </div>
  <div v-if="store.incognitoMode" class="incognito-mode-warning">
    <b><IncognitoFillIcon />Incognito Mode Enabled</b>
  </div>
</template>

<style lang="scss" scoped>
.timestamp,
.incognito-mode-warning {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  // margin-bottom: 16px;
}

.timestamp {
  font-size: 14px;
}

.incognito-mode-warning {
  color: var(--incognito-color);
  user-select: none;

  svg {
    width: 17px;
    height: 17px;
    margin-bottom: -3px;
    margin-right: 4px;
  }
}

.model-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  margin-left: 8px;
  // border: var(--border);
  background-color: var(--model-badge-background);
  font-weight: var(--font-bold);
  user-select: all;
  // color: #e4e4e4;
}
</style>
