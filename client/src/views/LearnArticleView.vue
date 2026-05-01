<script setup lang="ts">
import { computed } from 'vue'
import { getArticleById, learnArticles } from '@/data/learnArticles'
import type { LearnSection } from '@/types/learning'

const props = defineProps<{
  category: string
  id: string
}>()

const article = computed(() => getArticleById(props.id))
const relatedArticles = computed(() =>
  learnArticles.filter((item) => article.value?.relatedArticleIds.includes(item.id))
)

function sectionLabel(section: LearnSection): string {
  switch (section.type) {
    case 'comparison':
      return '对比练习'
    case 'tip':
      return '速记提示'
    case 'template':
      return '模板'
    case 'example':
      return '示例'
    case 'heading':
      return '要点'
    default:
      return '内容'
  }
}
</script>

<template>
  <div v-if="article" class="article-page">
    <article class="card header">
      <router-link class="back" to="/learn">← 返回学习中心</router-link>
      <h1>{{ article.title }}</h1>
      <p class="text-secondary">{{ article.subtitle }}</p>
      <div class="meta">
        <span>{{ article.readTime }} 分钟阅读</span>
        <span>{{ article.level === 'beginner' ? '基础友好' : '进阶提升' }}</span>
      </div>
    </article>

    <article class="card content">
      <section
        v-for="(section, index) in article.content"
        :key="index"
        :class="['section', section.type]"
      >
        <p class="label">{{ sectionLabel(section) }}</p>
        <h3 v-if="section.title">{{ section.title }}</h3>
        <p>{{ section.body }}</p>

        <div v-if="section.type === 'comparison'" class="comparison-box">
          <p><strong>❌ 错误：</strong>{{ section.wrongExample }}</p>
          <p><strong>✅ 正确：</strong>{{ section.rightExample }}</p>
          <p v-if="section.note" class="note">💡 {{ section.note }}</p>
        </div>
      </section>
    </article>

    <article class="card quick-card">
      <h2>💡 一句话速记卡</h2>
      <p>{{ article.quickCard }}</p>
      <router-link
        class="btn-primary"
        :to="
          article.relatedPracticeType === 'A'
            ? '/practice/part-a'
            : article.relatedPracticeType === 'B'
              ? '/practice/part-b'
              : article.relatedPracticeType === 'C'
                ? '/practice/part-c'
                : '/practice'
        "
      >
        去练练看
      </router-link>
    </article>

    <article class="card related" v-if="relatedArticles.length">
      <h2>相关文章推荐</h2>
      <div class="related-list">
        <router-link
          v-for="item in relatedArticles"
          :key="item.id"
          :to="{ name: 'learn-article', params: { category: item.category, id: item.id } }"
          class="related-item"
        >
          {{ item.title }}
        </router-link>
      </div>
    </article>
  </div>

  <article v-else class="card">
    <h1>文章不存在</h1>
    <p class="text-secondary">可能已下线或链接错误，请返回学习中心重新选择。</p>
    <router-link class="btn-secondary" to="/learn">返回学习中心</router-link>
  </article>
</template>

<style scoped>
.article-page {
  display: grid;
  gap: 14px;
}

.header {
  display: grid;
  gap: 10px;
}

.back {
  color: var(--color-text-secondary);
}

.meta {
  display: flex;
  gap: 14px;
  color: var(--color-text-secondary);
  font-size: 0.92rem;
}

.content {
  display: grid;
  gap: 14px;
}

.section {
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #fff;
  display: grid;
  gap: 8px;
}

.label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-text-muted);
  letter-spacing: 0.02em;
}

.comparison-box {
  margin-top: 4px;
  display: grid;
  gap: 6px;
  background: #f8fafc;
  padding: 10px;
  border-radius: var(--radius-sm);
}

.note {
  color: #1d4ed8;
}

.quick-card {
  display: grid;
  gap: 10px;
  border: 1px dashed #f59e0b;
  background: #fffbeb;
}

.related-list {
  margin-top: 8px;
  display: grid;
  gap: 8px;
}

.related-item {
  background: #f8fafc;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 10px;
}
</style>

