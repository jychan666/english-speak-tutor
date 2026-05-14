<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    value: number
    maxValue?: number
    color?: string
    showPercent?: boolean
  }>(),
  {
    maxValue: 100,
    color: 'var(--color-primary)',
    showPercent: true,
  }
)
</script>

<template>
  <div class="score-bar">
    <span class="score-bar-label">{{ label }}</span>
    <div class="score-bar-track">
      <div
        class="score-bar-fill"
        :style="{
          width: `${(value / maxValue) * 100}%`,
          backgroundColor: color,
        }"
      ></div>
    </div>
    <span v-if="showPercent" class="score-bar-value">{{ value }}</span>
  </div>
</template>

<style scoped>
.score-bar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-sm, 8px);
  align-items: center;
}

.score-bar-label {
  font-size: var(--text-sm, 0.875rem);
  color: var(--color-text-secondary, #4b5563);
  white-space: nowrap;
}

.score-bar-track {
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: #e5e7eb;
}

.score-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 400ms cubic-bezier(0.16, 1, 0.3, 1);
}

.score-bar-value {
  font-size: var(--text-sm, 0.875rem);
  font-weight: 700;
  text-align: right;
  color: var(--color-text, #1f2937);
  min-width: 28px;
}
</style>
