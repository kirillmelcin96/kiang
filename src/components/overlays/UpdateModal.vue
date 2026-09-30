<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useAppUpdateStore } from '../../stores/updateStore'
import DateTimeFormat from '../utils/DateTimeFormat.vue'
import { httpFetch } from '../../utils/http.ts'
import { marked } from 'marked'

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
      @click.self="closeModal"
      class="update-modal-overlay"
      :class="{ 'update-modal-overlay--disabled': updateStore.updateStarted }"
    >
      <div class="update-modal">
        <!-- Header -->
        <h1 class="update-modal__header">Kiang v{{ updateStore.updateVersion }}</h1>
        <div class="update-modal__tag">Latest</div>
        <p v-if="updateStore.updateDate" class="muted">
          Release date: <DateTimeFormat :timestamp="timeFormatted" date-only />
        </p>

        <!-- Changelog -->
        <div v-if="!isError" v-html="parsedOutput" class="update-modal-changelog" />
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
            @click="closeModal"
            class="update-modal-button update-modal-button__cancel"
            :class="{ 'update-modal-button--disabled': updateStore.updateStarted }"
          >
            Cancel
          </div>
          <div
            @click="startUpdate"
            class="update-modal-button update-modal-button__confirm"
            :class="{ 'update-modal-button--disabled': updateStore.updateStarted }"
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
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  &--disabled {
    cursor: progress;
  }
}

.update-modal {
  border-radius: 16px;
  border: 1px solid #3a3a3a;
  background-color: #272727;
  margin: 0 12px;
  min-width: 380px;
  max-width: 600px;
  padding: 12px 16px;
  z-index: 9999;
  user-select: none;

  &__tag {
    display: inline-block;
    padding: 1px 6px;
    border-radius: 8px;
    color: #51ff4e;
    border: 1px solid #27ff2450;
    opacity: 70%; // TODO: change to normal colors later
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
  border-radius: 8px;
  font-size: 15px;
  user-select: none;
  // transition: .25s;

  &:hover {
    opacity: 0.8;
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
  border-radius: 12px;
  background-color: #0e0e0e;
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
    border-bottom: 1px solid #ffffff10;
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
  border-radius: 12px;
  color: #ff4e4e;
  background-color: #ff202030;
  border: 1px solid #ff202030;
  padding: 8px 16px 12px 16px;
  max-height: 114px;
  overflow-y: auto;

  &__header {
    // font-size: 14px;
    font-weight: 600;
    user-select: none;
    margin-bottom: 8px;
  }
}
</style>
