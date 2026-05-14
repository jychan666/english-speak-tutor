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
    <!-- Part A -->
    <article class="mode-card mode-a">
      <div class="mode-color-bar bar-a"></div>
      <div class="mode-body">
        <span class="mode-badge badge-a">Part A</span>
        <h2 class="mode-title">模仿朗读</h2>
        <p class="mode-desc">
          题量 {{ partAPassages.length }} 篇，重点提升发音准确度、流利度和语调。
        </p>
        <router-link class="btn-primary mode-btn" to="/practice/part-a">开始 Part A</router-link>
      </div>
    </article>

    <!-- Part B -->
    <article class="mode-card mode-b">
      <div class="mode-color-bar bar-b"></div>
      <div class="mode-body">
        <span class="mode-badge badge-b">Part B</span>
        <h2 class="mode-title">角色扮演</h2>
        <p class="mode-desc">
          题量 {{ partBScenarios.length }} 组，重点训练提问语法和回答相关性。
        </p>
        <router-link class="btn-primary mode-btn" to="/practice/part-b">开始 Part B</router-link>
      </div>
    </article>

    <!-- Part C -->
    <article class="mode-card mode-c">
      <div class="mode-color-bar bar-c"></div>
      <div class="mode-body">
        <span class="mode-badge badge-c">Part C</span>
        <h2 class="mode-title">故事复述</h2>
        <p class="mode-desc">
          题量 {{ partCStories.length }} 篇，重点提升关键信息覆盖和叙述连贯性。
        </p>
        <router-link class="btn-primary mode-btn" to="/practice/part-c">开始 Part C</router-link>
      </div>
    </article>
  </section>

  <!-- ======== 模拟考试区 ======== -->
  <hr class="divider" />
  <section class="mock-section">
    <div class="mock-header">
      <h2>模拟考试（Part A → B → C）</h2>
      <p class="text-secondary">共 {{ mockExams.length }} 套，建议每周至少完成 1 套。</p>
    </div>
    <div class="mock-grid">
      <article
        v-for="paper in mockExams"
        :key="paper.id"
        class="mock-card"
      >
        <span class="mock-badge">模拟卷</span>
        <h3 class="mock-title">{{ paper.title }}</h3>
        <ul class="mock-parts">
          <li class="mock-part"><span class="part-ind part-ind-a">A</span> {{ paper.partA.title }}</li>
          <li class="mock-part"><span class="part-ind part-ind-b">B</span> {{ paper.partB.scenario }}</li>
          <li class="mock-part"><span class="part-ind part-ind-c">C</span> {{ paper.partC.title }}</li>
        </ul>
        <router-link
          class="btn-secondary mock-start-btn"
          :to="`/mock-exam?paper=${paper.id}`"
        >
          开始这套
        </router-link>
      </article>
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

/* ======== 单张模式卡片 ======== */
.mode-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform var(--duration-normal) var(--ease-out-expo),
              box-shadow var(--duration-normal) var(--ease-out-expo);
}
.mode-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 顶部 3px 全宽色条 */
.mode-color-bar {
  height: 3px;
  width: 100%;
}
.bar-a { background: var(--color-part-a); }
.bar-b { background: var(--color-part-b); }
.bar-c { background: var(--color-part-c); }

.mode-body {
  padding: var(--space-lg);
  display: grid;
  gap: var(--space-sm);
  flex: 1;
}

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
  color: var(--color-text);
}

.mode-desc {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.6;
}

.mode-btn {
  justify-self: start;
  margin-top: var(--space-xs);
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

/* 模拟卷卡片 */
.mock-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: grid;
  gap: var(--space-sm);
  transition: transform var(--duration-normal) var(--ease-out-expo),
              box-shadow var(--duration-normal) var(--ease-out-expo);
}
.mock-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
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
  color: var(--color-text);
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

.mock-start-btn {
  justify-self: start;
  margin-top: var(--space-xs);
}

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
