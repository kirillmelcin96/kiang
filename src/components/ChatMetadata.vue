<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useChatStore } from '../stores/chatStore';
import DateTimeFormat from './utils/DateTimeFormat.vue';
import type { Chat } from '../types/messages'

const store = useChatStore()
const metadata = ref<Chat>()

async function requestMetadata() {
    const result = await store.getChatMetadata(store.chatId || 0);
    metadata.value = result;
}

onMounted(() => {
    requestMetadata()
});

watch(
    () => store.chatId,
    () => requestMetadata()
)
</script>

<template>
    <!-- <div v-if="metadata && metadata.messages.length !== 1" class="chat-metadata-bubble">
        <h3>{{ metadata.title }}</h3>
        <p><span class="muted">Model</span> {{ metadata.model }}</p>
        <p><span class="muted">Created </span> {{ metadata.createdAt }}</p>
    </div> -->
    <div v-if="metadata && metadata.messages.length !== 1" class="timestamp">
        <DateTimeFormat class="muted" :timestamp="metadata.createdAt" style="user-select: all;"/>
        <div class="model-bubble">{{ metadata.model }}</div>
    </div>
</template>

<style lang="scss" scoped>
.timestamp {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 14px;
    margin-bottom: 32px;
}

.model-bubble {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 8px;
    margin-left: 8px;
    // border: 1px solid #ffffff10;
    background-color: #272727;
    font-weight: 500;
    user-select: all;
    // color: #e4e4e4;
}

.chat-metadata-bubble {
    background-color: #ffffff10;
    padding: 20px;
    border-radius: 12px;
    width: 100%;
    max-width: 350px;
    margin: 0 auto 48px;
    text-align: center;
    border: 1px solid #ffffff15;

    h3 {
        margin-top: 0;
        font-family: "Roboto Condensed", sans-serif;
    }

    p {
        margin: 4px;
        font-size: 14px;
    }
}
</style>