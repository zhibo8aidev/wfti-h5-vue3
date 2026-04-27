<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import type { PersonalityResult } from '@/domains/types';
import { bridge } from '@/services/bridge';
import { generatePosterPng } from '@/services/poster';
import { showToast } from '@/stores/appState';

const props = defineProps<{
  open: boolean;
  result: PersonalityResult;
}>();

const emit = defineEmits<{
  close: [];
}>();

const status = ref<'idle' | 'generating' | 'ready' | 'failed'>('idle');
const imageUrl = ref('');

watch(
  () => props.open,
  async (open) => {
    if (!open) return;
    status.value = 'generating';
    imageUrl.value = '';
    const timeout = window.setTimeout(() => {
      if (status.value === 'generating') {
        status.value = 'failed';
        showToast('海报生成失败，请重试');
      }
    }, 5000);
    await nextTick();
    try {
      imageUrl.value = generatePosterPng(props.result);
      if (status.value === 'generating') {
        status.value = 'ready';
      }
    } catch {
      status.value = 'failed';
      showToast('海报生成失败，请重试');
    } finally {
      window.clearTimeout(timeout);
    }
  }
);
</script>

<template>
  <Transition name="modal">
    <div v-if="open" class="poster-mask" role="dialog" aria-modal="true">
      <div class="poster-panel">
        <div class="poster-frame">
          <div v-if="status === 'generating'" class="poster-loading">
            <span class="loader"></span>
            <p>海报生成中</p>
          </div>
          <img v-else-if="status === 'ready'" :src="imageUrl" alt="分享海报预览" class="poster-img" />
          <div v-else class="poster-loading">
            <p>海报生成失败</p>
            <button class="ghost-btn" type="button" @click="status = 'generating'; imageUrl = generatePosterPng(result); status = 'ready'">重试</button>
          </div>
        </div>
        <div class="poster-actions">
          <button class="secondary-btn" type="button" @click="bridge.saveImage">保存相册</button>
          <button class="primary-btn" type="button" @click="bridge.share">分享名片</button>
        </div>
        <button class="text-btn close" type="button" @click="emit('close')">关闭</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.poster-mask {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(5, 15, 32, 0.78);
}

.poster-panel {
  width: min(360px, 100%);
  max-height: calc(100vh - 56px);
  overflow-y: auto;
  border-radius: 8px;
  padding: 16px;
  background: #ffffff;
}

.poster-frame {
  min-height: 440px;
  border-radius: 8px;
  background: #f0f7ff;
  overflow: hidden;
}

.poster-img {
  display: block;
  width: 100%;
}

.poster-loading {
  min-height: 440px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #667085;
}

.loader {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 4px solid #d6e7ff;
  border-top-color: #0082ff;
  animation: spin 800ms linear infinite;
}

.poster-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 14px;
}

.close {
  width: 100%;
  margin-top: 8px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 180ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
