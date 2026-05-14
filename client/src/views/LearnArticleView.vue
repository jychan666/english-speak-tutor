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
    <!-- ======== 文章头部 ======== -->
    <article class="card article-header">
      <router-link class="back-link" to="/learn">← 返回学习中心</router-link>
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="header-tags">
        <span class="header-tag tag-readtime">⏱ {{ article.readTime }} 分钟阅读</span>
        <span class="header-tag tag-level">
          {{ article.level === 'beginner' ? '📗 基础友好' : '📘 进阶提升' }}
        </span>
      </div>
      <p class="article-subtitle">{{ article.subtitle }}</p>
    </article>

    <!-- ======== 文章正文 ======== -->
    <article class="card article-content">
      <section
        v-for="(section, index) in article.content"
        :key="index"
        :class="['content-section', `section-${section.type}`]"
      >
        <span class="section-label">{{ sectionLabel(section) }}</span>
        <h3 v-if="section.title" class="section-title">{{ section.title }}</h3>

        <!-- text / heading -->
        <p
          v-if="(section.type === 'text' || section.type === 'heading') && section.body"
          class="section-body"
        >
          {{ section.body }}
        </p>

        <!-- comparison: intro body + two-column grid -->
        <template v-if="section.type === 'comparison'">
          <p v-if="section.body" class="section-body">{{ section.body }}</p>
          <div class="comparison-grid">
            <div class="comparison-col wrong-col">
              <p class="comparison-heading">❌ 错误</p>
              <p class="comparison-text">{{ section.wrongExample }}</p>
            </div>
            <div class="comparison-col right-col">
              <p class="comparison-heading">✅ 正确</p>
              <p class="comparison-text">{{ section.rightExample }}</p>
            </div>
          </div>
          <p v-if="section.note" class="comparison-note">💡 {{ section.note }}</p>
        </template>

        <!-- tip: yellow box -->
        <div v-if="section.type === 'tip'" class="tip-box">
          <p>💡 {{ section.body }}</p>
        </div>

        <!-- example: gray box with monospace -->
        <div v-if="section.type === 'example'" class="example-box">
          <code>{{ section.body }}</code>
        </div>

        <!-- template: dashed border -->
        <div v-if="section.type === 'template'" class="template-box">
          <p>{{ section.body }}</p>
        </div>
      </section>
    </article>

    <!-- ======== 一句话速记卡 ======== -->
    <article class="quick-card">
      <h2 class="quick-card-title">💡 一句话速记卡</h2>
      <p class="quick-card-text">{{ article.quickCard }}</p>
      <div class="quick-card-action">
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
      </div>
    </article>

    <!-- ======== 相关文章 ======== -->
    <article class="card related-section" v-if="relatedArticles.length">
      <h2 class="related-heading">相关文章推荐</h2>
      <div class="related-pills">
        <router-link
          v-for="item in relatedArticles"
          :key="item.id"
          :to="{ name: 'learn-article', params: { category: item.category, id: item.id } }"
          class="related-pill"
        >
          {{ item.title }}
        </router-link>
      </div>
    </article>
  </div>

  <!-- ======== 404 状态 ======== -->
  <article v-else class="card not-found">
    <h1>文章不存在</h1>
    <p class="text-secondary">可能已下线或链接错误，请返回学习中心重新选择。</p>
    <router-link class="btn-secondary" to="/learn">返回学习中心</router-link>
  </article>
</template>

<style scoped>
/* ======== 页面布局 ======== */
.article-page {
  display: grid;
  gap: var(--space-md);
}

/* ======== 文章头部 ======== */
.article-header {
  display: grid;
  gap: var(--space-sm);
}

.back-link {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  font-weight: 500;
  text-decoration: none;
  transition: color var(--duration-fast);
  justify-self: start;
}
.back-link:hover {
  color: var(--color-primary);
}

.article-title {
  font-size: var(--text-3xl);
  font-weight: 800;
  line-height: 1.25;
  color: var(--color-text);
}

.header-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.header-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: var(--text-sm);
  font-weight: 600;
}

.tag-readtime {
  background: var(--color-surface-hover);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.tag-level {
  background: #ecfdf5;
  color: var(--color-primary-dark);
  border: 1px solid #a7f3d0;
}

.article-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--text-lg);
  line-height: 1.6;
}

/* ======== 正文区域 ======== */
.article-content {
  display: grid;
  gap: var(--space-md);
}

.content-section {
  padding: var(--space-md);
  border-radius: var(--radius-md);
  display: grid;
  gap: var(--space-sm);
}

.section-text,
.section-heading {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.section-label {
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text-muted);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
}

.section-body {
  color: var(--color-text-secondary);
  line-height: 1.7;
}

/* ======== Comparison 对比双栏 ======== */
.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-sm);
  margin-top: var(--space-xs);
}

.comparison-col {
  padding: var(--space-md);
  border-radius: var(--radius-md);
  border: 1px solid;
  display: grid;
  gap: var(--space-xs);
  align-content: start;
}

.wrong-col {
  background: #fef2f2;
  border-color: #fecaca;
}

.right-col {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.comparison-heading {
  font-weight: 700;
  font-size: var(--text-sm);
}

.wrong-col .comparison-heading {
  color: #991b1b;
}

.right-col .comparison-heading {
  color: #166534;
}

.comparison-text {
  color: var(--color-text);
  font-size: var(--text-sm);
  line-height: 1.6;
}

.comparison-note {
  grid-column: 1 / -1;
  margin-top: var(--space-xs);
  padding: 10px 14px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: var(--radius-sm);
  color: #1e40af;
  font-size: var(--text-sm);
  line-height: 1.6;
}

/* ======== Tip 提示框 ======== */
.section-tip {
  background: #fffbeb;
  border: 1px solid #fde68a;
}

.tip-box p {
  color: #92400e;
  line-height: 1.7;
  font-size: var(--text-base);
}

/* ======== Example 示例框 ======== */
.section-example {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
}

.example-box code {
  display: block;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text);
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
}

/* ======== Template 模板框 ======== */
.section-template {
  background: var(--color-surface);
  border: 2px dashed var(--color-border);
}

.template-box p {
  color: var(--color-text-secondary);
  line-height: 1.7;
  font-style: italic;
}

/* ======== 速记卡 ======== */
.quick-card {
  background: #fff7ed;
  border: 2px solid var(--color-accent);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: grid;
  gap: var(--space-sm);
  position: relative;
}

.quick-card-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-accent);
}

.quick-card-text {
  color: var(--color-text);
  font-size: var(--text-lg);
  font-weight: 600;
  line-height: 1.6;
  padding: var(--space-md);
  background: rgba(255, 255, 255, 0.7);
  border-radius: var(--radius-md);
  border: 1px dashed var(--color-accent);
}

.quick-card-action {
  justify-self: start;
}

/* ======== 相关文章 ======== */
.related-section {
  display: grid;
  gap: var(--space-md);
}

.related-heading {
  font-size: var(--text-xl);
  font-weight: 700;
}

.related-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.related-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  border-radius: 999px;
  background: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: var(--text-sm);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-out-expo);
}
.related-pill:hover {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

/* ======== 404 ======== */
.not-found {
  display: grid;
  gap: var(--space-md);
  justify-items: start;
}

/* ======== 响应式 ======== */
@media (max-width: 767px) {
  .comparison-grid {
    grid-template-columns: 1fr;
  }

  .article-title {
    font-size: var(--text-2xl);
  }

  .related-pills {
    flex-direction: column;
  }

  .related-pill {
    justify-content: center;
  }
}
</style>
