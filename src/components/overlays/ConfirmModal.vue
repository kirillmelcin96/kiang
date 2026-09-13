<script lang="ts" setup>
import { useConfirmStore } from '../../stores/ui/confirm.ts'

const uiConfirm = useConfirmStore()

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
    <Teleport to="body">
        <div 
            @click="emit('cancel')" 
            class="confirm-modal-overlay"
        >
            <div class="confirm-modal">
                <h3>{{ uiConfirm.title }}</h3>
                <p v-html="uiConfirm.message"></p>

                <div class="confirm-modal-buttons-container">
                    <div @click="emit('cancel')" class="confirm-modal-button confirm-modal-button__cancel">
                        Cancel
                    </div>
                    <div @click="emit('confirm')" class="confirm-modal-button confirm-modal-button__confirm">
                        {{ uiConfirm.confirmText }}
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style lang="scss" scoped>
.confirm-modal-overlay {
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

.confirm-modal {
    border-radius: 16px;
    border: 1px solid #3a3a3a;
    background-color: #272727;
    width: 380px;
    padding: 12px 16px;
    z-index: 9999;

    h3 {
        margin: 0;
    }

    p {
        margin: 4px 0;
    }
}

.confirm-modal-buttons-container {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 20px;
}

.confirm-modal-button {
    cursor: pointer;
    padding: 4px 12px;
    border-width: 1px;
    border-style: solid;
    border-radius: 8px;
    font-size: 15px;
    // transition: .25s;

    &:hover {
        opacity: .8;
    }

    &__cancel {
        color: white;
        border-color: #ffffff20;
    }

    &__confirm {
        color: #ff4e4e;
        background-color: #ff202030;
        border-color: #ff202030;
    }
}
</style>