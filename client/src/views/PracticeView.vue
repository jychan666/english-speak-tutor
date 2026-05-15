<script setup lang="ts">
import { mockExams, partAPassages, partBScenarios, partCStories } from '@/data/examContent'
</script>

<template>
  <!-- ======== 页面头部 ======== -->
  <section class="card practice-head">
    <h1>练习中心</h1>
    <p class="text-secondary">
      支持 Part A / Part B / Part C 专项训练，也可以一键进入完整模拟考试。
    </p>
  </section>

  <!-- ======== Part 专项训练卡片 ======== -->
  <section class="modes-grid">
    <router-link to="/practice/part-a" class="mode-card">
      <span class="mode-badge badge-a">Part A</span>
      <h2 class="mode-title">模仿朗读</h2>
      <p class="mode-desc">题量 {{ partAPassages.length }} 篇，重点提升发音准确度、流利度和语调。</p>
      <span class="mode-arrow">→</span>
    </router-link>

    <router-link to="/practice/part-b" class="mode-card">
      <span class="mode-badge badge-b">Part B</span>
      <h2 class="mode-title">角色扮演</h2>
      <p class="mode-desc">题量 {{ partBScenarios.length }} 组，重点训练提问语法和回答相关性。</p>
      <span class="mode-arrow">→</span>
    </router-link>

    <router-link to="/practice/part-c" class="mode-card">
      <span class="mode-badge badge-c">Part C</span>
      <h2 class="mode-title">故事复述</h2>
      <p class="mode-desc">题量 {{ partCStories.length }} 篇，重点提升关键信息覆盖和叙述连贯性。</p>
      <span class="mode-arrow">→</span>
    </router-link>
  </section>

  <!-- ======== 模拟考试区 ======== -->
  <hr class="divider" />
  <section class="mock-section">
    <div class="mock-header">
      <h2>模拟考试（Part A → B → C）</h2>
      <p class="text-secondary">共 {{ mockExams.length }} 套，建议每周至少完成 1 套。</p>
    </div>
    <div class="mock-grid">
      <router-link
        v-for="paper in mockExams"
        :key="paper.id"
        :to="`/mock-exam?paper=${paper.id}`"
        class="mock-card"
      >
        <span class="mock-badge">模拟卷</span>
        <h3 class="mock-title">{{ paper.title }}</h3>
        <ul class="mock-parts">
          <li class="mock-part"><span class="part-ind part-ind-a">A</span> {{ paper.partA.title }}</li>
          <li class="mock-part"><span class="part-ind part-ind-b">B</span> {{ paper.partB.scenario }}</li>
          <li class="mock-part"><span class="part-ind part-ind-c">C</span> {{ paper.partC.title }}</li>
        </ul>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
/* ======== 页面头部 ======== */
.practice-head {
  display: grid;
  gap: var(--space-sm);
}

/* ======== Part 专项卡片网格 ======== */
.modes-grid {
  margin-top: var(--space-md);
  display: grid;
  gap: var(--space-md);
  grid-template-columns: repeat(3, 1fr);
}

/* ======== 模式卡片（整卡可点击） ======== */
.mode-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  padding: var(--space-lg);
  display: grid;
  gap: var(--space-sm);
  align-content: start;
  color: var(--color-text);
  text-decoration: none;
  position: relative;
  transition: transform var(--duration-normal) var(--ease-out-expo),
              box-shadow var(--duration-normal) var(--ease-out-expo),
              border-color var(--duration-normal) var(--ease-out-expo);
}
.mode-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}
.mode-card:nth-child(1):hover { border-color: var(--color-part-a); }
.mode-card:nth-child(2):hover { border-color: var(--color-part-b); }
.mode-card:nth-child(3):hover { border-color: var(--color-part-c); }

/* Part 编号徽章 */
.mode-badge {
  display: inline-flex;
  align-items: center;
  justify-self: start;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.02em;
}
.badge-a { background: #e0f2fe; color: #0369a1; }
.badge-b { background: #ccfbf1; color: #0f766e; }
.badge-c { background: #ffedd5; color: #c2410c; }

.mode-title {
  font-size: var(--text-xl);
  font-weight: 700;
}

.mode-desc {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.6;
}

.mode-arrow {
  justify-self: end;
  margin-top: var(--space-xs);
  font-size: var(--text-lg);
  color: var(--color-text-muted);
  transition: transform var(--duration-fast) ease,
              color var(--duration-fast) ease;
}
.mode-card:hover .mode-arrow {
  transform: translateX(3px);
  color: var(--color-primary);
}

/* ======== 模拟考试 ======== */
.mock-section {
  display: grid;
  gap: var(--space-md);
}

.mock-header {
  display: grid;
  gap: var(--space-xs);
}

.mock-grid {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

/* 模拟卷卡片（整卡可点击） */
.mock-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: grid;
  gap: var(--space-sm);
  color: var(--color-text);
  text-decoration: none;
  transition: transform var(--duration-normal) var(--ease-out-expo),
              box-shadow var(--duration-normal) var(--ease-out-expo);
}
.mock-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.mock-badge {
  display: inline-flex;
  align-items: center;
  justify-self: start;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: var(--text-xs);
  font-weight: 700;
  background: #fef3c7;
  color: #92400e;
}

.mock-title {
  font-size: var(--text-base);
  font-weight: 700;
}

.mock-parts {
  list-style: none;
  display: grid;
  gap: 4px;
}

.mock-part {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 6px;
}

.part-ind {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}
.part-ind-a { background: var(--color-part-a); }
.part-ind-b { background: var(--color-part-b); }
.part-ind-c { background: var(--color-part-c); }

/* ======== 响应式 ======== */
@media (max-width: 767px) {
  .modes-grid {
    grid-template-columns: 1fr;
  }

  .mock-grid {
    grid-template-columns: 1fr;
  }
}
</style>
