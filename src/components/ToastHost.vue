<script setup lang="ts">
import { appState } from '@/stores/appState';
</script>

<template>
  <Transition name="toast">
    <div v-if="appState.toast" class="toast-host" role="status">
      {{ appState.toast }}
    </div>
  </Transition>
</template>

<style scoped>
.toast-host {
  position: fixed;
  left: 50%;
  bottom: calc(92px + env(safe-area-inset-bottom));
  z-index: 1000;
  max-width: min(320px, calc(100vw - 48px));
  transform: translateX(-50%);
  border-radius: 8px;
  padding: 12px 18px;
  background: rgba(17, 24, 39, 0.92);
  color: #ffffff;
  font-size: 15px;
  line-height: 1.3;
  text-align: center;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}
</style>
