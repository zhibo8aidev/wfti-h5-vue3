<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { computePersonality } from '@/domains/personalityEngine';
import { QUESTIONS } from '@/domains/questionBank';
import { clearQuizDraft, getQuizDraft, saveLatestLocalResult } from '@/services/localRepository';
import { track } from '@/services/tracker';
import { appState } from '@/stores/appState';

const router = useRouter();

onMounted(() => {
  const draft = getQuizDraft();
  const answers = appState.answers.length === QUESTIONS.length ? appState.answers : draft?.answers;
  window.setTimeout(() => {
    if (!answers || answers.length !== QUESTIONS.length) {
      router.replace('/');
      return;
    }
    const result = computePersonality(answers);
    appState.currentResult = result;
    saveLatestLocalResult(result);
    clearQuizDraft();
    track('result_compute_complete', { code: result.personality_code, hidden: result.is_hidden });
    router.replace('/result');
  }, 2500);
});
</script>

<template>
  <main class="mobile-page calculating">
    <div class="scan-visual">
      <div class="pitch">
        <span class="scan-line"></span>
        <span class="center-dot">DNA</span>
      </div>
    </div>
    <p>正在分析你的球迷DNA……</p>
  </main>
</template>

<style scoped>
.calculating {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 28px;
  background:
    radial-gradient(circle at center, rgba(0,130,255,0.14), transparent 38%),
    #ffffff;
}

.scan-visual {
  width: 210px;
  height: 210px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(0,130,255,0.08);
}

.pitch {
  position: relative;
  width: 164px;
  height: 164px;
  border: 2px solid var(--primary);
  border-radius: 999px;
  overflow: hidden;
  background:
    linear-gradient(90deg, rgba(0,130,255,0.14) 1px, transparent 1px) 0 0 / 18px 18px,
    #ffffff;
}

.scan-line {
  position: absolute;
  left: 0;
  top: 18px;
  width: 100%;
  height: 3px;
  background: var(--hot-red);
  box-shadow: 0 0 18px rgba(255,61,0,0.6);
  animation: scan 1800ms ease-in-out infinite;
}

.center-dot {
  position: absolute;
  left: 50%;
  top: 50%;
  display: grid;
  place-items: center;
  width: 74px;
  height: 74px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  color: #ffffff;
  background: var(--primary);
  font-weight: 900;
}

p {
  color: var(--text-sub);
  font-size: 16px;
}

@keyframes scan {
  0%, 100% {
    top: 18px;
    opacity: 0.55;
  }
  50% {
    top: 142px;
    opacity: 1;
  }
}
</style>
