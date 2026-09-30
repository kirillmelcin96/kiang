<script lang="ts" setup>
import { ref } from 'vue'
import { version } from '../../../package.json'

const clicksCount = ref<number>(0)
const appVersion = ref('Kiang v' + version)

// See: https://sky.pro/wiki/javascript/peremeshivanie-elementov-massiva-v-java-script-sluchayniy-poryadok/
function shuffle(arr: Array<string>) {
  const shuffled = [...arr]

  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
  }

  return shuffled.slice(0, 5).join('')
}

function imgClicked() {
  clicksCount.value += 1

  if (clicksCount.value < 10) {
    const buffer = ['K', 'i', 'a', 'n', 'g']
    appVersion.value = shuffle(buffer) + ` v${version}`
  } else if (clicksCount.value < 17) {
    const buffer = ['🪐', '🌍', '🌎', '🌏', '🛰️', '🛸', '👽', '🌌', '⭐', '🌟', '🌠', '✨']
    appVersion.value = shuffle(buffer)
  } else if (clicksCount.value < 30) {
    const buffer = [
      '🦙',
      '🦙',
      '🦙',
      '🦙',
      '🦙',
      '🦙',
      '🌳',
      '🌳',
      '🌳',
      '🌳',
      '🌳',
      '🌳',
      '🏔️',
      '🏔️',
      '🏔️',
    ]
    appVersion.value = shuffle(buffer)
  } else if (clicksCount.value == 35) {
    appVersion.value = 'ohyak.📃📃📃📃📃.dev'
  } else if (clicksCount.value == 60) {
    appVersion.value = 'No'
  } else {
    appVersion.value = 'Kiang v' + version
  }
}
</script>

<template>
  <div class="settings-about-section">
    <img @click="imgClicked" src="/images/128x128@2x.png" />
    <div class="settings-about-section__version">{{ appVersion }}</div>
    <div class="settings-about-section__links">
      <a href="https://github.com/kirillmelcin96/kiang" target="_blank">Github</a> •
      <a href="https://github.com/kirillmelcin96/kiang/blob/main/CHANGELOG.md" target="_blank"
        >Changelog</a
      >
      •
      <a href="https://github.com/kirillmelcin96/kiang/releases" target="_blank">Releases</a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-about-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 24px;

  &__version {
    font-weight: 600;
    font-size: 32px;
  }

  &__links {
    user-select: none;
  }

  img {
    width: 128px;
    height: 128px;
    margin-bottom: 12px;
    transition: 0.25s;
    animation: logo-load 0.6s ease;
    cursor: not-allowed;

    &:hover {
      opacity: 0.8;
    }

    &:active {
      transform: scale(0.98);
    }
  }
}

@keyframes logo-load {
  from {
    transform: translateY(0) scale(0.9);
    filter: blur(7px);
  }
  to {
    transform: translateY(0) scale(1);
    filter: blur(0px);
  }
}
</style>
