<script lang="ts" setup>
import GroupWrapper from '../components/settings/GroupWrapper.vue'
import type { SettingsGroup } from '../types/settings.ts'
import { ref } from 'vue'

// Settings components
import OllamaStatus from '../components/settings/ollama/Status.vue'
import OllamaInformation from '../components/settings/ollama/Information.vue'
import EditInput from '../components/settings/EditInput.vue'
import EditTextarea from '../components/settings/EditTextarea.vue'
import AboutSection from '../components/settings/AboutSection.vue'
import RegularText from '../components/settings/RegularText.vue'
import LinkButton from '../components/settings/LinkButton.vue'

const selectedGroupId = ref('chat')
const settingGroups = [
    { id: 'chat', title: 'Chat' },
    { id: 'about', title: 'About' },
]

const settingsGeneral = ref<SettingsGroup[]>([
    {
        id: 'ollama-status',
        title: 'Ollama instance',
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
        ]
    },
    {
        id: 'system-prompt',
        title: 'System prompt',
        type: 'textarea',
        parameters: [
            {
                title: 'Enter system prompt here',
                component: EditTextarea,
                props: {
                    setting: 'systemPrompt'
                }
            }
        ],
        footer: 'Use system prompt to define role, behavior, tone, constraints, and output format of your model.'
    }
])

const settingsAbout = ref<SettingsGroup[]>([
    {
        id: 'kiang-version',
        type: 'group',
        parameters: [
            {
                title: 'App license',
                description: 'Kiang is free and open-source software',
                component: RegularText,
                props: {
                    text: 'Apache 2.0'
                }
            },
            {
                title: 'Found a bug?',
                component: LinkButton,
                description: 'Please fill out the form so we can fix it',
                props: {
                    text: 'Open',
                    link: 'https://github.com/kirillmelcin96/kiang/issues/new?template=bug_report.yml',
                }
            },
            {
                title: 'Have a feature request?',
                component: LinkButton,
                description: 'Please tell us what new features you\'d like to see in Kiang',
                props: {
                    text: 'Open',
                    link: 'https://github.com/kirillmelcin96/kiang/issues/new?template=feature_request.yml',
                }
            },
            {
                title: 'For other questions/requests',
                component: LinkButton,
                props: {
                    text: 'kerekerekerek@hotmail.com',
                    link: 'mailto:kerekerekerek@hotmail.com',
                }
            },
        ]
    }
])
</script>

<template>
    <div class="settings-container">
        <div class="settings-nav-container">
            <div class="settings-nav">
                <div 
                    v-for="group in settingGroups" 
                    @click="selectedGroupId = group.id"
                    class="settings-nav__button"
                    :class="{ 'settings-nav__button--active': selectedGroupId == group.id }"
                >
                    {{ group.title }}
                </div>
            </div>
        </div>

        <template v-if="selectedGroupId == 'chat'">
            <GroupWrapper 
                v-for="group in settingsGeneral"
                v-bind="group"
            />
        </template>

        <template v-if="selectedGroupId == 'about'">
            <AboutSection />
            <GroupWrapper 
                v-for="group in settingsAbout"
                v-bind="group"
            />
        </template>
    </div>
</template>

<style lang="scss" scoped>
.settings-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 24px 12px 24px 12px;
}

.settings-nav-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 12px 0;
}

.settings-nav {
    width: auto;
    display: inline-flex;
    gap: 4px;
    border-radius: 24px;
    padding: 4px;
    background-color: #0e0e0e;

    &__button {
        padding: 6px 32px;
        border-radius: 20px;
        cursor: pointer;
        transition: .25s;
        font-weight: 600;
        font-size: 15px;
        color: #ffffff60;

        &:hover {
            color: #ffffffde;
        }

        &--active {
            background-color: #212121;
            color: #ffffffde;
        }
    }
}
</style>