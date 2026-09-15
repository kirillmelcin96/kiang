<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useChatStore } from '../stores/chatStore';
import DateTimeFormat from './utils/DateTimeFormat.vue';
import IncognitoFillIcon from '../icons/IncognitoFill.vue'
import type { Chat } from '../types/messages'

const store = useChatStore()
const metadata = ref<Chat>()

async function requestMetadata() {
    if (store.isLoading === true) return
    const result = await store.getChatMetadata(store.chatId || 0);
    metadata.value = result;
}

onMounted(() => {
    requestMetadata()
});

watch(
    [() => store.chatId, () => store.isLoading],
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

.incognito-mode-warning{
    color: #ffc72c;

    svg {
        width: 17px;
        height: 17px;
        margin-bottom: -3px;
        margin-right: 4px;
    }
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
        font-family: var(--font-ui);
    }

    p {
        margin: 4px;
        font-size: 14px;
    }
}
</style>