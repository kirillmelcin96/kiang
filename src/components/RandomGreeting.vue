<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { greetings } from '../greetings'
import ModelsSelector from './ModelsSelector.vue';
import { useChatStore } from '../stores/chatStore';
import IncognitoFillIcon from '../icons/IncognitoFill.vue'

const randomGreeting = ref('')

onMounted(() => {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    randomGreeting.value = greetings[randomIndex]!
})

const store = useChatStore()
</script>

<template>
    <div class="greeting-block">
        <h1>{{ randomGreeting }}</h1>
        <ModelsSelector />
        <div v-if="store.incognitoMode" class="incognito-instruction">
            <div class="incognito-instruction__title">
                <IncognitoFillIcon />
                <b>Incognito Mode Enabled</b>
            </div>
            <span class="muted">This chat is temporary and won't be saved in the chat history</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.incognito-instruction {
    // background-color: #ffffff10;
    margin-top: 20px;
    border-radius: 12px;
    padding: 12px;
    border: 1px dashed #ffffff50;

    &__title {
        color: #ffc72c;
    }

    svg {
        width: 17px;
        height: 17px;
        margin-bottom: -3px;
        margin-right: 2px;
    }
}

.greeting-block {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
        text-align: center;
    }
}
</style>