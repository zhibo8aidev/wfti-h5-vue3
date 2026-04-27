import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/pages/LandingPage.vue')
  },
  {
    path: '/quiz',
    name: 'quiz',
    component: () => import('@/pages/QuizPage.vue')
  },
  {
    path: '/calculating',
    name: 'calculating',
    component: () => import('@/pages/CalculatingPage.vue')
  },
  {
    path: '/result',
    name: 'result',
    component: () => import('@/pages/ResultPage.vue')
  },
  {
    path: '/status/:type',
    name: 'status',
    component: () => import('@/pages/StatusPage.vue')
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});
