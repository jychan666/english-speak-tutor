<script setup lang="ts">
import { computed, ref } from 'vue'
import { learnArticles } from '@/data/learnArticles'
import { withCategoryCounts } from '@/data/learnCategories'
import type { LearnCategory } from '@/types/learning'

const categoryCounts = learnArticles.reduce(
  (acc, article) => {
    acc[article.category] += 1
    return acc
  },
  {
    'quick-crash': 0,
    pronunciation: 0,
    grammar: 0,
    templates: 0,
    vocabulary: 0,
    tips: 0,
  } as Record<LearnCategory, number>
)

const categories = withCategoryCounts(categoryCounts)
const selectedCategory = ref<LearnCategory>(categories[0].id)

const currentCategory = computed(() =>
  categories.find((item) => item.id === selectedCategory.value)
)
const filteredArticles = computed(() =>
  learnArticles.filter((item) => item.category === selectedCategory.value)
)
</script>

<template>
  <section class="card top">
    <h1>学习中心</h1>
    <p class="text-secondary">
      先看技巧，再去练习。每篇都配有“一句话速记卡”和对应练习建议。
    </p>
  </section>

  <section class="tabs">
    <button
      v-for="category in categories"
      :key="category.id"
      :class="['tab', { active: selectedCategory === category.id }]"
      @click="selectedCategory = category.id"
    >
      <span>{{ category.icon }}</span>
      <strong>{{ category.name }}</strong>
      <small>{{ category.count }} 篇</small>
    </button>
  </section>

  <section class="card category-intro" v-if="currentCategory">
    <h2>{{ currentCategory.icon }} {{ currentCategory.name }}</h2>
    <p>{{ currentCategory.description }}</p>
  </section>

  <section class="articles">
    <article v-for="article in filteredArticles" :key="article.id" class="card article">
      <div class="article-meta">
        <span class="badge">{{ article.readTime }} 分钟</span>
        <span class="badge">{{ article.level === 'beginner' ? '基础' : '进阶' }}</span>
      </div>
      <h3>{{ article.title }}</h3>
      <p class="text-secondary">{{ article.subtitle }}</p>
      <div class="article-actions">
        <router-link
          class="btn-primary"
          :to="{
            name: 'learn-article',
            params: { category: article.category, id: article.id },
          }"
        >
          阅读文章
        </router-link>
        <router-link
          v-if="article.relatedPracticeType"
          class="btn-secondary"
          :to="
            article.relatedPracticeType === 'A'
              ? '/practice/part-a'
              : article.relatedPracticeType === 'B'
                ? '/practice/part-b'
                : '/practice/part-c'
          "
        >
          去练练看
        </router-link>
      </div>
    </article>
  </section>
</template>

<style scoped>
.top {
  display: grid;
  gap: 10px;
}

.tabs {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.tab {
  display: grid;
  gap: 2px;
  justify-items: start;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: var(--radius-md);
}

.tab.active {
  border-color: var(--color-primary);
  background: #eef2ff;
}

.tab span {
  font-size: 1.2rem;
}

.tab small {
  color: var(--color-text-secondary);
}

.category-intro {
  margin-top: 16px;
}

.articles {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.article {
  display: grid;
  gap: 10px;
}

.article-meta {
  display: flex;
  gap: 8px;
}

.badge {
  font-size: 0.82rem;
  color: var(--color-text-secondary);
  background: var(--color-surface-hover);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}

.article-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>

