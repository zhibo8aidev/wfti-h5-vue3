<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { QUESTIONS } from '@/domains/questionBank';
import type { AnswerOption } from '@/domains/types';
import { getQuizDraft, saveQuizDraft } from '@/services/localRepository';
import { track } from '@/services/tracker';
import { appState } from '@/stores/appState';

const router = useRouter();
const selected = ref<AnswerOption | null>(null);
const animating = ref(false);
const slideKey = ref(0);

const currentIndex = computed(() => Math.min(appState.currentIndex, QUESTIONS.length - 1));
const question = computed(() => QUESTIONS[currentIndex.value]);
const progress = computed(() => Math.round(((currentIndex.value + 1) / QUESTIONS.length) * 100));

onMounted(() => {
  const draft = getQuizDraft();
  if (draft && appState.answers.length === 0) {
    appState.answers = [...draft.answers];
    appState.currentIndex = draft.currentIndex;
  }
  track('quiz_question_exposure', { questionId: question.value.id });
});

function persistDraft(nextIndex = appState.currentIndex) {
  saveQuizDraft({
    answers: appState.answers,
    currentIndex: nextIndex
  });
}

function choose(answer: AnswerOption) {
  if (animating.value) return;
  selected.value = answer;
  animating.value = true;
  track('quiz_option_click', { questionId: question.value.id, answer });
  appState.answers[currentIndex.value] = answer;

  window.setTimeout(() => {
    if (currentIndex.value === QUESTIONS.length - 1) {
      persistDraft(QUESTIONS.length);
      router.push('/calculating');
      return;
    }
    appState.currentIndex = currentIndex.value + 1;
    selected.value = appState.answers[appState.currentIndex] ?? null;
    slideKey.value += 1;
    persistDraft(appState.currentIndex);
    animating.value = false;
    track('quiz_question_exposure', { questionId: question.value.id });
  }, 300);
}

function previous() {
  if (animating.value || currentIndex.value === 0) return;
  appState.currentIndex = currentIndex.value - 1;
  selected.value = appState.answers[appState.currentIndex] ?? null;
  slideKey.value += 1;
  persistDraft(appState.currentIndex);
  track('quiz_back_click', { questionId: question.value.id });
}
</script>

<template>
  <main class="mobile-page quiz">
    <header class="quiz-head">
      <div class="progress-row">
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        <strong>{{ currentIndex + 1 }}/16</strong>
      </div>
      <p>{{ progress }}%</p>
    </header>

    <section :key="slideKey" class="question-card" :class="{ leaving: animating }">
      <p class="dimension">{{ question.dimension }} · QUESTION {{ question.id }}</p>
      <h1>{{ question.title }}</h1>
      <div class="options">
        <button
          v-for="option in question.options"
          :key="option.key"
          class="option-btn"
          :class="{ selected: selected === option.key || appState.answers[currentIndex] === option.key }"
          type="button"
          :disabled="animating"
          @click="choose(option.key)"
        >
          <span>{{ option.key }}</span>
          <strong>{{ option.text }}</strong>
        </button>
      </div>
    </section>

    <footer class="quiz-foot bottom-safe">
      <button class="text-btn" type="button" :disabled="currentIndex === 0 || animating" @click="previous">返回上一题</button>
    </footer>
  </main>
</template>

<style scoped>
.quiz {
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.quiz-head {
  padding: 22px 20px 10px;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-track {
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: #e8eef7;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: var(--primary);
  transition: width 260ms ease;
}

.progress-row strong {
  min-width: 42px;
  color: #111827;
  font-size: 13px;
}

.quiz-head p {
  margin: 8px 0 0;
  color: var(--text-soft);
  font-size: 12px;
  text-align: right;
}

.question-card {
  flex: 1;
  padding: 26px 20px 96px;
  animation: enter 400ms ease both;
}

.question-card.leaving {
  pointer-events: none;
}

.dimension {
  margin: 0 0 14px;
  color: var(--primary);
  font-size: 13px;
  font-weight: 900;
}

h1 {
  min-height: 112px;
  margin: 0 0 28px;
  color: #111827;
  font-size: 23px;
  line-height: 1.45;
}

.options {
  display: grid;
  gap: 14px;
}

.option-btn {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 12px;
  align-items: start;
  min-height: 76px;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 16px;
  color: #111827;
  background: #f5f8fc;
  text-align: left;
  transition: background 180ms ease, border-color 180ms ease, color 180ms ease, transform 180ms ease;
}

.option-btn span {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  color: var(--primary);
  background: #ffffff;
  font-weight: 900;
}

.option-btn strong {
  font-size: 15px;
  line-height: 1.45;
}

.option-btn.selected {
  border-color: var(--primary);
  color: #ffffff;
  background: var(--primary);
}

.option-btn.selected span {
  color: var(--primary);
}

.quiz-foot {
  position: fixed;
  left: 50%;
  bottom: 0;
  width: min(480px, 100%);
  transform: translateX(-50%);
  padding: 12px 20px;
  background: linear-gradient(180deg, rgba(255,255,255,0), #ffffff 22%);
  text-align: center;
}

.quiz-foot .text-btn:disabled {
  opacity: 0.35;
}

@keyframes enter {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
