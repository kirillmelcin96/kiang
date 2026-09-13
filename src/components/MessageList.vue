<script lang="ts" setup>
import { useChatStore } from '../stores/chatStore';
import MessageBubble from './MessageBubble.vue';
import ChatMetadata from './ChatMetadata.vue';
import RandomGreeting from './RandomGreeting.vue';
import IncognitoIcon from '../icons/Incognito.vue'
import IncognitoFillIcon from '../icons/IncognitoFill.vue'
import LoadingIcon from '../icons/Loading.vue'
import 'highlight.js/styles/github-dark.css' // любой стиль

const store = useChatStore()

function incognitoButtonHandle() {
    store.switchIncognitoMode()
}
</script>

<template>
    <template v-if="store.messages.length === 0">
        <div class="incognito-button" @click="incognitoButtonHandle">
            <IncognitoIcon v-show="!store.incognitoMode" />
            <IncognitoFillIcon v-show="store.incognitoMode" />
        </div>
        <RandomGreeting />
    </template>
    <template v-else>
        <ChatMetadata />
        <MessageBubble 
            v-for="msg in store.messages"
            :content="msg.content"
            :role="msg.role"
        />
        <div v-if="store.isLoading && store.streamingMessage == ''" class="muted">
            <!-- TODO: Add mini-games while waiting -->
            <LoadingIcon class="loading-icon" />
            Generating response...
        </div>
        <div v-if="store.isError" class="error-text">
            Error while making the request. Please, try again
        </div>
        <MessageBubble 
            v-if="store.streamingMessage"
            :role="'assistant'"
            :content="store.streamingMessage"
        />
        <div class="scroll-spacer"></div>
    </template>
</template>

<style lang="scss" scoped>
.error-text {
    color: #f57474;
}

.scroll-spacer {
  height: 132px;
  flex-shrink: 0;
}

.incognito-button {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;

    svg {
        width: 20px;
        height: 20px;
    }
}
</style>