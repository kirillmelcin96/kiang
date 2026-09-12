<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useSettingsStore } from '../../../stores/settingsStore.ts'
import LoadingIcon from '../../../icons/Loading.vue'

const settingsStore = useSettingsStore()
const isLoading = ref(true)
const ollamaStatus = ref(false)

async function requestStatus() {
    const status = await settingsStore.getOllamaStatus()

    ollamaStatus.value = status
    isLoading.value = false
}

watch(
    () => settingsStore.ollamaApiUrl,
    async () => requestStatus()
)

onMounted(() => {
    requestStatus()
})
</script>

<template>
    <div class="settings-ollama-status">
        <span v-if="isLoading" class="muted">
            <LoadingIcon class="loading-icon" />
        </span>
        <span v-else-if="!isLoading && ollamaStatus" class="settings-ollama-status--ok">
            Running
        </span>
        <span v-else-if="!isLoading && !ollamaStatus" class="settings-ollama-status--error">
            Not connected
        </span>
    </div>
</template>

<style lang="scss" scoped>
.settings-ollama-status {
    display: inline-block;
    // font-weight: 500;
    // font-size: 15px;

    &--ok {
        color: #20ff3a;

        &:before {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            content: "";
            margin-right: 2px;
            margin-bottom: 1px;
            background-color: #20ff3a;
        }
    }

    &--error {
        color: #ff4e4e;

        &:before {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            content: "";
            margin-right: 2px;
            margin-bottom: 1px;
            background-color: #ff4e4e;
        }
    }
}
</style>