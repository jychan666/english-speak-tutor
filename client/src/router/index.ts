import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/learn',
      name: 'learn',
      component: () => import('@/views/LearnHubView.vue'),
    },
    {
      path: '/learn/:category/:id',
      name: 'learn-article',
      component: () => import('@/views/LearnArticleView.vue'),
      props: true,
    },
    {
      path: '/practice',
      name: 'practice',
      component: () => import('@/views/PracticeView.vue'),
    },
    {
      path: '/practice/part-a/:id?',
      name: 'practice-part-a',
      component: () => import('@/views/PartARunView.vue'),
    },
    {
      path: '/practice/part-b/:id?',
      name: 'practice-part-b',
      component: () => import('@/views/PartBRunView.vue'),
    },
    {
      path: '/practice/part-c/:id?',
      name: 'practice-part-c',
      component: () => import('@/views/PartCRunView.vue'),
    },
    {
      path: '/mock-exam',
      name: 'mock-exam',
      component: () => import('@/views/MockExamView.vue'),
    },
    {
      path: '/result/:attemptId',
      name: 'result',
      component: () => import('@/views/ResultView.vue'),
      props: true,
    },
    {
      path: '/progress',
      name: 'progress',
      component: () => import('@/views/ProgressView.vue'),
    },
  ],
})

export default router
