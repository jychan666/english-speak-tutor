<script setup lang="ts">
defineProps<{
  title: string
  errors?: Array<{ detail: string; suggestion: string }>
  articles?: string[]
  strengthText?: string
  weaknessText?: string
}>()
</script>

<template>
  <div class="diagnosis-card">
    <h3 class="diagnosis-card-title">{{ title }}</h3>
    <p v-if="strengthText" class="diag-line diag-line--strength">
      <span class="diag-dot diag-dot--strength"></span>
      {{ strengthText }}
    </p>
    <p v-if="weaknessText" class="diag-line diag-line--weakness">
      <span class="diag-dot diag-dot--weakness"></span>
      {{ weaknessText }}
    </p>
    <ul v-if="errors && errors.length" class="diag-errors">
      <li v-for="(item, i) in errors" :key="i" class="diag-error-item">
        <strong class="diag-error-detail">{{ item.detail }}</strong>
        <span class="diag-error-suggestion">{{ item.suggestion }}</span>
      </li>
    </ul>
    <div v-if="articles && articles.length" class="diag-articles">
      <span v-for="id in articles" :key="id" class="diag-article-pill">{{ id }}</span>
    </div>
  </div>
</template>

<style scoped>
.diagnosis-card {
  display: grid;
  gap: var(--space-sm, 8px);
  background: #f8fafc;
  border: 1px solid var(--color-border, #dbe7e3);
  border-radius: var(--radius-md, 10px);
  padding: 16px;
}

.diagnosis-card-title {
  font-size: var(--text-base, 1rem);
  font-weight: 700;
  color: var(--color-text, #1f2937);
}

.diag-line {
  font-size: var(--text-sm, 0.875rem);
  line-height: 1.6;
  padding: 8px 12px;
  border-radius: var(--radius-sm, 6px);
}

.diag-line--strength {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
}

.diag-line--weakness {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.diag-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 6px;
  vertical-align: middle;
}

.diag-dot--strength {
  background: var(--color-success, #22c55e);
}

.diag-dot--weakness {
  background: var(--color-error, #ef4444);
}

.diag-errors {
  list-style: none;
  display: grid;
  gap: var(--space-sm, 8px);
}

.diag-error-item {
  padding: 8px 12px;
  border: 1px solid var(--color-border, #dbe7e3);
  border-radius: var(--radius-sm, 6px);
  background: var(--color-surface, #ffffff);
  display: grid;
  gap: 2px;
}

.diag-error-detail {
  font-size: var(--text-sm, 0.875rem);
  font-weight: 600;
  color: var(--color-text, #1f2937);
}

.diag-error-suggestion {
  font-size: var(--text-xs, 0.75rem);
  color: var(--color-text-secondary, #4b5563);
  line-height: 1.5;
}

.diag-articles {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm, 8px);
  align-items: center;
}

.diag-article-pill {
  font-size: var(--text-xs, 0.75rem);
  font-weight: 500;
  border: 1px solid var(--color-primary, #0f766e);
  border-radius: 999px;
  padding: 2px 12px;
  color: var(--color-primary, #0f766e);
  background: #f0fdf4;
}
</style>
