<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useSettingsStore } from '../../stores/settingsStore';
import type { SettingsKey } from '../../stores/settingsStore';

const settingsStore = useSettingsStore()

const props = defineProps<{
    title: string,
    setting: SettingsKey
}>()

// AI-ASSISTED (ChatGPT): Helped with get/set function
const value = computed({
    get() {
        return settingsStore[props.setting]
    },

    set(newValue) {
        settingsStore.updateSetting(props.setting, newValue)
    },
})
</script>

<template>
    <div class="edit-textarea">
        <textarea 
            v-model="value"
            rows="10" 
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off" 
            spellcheck="false"
            maxlength="2500"
            :placeholder="title"
        ></textarea>
    </div>
</template>

<style lang="scss" scoped>
.edit-textarea {
    padding: 12px 16px;

    textarea {
        width: 100%;
        resize: none;
        outline: none;
        border: none;
        background-color: transparent;
        font-family: "Roboto", system-ui, Avenir, Helvetica, Arial, sans-serif;
    }

    textarea::placeholder {
        opacity: 1;
        color: #ffffff60;
    }
}
</style>