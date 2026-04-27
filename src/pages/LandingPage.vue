<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { bridge } from '@/services/bridge';
import { getLatestLocalResult, getQuizDraft, clearQuizDraft } from '@/services/localRepository';
import { track } from '@/services/tracker';
import { appState, resetQuizState } from '@/stores/appState';
import type { PersonalityResult, QuizDraft } from '@/domains/types';

const router = useRouter();
const latest = ref<PersonalityResult | null>(null);
const draft = ref<QuizDraft | null>(null);
const isLoading = ref(true);
const showLongLoading = ref(false);
const ctaLocked = ref(false);
const resumeVisible = ref(false);

const ctaText = computed(() => (latest.value ? '重新测试' : '开始鉴赏'));

onMounted(() => {
  track('landing_exposure');
  window.setTimeout(() => {
    showLongLoading.value = true;
  }, 3000);
  window.setTimeout(() => {
    latest.value = getLatestLocalResult();
    draft.value = getQuizDraft();
    isLoading.value = false;
  }, 260);
});

function lockCta() {
  ctaLocked.value = true;
  window.setTimeout(() => {
    ctaLocked.value = false;
  }, 500);
}

function start() {
  if (ctaLocked.value) return;
  lockCta();
  track('landing_cta_click', { hasLatest: Boolean(latest.value), hasDraft: Boolean(draft.value) });
  if (draft.value && draft.value.answers.length > 0) {
    resumeVisible.value = true;
    return;
  }
  resetQuizState();
  clearQuizDraft();
  router.push('/quiz');
}

function continueDraft() {
  if (!draft.value) return;
  appState.answers = [...draft.value.answers];
  appState.currentIndex = draft.value.currentIndex;
  resumeVisible.value = false;
  router.push('/quiz');
}

function restartDraft() {
  clearQuizDraft();
  resetQuizState();
  resumeVisible.value = false;
  router.push('/quiz');
}

function viewLatest() {
  if (!latest.value) return;
  appState.currentResult = latest.value;
  router.push('/result');
}
</script>

<template>
  <main class="mobile-page landing">
    <div v-if="isLoading" class="skeleton" :class="{ active: showLongLoading }">
      <div class="skeleton-ball"></div>
      <p v-if="showLongLoading">加载中</p>
    </div>

    <section v-else class="landing-content">
      <header class="topbar">
        <button class="login-btn" type="button" @click="bridge.ensureLogin">登录</button>
      </header>

      <div class="hero-copy">
        <p class="eyebrow">2026 WORLD CUP</p>
        <h1>WFTI — 世界杯球迷人格大鉴赏</h1>
        <p class="slogan">你不是在看世界杯，你是在演你自己。</p>
      </div>

      <div class="field-visual" aria-hidden="true">
        <div class="field-line center"></div>
        <div class="field-line box-left"></div>
        <div class="field-line box-right"></div>
        <div class="ball-core">26</div>
      </div>

      <p class="desc">16 道题，3 分钟，测出你的世界杯球迷人格密码</p>

      <div v-if="latest" class="latest-strip">
        <div>
          <span>最近结果</span>
          <strong>{{ latest.personality_code }} · {{ latest.personality_name }}</strong>
        </div>
        <button type="button" @click="viewLatest">查看我的结果</button>
      </div>
    </section>

    <div class="bottom-cta bottom-safe">
      <button class="primary-btn" type="button" :disabled="ctaLocked || isLoading" @click="start">{{ ctaText }}</button>
    </div>

    <div v-if="resumeVisible" class="resume-mask">
      <div class="resume-panel">
        <h2>继续上次答题？</h2>
        <p>已答 {{ draft?.answers.length || 0 }}/16，24 小时内可从断点继续。</p>
        <button class="primary-btn" type="button" @click="continueDraft">继续答题</button>
        <button class="ghost-btn" type="button" @click="restartDraft">重新开始</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.landing {
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at 50% 34%, rgba(0, 130, 255, 0.16), transparent 34%),
    linear-gradient(180deg, #ffffff 0%, #f2f8ff 100%);
}

.landing-content {
  flex: 1;
  padding: 18px 22px 132px;
}

.topbar {
  height: 44px;
  display: flex;
  justify-content: flex-end;
}

.login-btn {
  border: 1px solid #d6e7ff;
  border-radius: 8px;
  padding: 0 14px;
  color: var(--primary);
  background: #ffffff;
  font-weight: 700;
}

.hero-copy {
  padding-top: 20px;
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--primary);
  font-size: 13px;
  font-weight: 900;
}

h1 {
  margin: 0;
  color: #111827;
  font-size: 36px;
  line-height: 1.12;
}

.slogan {
  margin: 14px 0 0;
  color: var(--text-sub);
  font-size: 16px;
}

.field-visual {
  position: relative;
  height: min(42vh, 330px);
  min-height: 260px;
  margin: 24px -2px 16px;
  border-radius: 8px;
  overflow: hidden;
  background:
    linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px) 0 0 / 24px 24px,
    linear-gradient(180deg, #0082ff 0%, #00a4ff 100%);
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);
}

.field-line {
  position: absolute;
  border: 2px solid rgba(255,255,255,0.68);
}

.center {
  left: 50%;
  top: 0;
  width: 2px;
  height: 100%;
  border-width: 0 0 0 2px;
}

.center::after {
  content: '';
  position: absolute;
  left: -52px;
  top: calc(50% - 52px);
  width: 104px;
  height: 104px;
  border: 2px solid rgba(255,255,255,0.68);
  border-radius: 999px;
}

.box-left,
.box-right {
  top: 50%;
  width: 96px;
  height: 160px;
  transform: translateY(-50%);
}

.box-left {
  left: -2px;
}

.box-right {
  right: -2px;
}

.ball-core {
  position: absolute;
  left: 50%;
  top: 50%;
  display: grid;
  place-items: center;
  width: 132px;
  height: 132px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  color: var(--primary);
  background: #ffffff;
  font-size: 58px;
  font-weight: 1000;
  box-shadow: 0 18px 44px rgba(0, 48, 118, 0.28);
}

.desc {
  margin: 0;
  color: var(--text-sub);
  text-align: center;
  font-size: 15px;
}

.latest-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
  border: 1px solid #d6e7ff;
  border-radius: 8px;
  padding: 12px;
  background: #ffffff;
}

.latest-strip span {
  display: block;
  margin-bottom: 3px;
  color: var(--text-soft);
  font-size: 12px;
}

.latest-strip strong {
  font-size: 15px;
}

.latest-strip button {
  flex: 0 0 auto;
  border: 0;
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--primary);
  background: rgba(0, 130, 255, 0.1);
  font-weight: 800;
}

.bottom-cta {
  position: fixed;
  left: 50%;
  bottom: 0;
  width: min(480px, 100%);
  transform: translateX(-50%);
  padding: 16px 22px;
  background: linear-gradient(180deg, rgba(255,255,255,0), #ffffff 28%);
}

.skeleton {
  flex: 1;
  display: grid;
  place-items: center;
  color: var(--text-sub);
}

.skeleton-ball {
  width: 84px;
  height: 84px;
  border-radius: 999px;
  background: linear-gradient(135deg, #d9ecff, #ffffff);
}

.skeleton.active .skeleton-ball {
  animation: pulse 900ms ease-in-out infinite alternate;
}

.resume-mask {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(15, 23, 42, 0.45);
}

.resume-panel {
  width: min(480px, 100%);
  border-radius: 8px 8px 0 0;
  padding: 22px 22px calc(22px + var(--safe-bottom));
  background: #ffffff;
}

.resume-panel h2 {
  margin: 0 0 8px;
  font-size: 20px;
}

.resume-panel p {
  margin: 0 0 18px;
  color: var(--text-sub);
}

.resume-panel .ghost-btn {
  width: 100%;
  margin-top: 10px;
}

@keyframes pulse {
  from {
    transform: scale(0.94);
    opacity: 0.7;
  }
  to {
    transform: scale(1.04);
    opacity: 1;
  }
}
</style>
