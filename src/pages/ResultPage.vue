<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import PosterPreviewModal from '@/components/PosterPreviewModal.vue';
import RadarChart from '@/components/RadarChart.vue';
import { PERSONAS } from '@/domains/questionBank';
import { bridge } from '@/services/bridge';
import { getLatestLocalResult, clearQuizDraft, saveLatestLocalResult } from '@/services/localRepository';
import { track } from '@/services/tracker';
import { appState, resetQuizState } from '@/stores/appState';

const router = useRouter();
const posterOpen = ref(false);

const result = computed(() => appState.currentResult ?? getLatestLocalResult());
const persona = computed(() => (result.value ? PERSONAS[result.value.personality_code] : null));
const enemy = computed(() => (result.value ? PERSONAS[result.value.enemy] : null));
const partner = computed(() => (result.value ? PERSONAS[result.value.partner] : null));

onMounted(() => {
  if (!result.value) {
    router.replace('/');
    return;
  }
  appState.currentResult = result.value;
  saveLatestLocalResult(result.value);
  track('result_page_exposure', { code: result.value.personality_code });
});

function retest() {
  clearQuizDraft();
  resetQuizState();
  track('result_retest_click');
  router.push('/quiz');
}
</script>

<template>
  <main v-if="result && persona" class="mobile-page result-page">
    <section class="result-scroll screen-scroll">
      <header class="hero" :style="{ '--persona-color': persona.color }">
        <p class="code">{{ result.personality_code }}</p>
        <h1>{{ result.personality_name }}</h1>
        <p v-if="result.is_hidden" class="hidden-badge">隐藏人格</p>
      </header>

      <section class="illustration" :style="{ '--persona-color': persona.color }">
        <div class="fan-shape">
          <span>{{ result.personality_code.slice(0, 1) }}</span>
        </div>
        <div class="tag-cloud">
          <span v-for="tag in result.tags" :key="tag">#{{ tag }}</span>
        </div>
      </section>

      <section class="content-band">
        <h2 class="section-title">球迷人格解析</h2>
        <p class="copy">{{ result.personality_copy }}</p>
      </section>

      <section class="content-band">
        <h2 class="section-title">球迷 DNA 雷达</h2>
        <RadarChart :values="result.level_vector" />
      </section>

      <section class="relation-grid">
        <button class="relation-card" type="button" @click="bridge.openRoute">
          <span>球星对照</span>
          <strong>{{ result.star }}</strong>
        </button>
        <div class="relation-card">
          <span>天敌人格</span>
          <strong>{{ enemy?.code }} · {{ enemy?.name }}</strong>
        </div>
        <div class="relation-card">
          <span>最佳拍档</span>
          <strong>{{ partner?.code }} · {{ partner?.name }}</strong>
        </div>
      </section>

      <section class="brand-zone">
        <div>
          <strong>Zhibo8</strong>
          <p>长按或扫码测试你的球迷人格</p>
        </div>
        <button class="qr" type="button" @click="bridge.openRoute" aria-label="活动二维码入口">QR</button>
      </section>
    </section>

    <footer class="action-bar bottom-safe">
      <button class="secondary-btn" type="button" @click="bridge.saveImage">保存相册</button>
      <button class="primary-btn" type="button" @click="posterOpen = true">分享名片</button>
      <button class="text-btn" type="button" @click="retest">重新预测</button>
    </footer>

    <PosterPreviewModal :open="posterOpen" :result="result" @close="posterOpen = false" />
  </main>
</template>

<style scoped>
.result-page {
  background: #f6f9ff;
}

.result-scroll {
  padding: 28px 20px 150px;
}

.hero {
  position: relative;
  min-height: 150px;
  display: grid;
  place-items: center;
  text-align: center;
}

.code {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  margin: 0;
  color: var(--persona-color);
  font-size: clamp(64px, 24vw, 116px);
  font-weight: 1000;
  opacity: 0.12;
}

h1 {
  position: relative;
  z-index: 1;
  margin: 52px 0 8px;
  font-size: 34px;
  line-height: 1.15;
}

.hidden-badge {
  position: relative;
  z-index: 1;
  margin: 0;
  border-radius: 999px;
  padding: 5px 10px;
  color: #ffffff;
  background: var(--hot-red);
  font-size: 12px;
  font-weight: 800;
}

.illustration {
  position: relative;
  min-height: 284px;
  display: grid;
  place-items: center;
  margin: 14px 0 18px;
  border-radius: 8px;
  background:
    radial-gradient(circle at center, color-mix(in srgb, var(--persona-color) 16%, transparent), transparent 60%),
    #ffffff;
  overflow: hidden;
}

.fan-shape {
  width: 154px;
  height: 190px;
  border-radius: 80px 80px 22px 22px;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: linear-gradient(180deg, var(--persona-color), #111827);
  box-shadow: 0 18px 38px rgba(0, 49, 120, 0.18);
}

.fan-shape span {
  font-size: 84px;
  font-weight: 1000;
}

.tag-cloud {
  position: absolute;
  inset: 0;
}

.tag-cloud span {
  position: absolute;
  border: 1px solid rgba(0,130,255,0.18);
  border-radius: 999px;
  padding: 7px 10px;
  color: var(--persona-color);
  background: #ffffff;
  font-size: 12px;
  font-weight: 800;
}

.tag-cloud span:nth-child(1) {
  left: 18px;
  top: 46px;
}

.tag-cloud span:nth-child(2) {
  right: 16px;
  top: 112px;
}

.tag-cloud span:nth-child(3) {
  left: 34px;
  bottom: 42px;
}

.content-band {
  margin-bottom: 14px;
  border-radius: 8px;
  padding: 20px;
  background: #ffffff;
}

.copy {
  margin: 0;
  color: #344054;
  font-size: 16px;
  line-height: 1.75;
}

.relation-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-bottom: 14px;
}

.relation-card {
  border: 0;
  border-radius: 8px;
  padding: 16px;
  color: #111827;
  background: #ffffff;
  text-align: left;
}

.relation-card span {
  display: block;
  margin-bottom: 6px;
  color: var(--text-soft);
  font-size: 12px;
}

.relation-card strong {
  font-size: 16px;
}

.brand-zone {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border-radius: 8px;
  background: #ffffff;
}

.brand-zone strong {
  color: var(--primary);
  font-size: 24px;
}

.brand-zone p {
  margin: 6px 0 0;
  color: var(--text-sub);
  font-size: 13px;
}

.qr {
  flex: 0 0 auto;
  width: 72px;
  height: 72px;
  border: 0;
  border-radius: 8px;
  color: #111827;
  background:
    linear-gradient(90deg, #111827 10px, transparent 10px) 0 0 / 18px 18px,
    linear-gradient(#111827 10px, transparent 10px) 0 0 / 18px 18px,
    #ffffff;
  box-shadow: inset 0 0 0 4px #ffffff, 0 0 0 1px #d0d5dd;
  font-size: 0;
}

.action-bar {
  position: fixed;
  left: 50%;
  bottom: 0;
  width: min(480px, 100%);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  transform: translateX(-50%);
  padding: 12px 20px;
  background: rgba(255,255,255,0.96);
  box-shadow: 0 -8px 22px rgba(15, 23, 42, 0.08);
}

.action-bar .text-btn {
  grid-column: 1 / -1;
}
</style>
