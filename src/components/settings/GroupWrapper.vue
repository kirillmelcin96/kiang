<script lang="ts" setup>
import type { SettingsGroup } from '../../types/settings.ts'

const props = defineProps<SettingsGroup>()
</script>

<template>
    <div class="settings-group">
        <div class="settings-group__title muted">{{ props.title }}</div>
        <div v-if="props.type === 'group'" class="settings-group-container">
            <div v-for="parameter in props.parameters" class="settings-group-parameter">
                <div class="settings-group-parameter__info">
                    <div class="settings-group-parameter__title">
                        {{ parameter.title }}
                    </div>
                    <div class="settings-group-parameter__description muted">
                        {{ parameter.description }}
                    </div>
                </div>
                <div class="settings-group-parameter__control">
                    <template v-if="parameter.component">
                        <component :is="parameter.component" v-bind="parameter.props"></component>
                    </template>
                </div>
            </div>
        </div>

        <div v-else-if="props.type === 'textarea'" class="settings-group-container">
            <template v-for="parameter in props.parameters">
                <component :is="parameter.component" v-bind="parameter.props"></component>
            </template>
        </div>

        <div v-if="props.footer" class="settings-group__footer muted">
            {{ props.footer }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
.settings-group {
    margin-top: 24px;

    &:first-of-type {
        margin-top: 0;
    }

    &__container {
        margin: 4px 0;
    }

    &__title {
        padding-left: 16px;
        font-weight: 500;
    }

    &__footer {
        padding: 0 16px;
        font-size: 14px;
    }
}

.settings-group-container {
    width: 100%;
    margin: 4px 0 12px;
    border-radius: 16px;
    border: 1px solid #3a3a3a;
    background-color: #272727;
    box-shadow: 0 -1px 24px -8px rgba(0,0,0,0.7);

    .settings-group-parameter:last-child {
        border-bottom: 0;
    }
}

.settings-group-parameter {
    padding: 8px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #3a3a3a;
    min-height: 62px;

    &__info {
        flex-grow: 1;
    }

    &__title {
        font-weight: 500;
    }

    &__description {
        font-size: 14px;
    }

    &__control {
        display: flex;
        justify-content: flex-end;
        gap: 4px;
        width: 280px;
    }
}
</style>