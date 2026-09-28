<script lang="ts" setup>
import { useAppUpdateStore } from '../stores/updateStore.ts'

const updateStore = useAppUpdateStore()
</script>

<template>
    <div @click="updateStore.showUpdateModal = true" class="update-available">
        Update is available
        <p class="muted update-available__version">v{{ updateStore.updateVersion }} · What's new?</p>
    </div>
</template>

<style lang="scss" scoped>
.update-available {
    margin-top: 12px;
    border-radius: 12px;
    font-weight: 500;
    width: 100%;
    padding: 12px 8px;
    color: white;
    cursor: pointer;
    text-align: center;
    background: #202020;
    // border: 1px solid #ffffff10;
    // box-shadow: 0 -1px 24px -8px rgba(0,0,0,0.7);
    transition: .25s;

    &:hover {
        padding: 16px 8px;
        // transform: translateY(-2px);
        background: #335eb3;
        box-shadow: 0 -1px 24px -8px #4578de;
    }

    &__version {
        margin: 0;
        padding: 0;
        margin-top: 4px;
    }
}
</style>