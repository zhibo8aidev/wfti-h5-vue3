import { reactive } from 'vue';
import type { AnswerOption, PersonalityResult } from '@/domains/types';

export const appState = reactive({
  answers: [] as AnswerOption[],
  currentIndex: 0,
  currentResult: null as PersonalityResult | null,
  toast: '',
  posterVisible: false
});

let toastTimer: number | undefined;

export function showToast(message: string): void {
  appState.toast = message;
  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }
  toastTimer = window.setTimeout(() => {
    appState.toast = '';
  }, 1600);
}

export function resetQuizState(): void {
  appState.answers = [];
  appState.currentIndex = 0;
}
