import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SkillProfile } from '@/types/learning'
import { api } from '@/utils/api'

export const useSkillProfileStore = defineStore('skillProfile', () => {
  const profile = ref<SkillProfile>({
    pronunciation: 0,
    fluency: 0,
    grammar: 0,
    vocabulary: 0,
    contentRetention: 0,
    updatedAt: '',
  })
  const loading = ref(false)

  const weakestSkill = computed(() => {
    const skills = [
      { key: 'pronunciation' as const, label: '发音' },
      { key: 'fluency' as const, label: '流利度' },
      { key: 'grammar' as const, label: '语法' },
      { key: 'vocabulary' as const, label: '词汇' },
      { key: 'contentRetention' as const, label: '内容复述' },
    ]
    return skills.reduce((min, s) =>
      profile.value[s.key] < profile.value[min.key] ? s : min
    )
  })

  const strongestSkill = computed(() => {
    const skills = [
      { key: 'pronunciation' as const, label: '发音' },
      { key: 'fluency' as const, label: '流利度' },
      { key: 'grammar' as const, label: '语法' },
      { key: 'vocabulary' as const, label: '词汇' },
      { key: 'contentRetention' as const, label: '内容复述' },
    ]
    return skills.reduce((max, s) =>
      profile.value[s.key] > profile.value[max.key] ? s : max
    )
  })

  async function fetchProfile() {
    loading.value = true
    try {
      const res = await api.get('/api/skills/profile')
      if (res.data?.success) {
        profile.value = res.data.data
      }
    } catch {
      // Not computed yet
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    loading,
    weakestSkill,
    strongestSkill,
    fetchProfile,
  }
})
