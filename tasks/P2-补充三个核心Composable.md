# P2：补充三个核心 Composable

## 概述

目前项目中只有 `useSpeechRecognition` 一个 composable，缺少语音合成、录音和计时器三个关键工具。这些被多个视图（Part A/B/C、MockExam）依赖。

## 修改文件

| 文件 | 操作 |
|------|------|
| `client/src/composables/useSpeechSynthesis.ts` | **新建** |
| `client/src/composables/useAudioRecorder.ts` | **新建** |
| `client/src/composables/useTimer.ts` | **新建** |

---

## 任务 2a：useSpeechSynthesis.ts

### 要求

封装 `SpeechSynthesisUtterance` API，提供以下接口：

```typescript
export function useSpeechSynthesis()
```

**返回值：**

| 名称 | 类型 | 说明 |
|------|------|------|
| `supported` | `boolean` | 当前浏览器是否支持 TTS |
| `speaking` | `Ref<boolean>` | 是否正在播放 |
| `paused` | `Ref<boolean>` | 是否暂停 |
| `speak(text, options?)` | `(text: string, options?: SpeechOptions) => Promise<void>` | 播放文本，返回 Promise 在播放结束时 resolve |
| `stop()` | `() => void` | 立即停止播放 |
| `pause()` | `() => void` | 暂停 |
| `resume()` | `() => void` | 恢复 |

**SpeechOptions 类型：**

```typescript
export interface SpeechOptions {
  rate?: number      // 语速，默认 1
  pitch?: number     // 音调，默认 1
  lang?: string      // 语言，默认 'en-US'
  volume?: number    // 音量，默认 1
}
```

**注意：**
- `speak()` 返回 Promise，在 `onend` 事件中 resolve
- 调用 `speak()` 前先 `cancel()` 避免重叠
- 使用 `onerror` 时 reject Promise
- `supported` 检测 `typeof window !== 'undefined' && 'speechSynthesis' in window`

---

## 任务 2b：useAudioRecorder.ts

### 要求

封装 `MediaRecorder` API，提供录音和回放功能：

```typescript
export function useAudioRecorder()
```

**返回值：**

| 名称 | 类型 | 说明 |
|------|------|------|
| `supported` | `boolean` | 浏览器是否支持录音 |
| `recording` | `Ref<boolean>` | 是否正在录音 |
| `recordedBlob` | `Ref<Blob \| null>` | 录音生成的 Blob |
| `audioUrl` | `ComputedRef<string \| null>` | 可用于 `<audio>` 标签的 URL |
| `start()` | `() => void` | 开始录音 |
| `stop()` | `() => void` | 停止录音 |
| `reset()` | `() => void` | 清除录音数据 |

**注意：**
- `supported` 检测 `navigator.mediaDevices && navigator.mediaDevices.getUserMedia`
- MIME 类型优先使用 `audio/webm;codecs=opus`，回退到 `audio/webm`
- `audioUrl` 使用 `URL.createObjectURL` 生成，注意内存管理（revoke）
- 错误处理：用户拒绝麦克风权限时 `error.value` 设置中文提示

---

## 任务 2c：useTimer.ts

### 要求

通用正计时/倒计时 composable，替代各视图中重复的 `setInterval` 代码：

```typescript
export function useTimer()
```

**返回值：**

| 名称 | 类型 | 说明 |
|------|------|------|
| `elapsedSeconds` | `Ref<number>` | 已过秒数（正计时） |
| `remainingSeconds` | `ComputedRef<number>` | 剩余秒数（倒计时模式） |
| `isRunning` | `Ref<boolean>` | 计时器是否运行中 |
| `start()` | `() => void` | 开始计时 |
| `stop()` | `() => void` | 停止计时 |
| `reset()` | `() => void` | 重置为 0 |
| `setDuration(seconds)` | `(n: number) => void` | 设置倒计时总时长 |

**行为：**
- 默认正计时模式（elapsedSeconds 递增）
- 调用 `setDuration()` 后进入倒计时模式（remainingSeconds 递减到 0 自动 stop）
- 使用 `setInterval` 每秒更新
- 组件 `onUnmounted` 时自动清理 `clearInterval`
- 连续调用 `start()` 不重复创建多个 interval

---

## 验收标准

1. 三个文件均存在且导出正确的函数签名
2. `useSpeechSynthesis.speak()` 返回 Promise，播放结束时 resolve
3. `useAudioRecorder` 正确生成可播放的 audio URL
4. `useTimer` 在组件卸载时自动清理定时器
5. 不破坏现有代码（现有视图仍能正常工作）
6. TypeScript 编译无错误

## 依赖

无。可独立执行。
