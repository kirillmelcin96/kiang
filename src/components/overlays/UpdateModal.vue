<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useAppUpdateStore } from '../../stores/updateStore'
import DateTimeFormat from '../utils/DateTimeFormat.vue'
import { httpFetch } from '../../utils/http.ts'
import { marked } from 'marked'
import { error } from '@tauri-apps/plugin-log'

const updateStore = useAppUpdateStore()
const isError = ref(false)
const changelog = ref('')

async function loadChangelog() {
  isError.value = false
  changelog.value = ''

  try {
    const res = await httpFetch(
      'https://raw.githubusercontent.com/kirillmelcin96/kiang/refs/heads/main/CHANGELOG.md',
      {
        method: 'GET',
      },
    )

    changelog.value = await res.text()
  } catch (e) {
    console.error(e)
    error('failed to load the changelog')
    isError.value = true
  }
}

onMounted(() => {
  loadChangelog()
})

const timeFormatted = computed(() => {
  return new Date(updateStore.updateDate)
})

const parsedOutput = computed(() => {
  if (!changelog.value.length) return 'Loading changelog...'
  return marked.parse(changelog.value)
})

function closeModal() {
  if (updateStore.updateStarted) return

  updateStore.showUpdateModal = false
}

async function startUpdate() {
  if (updateStore.updateStarted) return

  await updateStore.installUpdate()
}
</script>

<template>
  <Teleport to="body">
    <div
      class="update-modal-overlay"
      :class="{ 'update-modal-overlay--disabled': updateStore.updateStarted }"
      @click.self="closeModal"
    >
      <div class="update-modal">
        <!-- Header -->
        <h1 class="update-modal__header">Kiang v{{ updateStore.updateVersion }}</h1>
        <div class="update-modal__tag">Latest</div>
        <p v-if="updateStore.updateDate" class="muted">
          Release date: <DateTimeFormat :timestamp="timeFormatted" date-only />
        </p>

        <!-- Changelog -->
        <div v-if="!isError" class="update-modal-changelog" v-html="parsedOutput" />
        <div v-else class="update-modal-changelog">
          Error loading the changelog. <br />
          <a @click="loadChangelog">Try again</a>
        </div>

        <!-- Update error -->
        <div v-if="updateStore.isError" class="update-modal-error">
          <div class="update-modal-error__header">Error while updating the app:</div>
          {{ updateStore.errorText?.message || 'Unknown error' }}
        </div>

        <!-- Buttons -->
        <div class="update-modal-buttons-container">
          <div
            class="update-modal-button update-modal-button__cancel"
            :class="{ 'update-modal-button--disabled': updateStore.updateStarted }"
            @click="closeModal"
          >
            Cancel
          </div>
          <div
            class="update-modal-button update-modal-button__confirm"
            :class="{ 'update-modal-button--disabled': updateStore.updateStarted }"
            @click="startUpdate"
          >
            <template v-if="!updateStore.updateStarted">Update</template>
            <template v-if="updateStore.isInstalling"> Downloading... </template>
            <template v-if="updateStore.isUpdating"> Installing... </template>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss">
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
  background-color: var(--overlay-background);
  backdrop-filter: var(--overlay-blur);
  -webkit-backdrop-filter: var(--overlay-blur);

  &--disabled {
    cursor: progress;
  }
}

.update-modal {
  border-radius: var(--radius-md);
  border: var(--card-border);
  background-color: var(--card-background);
  margin: 0 12px;
  min-width: 380px;
  max-width: 600px;
  padding: 12px;
  z-index: 9999;
  user-select: none;

  &__tag {
    display: inline-block;
    padding: 1px 6px;
    border-radius: var(--radius-sm);
    color: var(--tag-green-color);
    border: 1px solid var(--tag-green-border);
    margin-left: 4px;
    font-size: 13px;
    // font-weight: 500;
    transform: translateY(-5px);
  }

  &__header {
    margin: 0;
    user-select: none;
    display: inline;
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
    color: var(--button-success-color);
    background-color: var(--button-success-background);
    border-color: var(--button-success-background);
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;

    &:hover {
      opacity: 0.6;
    }
  }
}

.update-modal-changelog {
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  background-color: var(--code-background);
  max-height: 370px;
  overflow-y: auto;
  font-family: var(--font-mono);

  // Rewrite default styles so it will look better in the changelog container
  a {
    pointer-events: none;
  }

  h1,
  p {
    font-family: var(--font-mono);
    margin: 0 0 12px 0;
  }

  h2 {
    margin: 32px 0 12px 0;
  }

  h1,
  h2 {
    font-family: var(--font-mono);
    padding: 0 0 12px 0;
    border-bottom: 1px solid var(--border-color);
  }

  h3,
  h4,
  h5,
  h6,
  ol,
  li {
    font-family: var(--font-mono);
    margin: 0 0 4px 0;
  }

  ul {
    height: auto;
    padding: 0 20px;
    margin: 0 0 12px 0;
  }
}

@media screen and (max-height: 600px) {
  .update-modal-changelog {
    max-height: 360px;
  }
}

.update-modal-error {
  margin-top: 12px;
  border-radius: var(--radius-md);
  color: var(--button-error-color);
  background-color: var(--button-error-background);
  border: 1px solid var(--button-error-background);
  padding: 8px 16px 12px 16px;
  max-height: 114px;
  overflow-y: auto;

  &__header {
    // font-size: var(--font-sm);
    font-weight: 600;
    user-select: none;
    margin-bottom: 8px;
  }
}
</style>
