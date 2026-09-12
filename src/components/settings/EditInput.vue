<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue'
import { useSettingsStore } from '../../stores/settingsStore';
import type { SettingsKey } from '../../stores/settingsStore';
import EditPencilIcon from '../../icons/EditPencil.vue';
import CheckIcon from '../../icons/Check.vue';

const settingsStore = useSettingsStore()

const props = defineProps<{
    setting: SettingsKey
}>()

const settingValue = computed(() => {
    return settingsStore[props.setting].trim()
})

const isBeingEdited = ref(false)
const newValue = ref(settingValue.value)
const inputRef = ref<HTMLInputElement | null>()

async function editSetting() {
    newValue.value = settingValue.value
    isBeingEdited.value = true
    await nextTick()
    inputRef.value?.focus()
}

function saveSetting() {
    isBeingEdited.value = false
    settingsStore.updateSetting(props.setting, newValue.value)
}
</script>

<template>
    <div class="edit-setting">
        <template v-if="!isBeingEdited">
            <EditPencilIcon @click="editSetting" /> {{ settingValue }}
        </template>
        <template v-else>
            <CheckIcon @click="saveSetting"/> 
            <input 
                v-model="newValue"
                type="text" 
                maxlength="30" 
                autocomplete="off"
                autocorrect="off"
                @keyup.enter="saveSetting"
                @keyup.esc="isBeingEdited = false"
                ref="inputRef"
            />
        </template>
    </div>
</template>

<style lang="scss" scoped>
.edit-setting {
    svg {
        cursor: pointer;
        margin-bottom: -2px;
        margin-right: 2px;
        opacity: .6;
        transition: .25s;

        &:hover {
            opacity: 1;
        }
    }

    input[type=text] {
        font-family: "Roboto", system-ui, Avenir, Helvetica, Arial, sans-serif;
        field-sizing: content;
        background-color: #00000030;
        border: 0;
        // border-bottom: 2px solid #3a3a3a;
        border-radius: 8px;
        border: 1px solid #3a3a3a;
        font-size: 16px;
        margin: 0;
        padding: 4px 8px;
        margin-left: 4px;
        width: auto;
        height: auto;
        min-width: 20px;
        max-width: 260px;
        outline: none;
    }
}
</style>