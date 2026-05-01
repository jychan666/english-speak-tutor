<script setup lang="ts">
import { mockExams, partAPassages, partBScenarios, partCStories } from '@/data/examContent'
</script>

<template>
  <section class="card head">
    <h1>练习中心</h1>
    <p class="text-secondary">
      支持 Part A / Part B / Part C 专项训练，也可以一键进入完整模拟考试。
    </p>
  </section>

  <section class="modes">
    <article class="card mode">
      <h2>Part A 模仿朗读</h2>
      <p>题量 {{ partAPassages.length }} 篇，重点提升发音准确度、流利度和语调。</p>
      <router-link class="btn-primary" to="/practice/part-a">开始 Part A</router-link>
    </article>
    <article class="card mode">
      <h2>Part B 角色扮演</h2>
      <p>题量 {{ partBScenarios.length }} 组，重点训练提问语法和回答相关性。</p>
      <router-link class="btn-primary" to="/practice/part-b">开始 Part B</router-link>
    </article>
    <article class="card mode">
      <h2>Part C 故事复述</h2>
      <p>题量 {{ partCStories.length }} 篇，重点提升关键信息覆盖和叙述连贯性。</p>
      <router-link class="btn-primary" to="/practice/part-c">开始 Part C</router-link>
    </article>
  </section>

  <section class="card mock">
    <h2>模拟考试（Part A → B → C）</h2>
    <p class="text-secondary">共 {{ mockExams.length }} 套，建议每周至少完成 1 套。</p>
    <div class="mock-grid">
      <article class="mock-item" v-for="paper in mockExams" :key="paper.id">
        <h3>{{ paper.title }}</h3>
        <p>Part A: {{ paper.partA.title }}</p>
        <p>Part B: {{ paper.partB.scenario }}</p>
        <p>Part C: {{ paper.partC.title }}</p>
        <router-link class="btn-secondary" :to="`/mock-exam?paper=${paper.id}`">
          开始这套
        </router-link>
      </article>
    </div>
  </section>
</template>

<style scoped>
.head {
  display: grid;
  gap: 10px;
}

.modes {
  margin-top: 16px;
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.mode {
  display: grid;
  gap: 10px;
}

.mock {
  margin-top: 16px;
}

.mock-grid {
  margin-top: 12px;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.mock-item {
  background: #f8fafc;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 12px;
  display: grid;
  gap: 8px;
}

.mock-item p {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}
</style>

