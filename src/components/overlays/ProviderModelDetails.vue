<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useModelsStore } from '../../stores/modelsStore.ts'
import RotatingLoading from '../common/RotatingLoading.vue'
import type { ModelQuantization, ModelDetails } from '../../types/api.ts'
import ArrowRightUpIcon from '../../icons/ArrowRightUp.vue'
import GlobeIcon from '../../icons/Globe.vue'
import BalanceIcon from '../../icons/Balance.vue'
import BasicTooltip from '../common/BasicTooltip.vue'
import { bytesToGb, formatBigNumbers } from '../../utils/units.ts'
import WarningTriangleIcon from '../../icons/WarningTriangle.vue'
import LikeIcon from '../../icons/Like.vue'
import DownloadIcon from '../../icons/Download.vue'

const modelsStore = useModelsStore()

const isLoading = ref(true)
const details = ref<ModelDetails>()
const ggufList = ref<ModelQuantization[]>()
const ggufSelectedIndex = ref<number | null>(null)

function cancelHandler() {
  modelsStore.showDetailsModal = false
  modelsStore.modal = {
    id: '',
    provider: 'hf',
  }
}

function downloadHandler() {}

// async function checkInstalledDuplicates() {}

async function fetchModelDataHF() {
  isLoading.value = true
  details.value = await modelsStore.fetchDetailsHF(modelsStore.modal.id)
  ggufList.value = await modelsStore.fetchGgufFilesHF(modelsStore.modal.id)
  isLoading.value = false
}

async function fetchModelDataOllama() {}

onMounted(() => {
  switch (modelsStore.modal.provider) {
    case 'hf':
      fetchModelDataHF()
      break
    case 'ollama':
      fetchModelDataOllama()
      break
  }
})

function selectGguf(id: number) {
  if (ggufSelectedIndex.value == id) {
    ggufSelectedIndex.value = null
    return
  }
  ggufSelectedIndex.value = id
}

function showSizeWarning(size: number) {
  const limitInGB = 8
  const limit = limitInGB * 1024 * 1024 * 1024

  return size >= limit
}
</script>

<template>
  <Teleport to="body">
    <div class="model-details-modal-overlay" @click.self="cancelHandler">
      <div class="model-details-modal">
        <!-- Loading state -->
        <template v-if="isLoading">
          <div class="muted model-details-modal__loading">
            <RotatingLoading /> Fetching model metadata...
          </div>
          <div class="model-details-modal__body">
            <div class="model-details-modal-buttons-container" style="margin-top: 0">
              <div
                class="model-details-modal-button model-details-modal-button__cancel"
                @click="cancelHandler"
              >
                Cancel
              </div>
            </div>
          </div>
        </template>

        <template v-else-if="details === undefined">
          <div style="padding: 12px">
            An error occurred while loading the model details. Please try again.
          </div>

          <div class="model-details-modal__body">
            <div class="model-details-modal-buttons-container" style="margin-top: 0">
              <div
                class="model-details-modal-button model-details-modal-button__cancel"
                @click="cancelHandler"
              >
                Cancel
              </div>
            </div>
          </div>
        </template>

        <!-- Showing model details -->
        <template v-else>
          <div class="model-details-modal__header">
            <h3>
              {{ details.name }} <span class="muted">by {{ details.author }}</span>
            </h3>
          </div>

          <div class="model-details-modal__body">
            <!-- Links -->
            <a
              v-if="details.provider === 'hf'"
              :href="`https://huggingface.co/${details.id}`"
              target="_blank"
            >
              Open on Hugging Face <ArrowRightUpIcon />
            </a>

            <!-- Labels -->
            <div class="model-details-modal-labels">
              <BasicTooltip text="Downloads">
                <div v-if="details?.downloads" class="model-details-modal-label">
                  <DownloadIcon /> {{ formatBigNumbers(details.downloads) }}
                </div>
              </BasicTooltip>
              <BasicTooltip text="Likes">
                <div v-if="details?.likes" class="model-details-modal-label">
                  <LikeIcon /> {{ formatBigNumbers(details.likes) }}
                </div>
              </BasicTooltip>
              <BasicTooltip text="Supported tasks">
                <div class="model-details-modal-label">
                  {{ details.pipelineTag }}
                </div>
              </BasicTooltip>
              <BasicTooltip v-if="details.language?.length" :text="details.language.join(', ')">
                <div class="model-details-modal-label">
                  <template v-if="details.language?.length > 1">
                    <GlobeIcon /> {{ details.language.length }} languages
                  </template>
                  <template v-else> <GlobeIcon /> Language: {{ details.language[0] }} </template>
                </div>
              </BasicTooltip>
              <div class="model-details-modal-label">
                <BalanceIcon /> <span class="muted">License:</span> {{ details.license }}
              </div>
            </div>

            <!-- Warnings -->
            <!-- <div v-if="showSizeCaution" class="model-details-modal-warning">
              <b><WarningTriangleIcon /> Warning: Large model (12 GB+)</b>
              <p>
                This model may run very slowly on standard computers. Requires powerful hardware to
                run.
              </p>
            </div> -->

            <!-- .gguf Files -->
            <b>Select the quantization for download:</b>
            <div class="gguf-container">
              <div
                v-for="(gguf, index) in ggufList"
                :key="gguf.name"
                class="gguf-container__button"
                :class="{ 'gguf-container__button--selected': index === ggufSelectedIndex }"
                @click="selectGguf(index)"
              >
                <div>
                  {{ gguf.name }}
                  <span
                    v-if="gguf.name.endsWith('Q4_K_M') || gguf.name.endsWith('IQ3_M')"
                    class="gguf-container__button--recommended"
                  >
                    (Recommended)
                  </span>
                </div>
                <div class="gguf-container__button_size">
                  <BasicTooltip
                    v-if="showSizeWarning(gguf.size)"
                    text="This model may run very slowly on standard PCs"
                  >
                    <WarningTriangleIcon />
                    {{ bytesToGb(gguf.size) }}
                  </BasicTooltip>
                  <span v-else>
                    {{ bytesToGb(gguf.size) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="model-details-modal-buttons-container">
              <div
                class="model-details-modal-button model-details-modal-button__cancel"
                @click="cancelHandler"
              >
                Cancel
              </div>
              <div
                v-if="ggufSelectedIndex !== null"
                class="model-details-modal-button model-details-modal-button__confirm"
                @click="downloadHandler"
              >
                Download
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.model-details-modal-overlay {
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

.model-details-modal {
  border-radius: var(--radius-md);
  border: var(--card-border);
  background-color: var(--card-background);
  width: 100%;
  max-width: 680px;
  z-index: 9999;
  user-select: none;
  margin: 12px;

  &__header {
    padding: 12px;
    border-bottom: var(--card-border);
  }

  &__body {
    padding: 12px;

    a {
      font-size: var(--font-sm);
      transition: var(--transition-speed-default);
      color: var(--muted-color);
      text-decoration: underline dashed;
      text-underline-offset: 4px;

      &:hover {
        color: var(--body-text-color);
      }

      svg {
        width: 13px;
        height: 13px;
        margin-bottom: -2.3px;
        margin-left: -4px;
      }
    }
  }

  &__loading {
    padding: 12px;
  }

  h3 {
    margin: 0;
    user-select: none;
  }

  p {
    margin: 4px 0;
  }
}

.model-details-modal-labels {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 20px;
}

.model-details-modal-label {
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  background-color: var(--model-badge-background);
  font-size: var(--font-sm);
  font-weight: var(--font-bold);

  svg {
    margin-bottom: -2px;
    color: var(--muted-color);
  }
}

.model-details-modal-warning {
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  color: var(--main-color-yellow);
  background-color: var(--main-color-yellow-background);

  svg {
    margin-bottom: -3px;
  }
}

.gguf-container {
  margin-top: 8px;
  padding: 12px;
  border-radius: var(--radius-md);
  background-color: var(--code-background);
  max-height: 370px;
  overflow-y: auto;
  //   font-family: var(--font-mono);

  &__button {
    display: block;
    padding: 3px 8px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    margin-bottom: 8px;
    color: var(--body-text-color);
    border: 1px solid var(--button-cancel-border);
    transition: var(--transition-speed-default);
    font-weight: var(--font-bold);
    // font-size: var(--font-sm);

    &:last-child {
      margin-bottom: 0;
    }

    &_size {
      transition: var(--transition-speed-default);
      color: var(--muted-color);

      svg {
        margin-bottom: -2px;
      }
    }

    &--recommended {
      transition: var(--transition-speed-default);
      color: var(--main-color-green);
    }

    &:hover {
      background-color: var(--model-badge-background);
    }

    &--selected {
      color: white;
      background-color: var(--main-color-blue);
      border-color: #ffffff20;

      .gguf-container__button_size {
        color: white;
      }

      .gguf-container__button--recommended {
        color: white;
      }

      &:hover {
        background-color: var(--main-color-blue);
      }
    }
    // background-color: var(--main-color-blue);
  }
}

.model-details-modal-buttons-container {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}

.model-details-modal-button {
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
}
</style>
