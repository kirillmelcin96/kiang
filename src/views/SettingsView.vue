<script lang="ts" setup>
import SettingsIcon from '../icons/Settings.vue'
import GroupWrapper from '../components/settings/GroupWrapper.vue'
import type { SettingsGroup } from '../types/settings.ts'
import { ref } from 'vue'

// Settings components
import OllamaStatus from '../components/settings/ollama/Status.vue'
import OllamaInformation from '../components/settings/ollama/Information.vue'
import EditInput from '../components/settings/EditInput.vue'

const settingsGroups = ref<SettingsGroup[]>([
    {
        id: 'ollama-status',
        title: 'Ollama Instance',
        type: 'group',
        parameters: [
            {
                title: 'Status',
                description: 'Shows if Ollama is detected on your PC and running',
                component: OllamaStatus,
            },
            {
                title: 'Ollama Version',
                component: OllamaInformation,
                props: {
                    endpoint: '/api/version',
                    method: 'GET',
                    targetKey: 'version',
                }
            },
            {
                title: 'Available Models',
                description: 'List of installed models on your PC',
                component: OllamaInformation,
                props: {
                    endpoint: '/api/tags',
                    method: 'GET',
                    targetKey: 'models',
                }
            },
            {
                title: 'Active Models',
                description: 'Models that are currently loaded into RAM/vRAM',
                component: OllamaInformation,
                props: {
                    endpoint: '/api/ps',
                    method: 'GET',
                    targetKey: 'models',
                }
            },
            {
                title: 'Ollama API URL',
                description: 'URL where Ollama is running. Default: http://localhost:11434',
                component: EditInput,
                props: {
                    setting: 'ollamaApiUrl'
                }
            }
        ],
    },
    // {
    //     id: 'customization',
    //     title: 'Customization',
    //     type: 'textarea',
    //     parameters: [
    //         {
    //             title: 'Type',
    //         }
    //     ],
    // }
])
</script>

<template>
    <div class="settings-container">
        <h1><SettingsIcon />Settings</h1>
        <GroupWrapper 
            v-for="group in settingsGroups"
            :id="group.id"
            :title="group.title"
            :type="group.type"
            :parameters="group.parameters"
        />
    </div>
</template>

<style lang="scss" scoped>
@keyframes settings-icon {
    from { transform: rotateZ(0deg); }
    to { transform: rotateZ(180deg); }
}

.settings-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 24px 12px 24px 12px;

  h1 {
    user-select: none;

    svg {
        margin-bottom: -4px;
        margin-right: 4px;

        &:hover {
            animation: settings-icon .5s infinite linear;
        }
    }
  }
}
</style>