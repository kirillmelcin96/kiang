<script lang="ts" setup>
import { useConfirmStore } from '../../stores/ui/confirm.ts'

const uiConfirm = useConfirmStore()

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <div class="confirm-modal-overlay" @click.self="emit('cancel')">
      <div class="confirm-modal">
        <h3>{{ uiConfirm.title }}</h3>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-html="uiConfirm.message"></p>

        <div class="confirm-modal-buttons-container">
          <div class="confirm-modal-button confirm-modal-button__cancel" @click="emit('cancel')">
            Cancel
          </div>
          <div class="confirm-modal-button confirm-modal-button__confirm" @click="emit('confirm')">
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
  background-color: var(--overlay-background);
  backdrop-filter: var(--overlay-blur);
  -webkit-backdrop-filter: var(--overlay-blur);
}

.confirm-modal {
  border-radius: var(--radius-md);
  border: var(--card-border);
  background-color: var(--card-background);
  width: 380px;
  padding: 12px;
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
  border-radius: var(--radius-sm);
  font-size: 15px;
  user-select: none;
  // transition: .25s;

  &:hover {
    opacity: 0.8;
  }

  &__cancel {
    color: var(--button-cancel-color);
    border-color: var(--button-cancel-border);
  }

  &__confirm {
    color: var(--button-error-color);
    background-color: var(--button-error-background);
    border-color: var(--button-error-background);
  }
}
</style>
