<script lang="ts" setup>
import { computed } from 'vue';
import { useAppUpdateStore } from '../../stores/updateStore'
import DateTimeFormat from '../utils/DateTimeFormat.vue';

const updateStore = useAppUpdateStore()

const timeFormatted = computed(() => {
    return new Date(updateStore.updateDate)
})

function closeModal() {
    updateStore.showUpdateModal = false
}

function startUpdate() {
    // See: https://v2.tauri.app/plugin/updater/?utm_source=chatgpt.com#checking-for-updates
}
</script>

<template>
    <Teleport to="body">
        <div 
            @click.self="closeModal" 
            class="update-modal-overlay"
        >
            <div class="update-modal">
                <h3>Kiang v{{ updateStore.updateVersion }}</h3>
                <p v-if="updateStore.updateDate" class="muted">
                    <DateTimeFormat :timestamp="timeFormatted" />
                </p>

                <div class="update-modal-buttons-container">
                    <div @click="closeModal" class="update-modal-button update-modal-button__cancel">
                        Skip
                    </div>
                    <div @click="startUpdate" class="update-modal-button update-modal-button__confirm">
                        Update
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style lang="scss" scoped>
.update-modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9998;
    background-color: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}

.update-modal {
    border-radius: 16px;
    border: 1px solid #3a3a3a;
    background-color: #272727;
    width: 380px;
    padding: 12px 16px;
    z-index: 9999;
    user-select: none;

    h3 {
        margin: 0;
        user-select: none;
    }

    p {
        margin: 4px 0;
    }
}

.update-modal-buttons-container {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 20px;
}

.update-modal-button {
    cursor: pointer;
    padding: 4px 12px;
    border-width: 1px;
    border-style: solid;
    border-radius: 8px;
    font-size: 15px;
    user-select: none;
    // transition: .25s;

    &:hover {
        opacity: .8;
    }

    &__cancel {
        color: white;
        border-color: #ffffff20;
    }

    &__confirm {
        color: #51ff4e;
        background-color: #27ff2430;
        border-color: #27ff2430;
    }
}
</style>