<script lang="ts" setup>
import { ref, nextTick, onMounted, useTemplateRef, computed } from 'vue'
import IconArrowUp from '../icons/ArrowUp.vue'
import IconStop from '../icons/Stop.vue'
import IconBrain from '../icons/Brain.vue'
import { useChatStore } from '../stores/chatStore'

const store = useChatStore()
const request = ref('')
const ta = useTemplateRef<HTMLTextAreaElement>('ta')

const resize = async () => {
  await nextTick()

  if (ta.value !== null) {
    ta.value.style.height = 'auto'
    ta.value.style.height = ta.value.scrollHeight + 'px'
  }
}

const getModelName = computed(() => {
    if (store.model.includes(':')) {
        return `${store.model.split(':')[0]} (${store.model.split(':')[1]})`
    }
    return store.model
})

function clearInputAndSend() {
    if (store.isLoading || request.value === '') return
    store.sendMessage(request.value)
    request.value = ''
    resize()
}

function breakGeneration() {
    store.breakMessage()
}

function changeThinkMode() {
    if (store.isLoading) return
    store.switchThinkMode()
}

onMounted(resize)
</script>

<template>
    <div class="main-input-group">
        <textarea
            ref="ta"
            v-model="request"
            class="textarea"
            rows="1"
            @input="resize"
            @keyup.ctrl.enter="clearInputAndSend"
            placeholder="Type something..."
            autocomplete="off" 
            autocorrect="off" 
            autocapitalize="off" 
            spellcheck="false"
        ></textarea>
        <div class="main-input-group__bottom">
            <div 
                v-if="store.model !== ''"
                class="main-input-group__model"
            >
                {{ getModelName }}
            </div>
            <div 
                class="main-input-group__think"
                :class="{'main-input-group__think--on': store.thinkMode}"
                @click="changeThinkMode"
            >
                <IconBrain />
                {{ store.thinkMode ? 'Thinking' : 'No thinking' }}
            </div>
            <div 
                v-if="!store.isLoading"
                class="main-input-group__send"
                @click="clearInputAndSend"
            >
                <IconArrowUp />
            </div>
            <div 
                v-else
                class="main-input-group__send main-input-group__send--break"
                @click="breakGeneration"
            >
                <IconStop />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.main-input-group {
    position: fixed;
    bottom: 24px;
    width: 100%;
    max-width: 776px;
    z-index: 1000;
    border-radius: 22px;
    border: 1px solid #3a3a3a;
    padding: 8px 16px;
    background-color: #272727;
    box-shadow: 0 -1px 24px -8px rgba(0,0,0,0.7);

    textarea {
        resize: none;
        width: calc(100% - 28px);
        max-height: 350px;
        outline: none;
        border: none;
        background-color: transparent;
        font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
        margin-top: 4px;
        margin-bottom: 36px;

        &::placeholder {
            color: #8d8d8d;
        }
    }

    &__bottom {
        height: 32px;
        position: absolute;
        bottom: 7px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding-right: 8px;
    }

    &__model {
        height: 32px;
        border-radius: 32px;
        font-size: 14px;
        color: #ffffff90;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &__think {
        height: 32px;
        border-radius: 32px;
        padding: 0 12px;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        color: #ffffff80;
        background-color: #ffffff20;
        transition: .25s;
        user-select: none;

        &--on {
            color: #20ff3a;
            background-color: #20ff3a30;
        }

        &:hover {
            opacity: .8;
        }

        svg {
            width: 18px;
            height: 18px;
        }
    }

    &__send {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        color: white;
        background-color: #4578de;
        cursor: pointer;
        transition: .25s;

        &--break {
            color: #ff2020;
            background-color: #ff202030;
        }

        &:hover {
            opacity: .8;
        }

        svg {
            width: 18px;
            height: 18px;
        }
    }
}

@media screen and (min-width: 769px) and (max-width: 1060px) {
    .main-input-group {
        left: 272px;
        width: calc(100% - 284px);
    }
}

@media screen and (max-width: 768px) {
    .main-input-group {
        left: 12px;
        width: calc(100% - 24px);
    }
}
</style>