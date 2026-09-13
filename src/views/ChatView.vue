<script lang="ts" setup>
import MainInput from '../components/MainInput.vue';
import MessageList from '../components/MessageList.vue';
</script>

<template>
    <div class="chat-list-container">
        <MessageList />
        <MainInput />
    </div>
</template>

<style lang="scss">
.chat-list-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 24px 12px 24px 12px;
}
</style>