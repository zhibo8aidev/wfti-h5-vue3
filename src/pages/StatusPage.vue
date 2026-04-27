<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const content = computed(() => {
  if (route.params.type === 'ended') {
    return {
      title: '活动已结束',
      desc: '感谢参与，我们下届世界杯再见'
    };
  }
  if (route.params.type === 'network') {
    return {
      title: '网络连接异常',
      desc: '网络异常，请检查网络后重试'
    };
  }
  return {
    title: '活动即将开始',
    desc: '敬请期待，开启你的世界杯球迷人格之旅'
  };
});
</script>

<template>
  <main class="mobile-page status-page">
    <div class="status-icon">!</div>
    <h1>{{ content.title }}</h1>
    <p>{{ content.desc }}</p>
    <button class="primary-btn" type="button" @click="router.replace('/')">返回首页</button>
  </main>
</template>

<style scoped>
.status-page {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 16px;
  padding: 32px;
  text-align: center;
  background: #ffffff;
}

.status-icon {
  display: grid;
  place-items: center;
  width: 74px;
  height: 74px;
  border-radius: 999px;
  color: #ffffff;
  background: var(--primary);
  font-size: 42px;
  font-weight: 1000;
}

h1 {
  margin: 0;
  font-size: 26px;
}

p {
  margin: 0 0 12px;
  color: var(--text-sub);
  line-height: 1.6;
}
</style>
