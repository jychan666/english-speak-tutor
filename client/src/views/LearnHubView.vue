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
  <div class="hub-container">
    <!-- ========== 顶部标题 ========== -->
    <section class="hub-header">
      <h1 class="hub-title">学习中心</h1>
      <p class="hub-desc">
        先看技巧，再去练习。每篇都配有"一句话速记卡"和对应练习建议。
      </p>
    </section>

    <!-- ========== 分类 Pill Tab 条 ========== -->
    <nav class="pill-nav" aria-label="文章分类">
      <div class="pill-scroll">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="['pill-tab', { 'pill-tab--active': selectedCategory === category.id }]"
          @click="selectedCategory = category.id"
        >
          <span class="pill-icon">{{ category.icon }}</span>
          <span class="pill-name">{{ category.name }}</span>
          <span
            v-if="category.count > 0"
            :class="['pill-count', { 'pill-count--active': selectedCategory === category.id }]"
          >
            {{ category.count }}
          </span>
        </button>
      </div>
    </nav>

    <!-- ========== 分类说明卡 ========== -->
    <section v-if="currentCategory" class="category-banner">
      <div class="category-banner-bar"></div>
      <div class="category-banner-body">
        <h2 class="category-banner-title">
          {{ currentCategory.icon }} {{ currentCategory.name }}
        </h2>
        <p class="category-banner-desc">{{ currentCategory.description }}</p>
      </div>
    </section>

    <!-- ========== 文章卡片网格 ========== -->
    <section class="articles-section">
      <!-- 有文章 -->
      <template v-if="filteredArticles.length > 0">
        <div class="articles-grid">
          <article
            v-for="article in filteredArticles"
            :key="article.id"
            class="card article-card"
          >
            <div class="article-card-top">
              <span class="article-badge article-badge--time">
                <span class="article-badge-icon">&#9202;</span>
                {{ article.readTime }} 分钟
              </span>
              <span
                :class="[
                  'article-badge',
                  article.level === 'beginner'
                    ? 'article-badge--beginner'
                    : 'article-badge--advanced',
                ]"
              >
                {{ article.level === 'beginner' ? '基础' : '进阶' }}
              </span>
            </div>
            <h3 class="article-card-title">{{ article.title }}</h3>
            <p class="article-card-desc">{{ article.subtitle }}</p>
            <div class="article-card-actions">
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
        </div>
      </template>

      <!-- 空态 -->
      <div v-else class="articles-empty">
        <p class="articles-empty-icon">📭</p>
        <p class="articles-empty-text">该分类暂无文章，敬请期待</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hub-container {
  max-width: 960px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-md) var(--space-3xl);
  display: grid;
  gap: var(--space-lg);
}

/* ======== 顶部标题 ======== */
.hub-header {
  display: grid;
  gap: var(--space-sm);
}

.hub-title {
  font-size: var(--text-3xl);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.hub-desc {
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  max-width: 600px;
  line-height: 1.7;
}

/* ======== Pill Tab 条 ======== */
.pill-nav {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.pill-nav::-webkit-scrollbar {
  display: none;
}

.pill-scroll {
  display: flex;
  gap: var(--space-sm);
  padding: 2px 0;
  min-width: min-content;
}

.pill-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 999px;
  border: 1.5px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out-expo);
  flex-shrink: 0;
}

.pill-tab:hover {
  border-color: var(--color-primary-light);
  color: var(--color-primary);
  background: var(--color-surface-hover);
}

.pill-tab--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
  box-shadow: 0 2px 8px rgba(15, 118, 110, 0.25);
}

.pill-tab--active:hover {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  color: #fff;
}

.pill-icon {
  font-size: 1.1rem;
  line-height: 1;
}

.pill-name {
  font-weight: 600;
}

.pill-count {
  font-size: var(--text-xs);
  font-weight: 700;
  background: var(--color-surface-hover);
  color: var(--color-text-muted);
  border-radius: 999px;
  padding: 1px 8px;
  min-width: 20px;
  text-align: center;
  transition: all var(--duration-normal) var(--ease-out-expo);
}

.pill-count--active {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

/* ======== 分类说明卡 ======== */
.category-banner {
  display: flex;
  background: var(--color-surface-hover);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.category-banner-bar {
  width: 4px;
  flex-shrink: 0;
  background: var(--color-primary);
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
}

.category-banner-body {
  padding: var(--space-md) var(--space-lg);
  display: grid;
  gap: var(--space-xs);
}

.category-banner-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
}

.category-banner-desc {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.7;
}

/* ======== 文章卡片 ======== */
.articles-section {
  display: grid;
  gap: var(--space-md);
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-md);
}

.article-card {
  display: grid;
  gap: var(--space-sm);
  padding: var(--space-lg);
  border: 1px solid var(--color-border);
  transition: border-color var(--duration-normal) var(--ease-out-expo),
              transform var(--duration-normal) var(--ease-out-expo),
              box-shadow var(--duration-normal) var(--ease-out-expo),
              background var(--duration-normal) var(--ease-out-expo);
  position: relative;
}

.article-card:hover {
  border-color: var(--color-primary);
  background: var(--color-surface-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.article-card-top {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
}

.article-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 999px;
}

.article-badge--time {
  background: var(--color-surface-hover);
  color: var(--color-text-secondary);
}

.article-badge--beginner {
  background: #dcfce7;
  color: #166534;
}

.article-badge--advanced {
  background: #fef3c7;
  color: #92400e;
}

.article-badge-icon {
  font-size: 0.75rem;
}

.article-card-title {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.5;
}

.article-card-desc {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.6;
}

.article-card-actions {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
  margin-top: var(--space-xs);
}

/* ======== 空态 ======== */
.articles-empty {
  display: grid;
  gap: var(--space-md);
  justify-items: center;
  text-align: center;
  padding: var(--space-3xl) var(--space-lg);
  background: var(--color-surface);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
}

.articles-empty-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.articles-empty-text {
  color: var(--color-text-muted);
  font-size: var(--text-base);
}

/* ======== 响应式 ======== */
@media (max-width: 768px) {
  .hub-container {
    padding: var(--space-lg) var(--space-md) var(--space-2xl);
    gap: var(--space-md);
  }

  .hub-title {
    font-size: var(--text-2xl);
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .pill-tab {
    padding: 8px 14px;
    font-size: var(--text-xs);
  }
}

@media (max-width: 480px) {
  .hub-container {
    padding: var(--space-md) var(--space-sm) var(--space-xl);
  }

  .pill-scroll {
    gap: 6px;
  }

  .pill-tab {
    padding: 6px 12px;
  }

  .article-card-actions {
    flex-direction: column;
  }

  .article-card-actions .btn-primary,
  .article-card-actions .btn-secondary {
    width: 100%;
    text-align: center;
  }
}
</style>
