import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StoredAttempt } from '../types/attempt'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.resolve(__dirname, '../../data/attempts')

function getFilePath(token: string): string {
  return path.join(dataDir, `${token}.json`)
}

export function initDbSchema() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

function readStore(token: string): StoredAttempt[] {
  initDbSchema()
  const filePath = getFilePath(token)
  try {
    if (!fs.existsSync(filePath)) {
      return []
    }
    const raw = fs.readFileSync(filePath, 'utf8')
    const parsed = JSON.parse(raw) as StoredAttempt[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStore(token: string, attempts: StoredAttempt[]) {
  initDbSchema()
  fs.writeFileSync(getFilePath(token), JSON.stringify(attempts, null, 2), 'utf8')
}

export function listAttempts(token?: string, limit = 100): StoredAttempt[] {
  const resolvedToken = token || '_default'
  return readStore(resolvedToken)
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export function upsertAttempt(token: string | undefined, attempt: StoredAttempt) {
  const resolvedToken = token || '_default'
  const attempts = readStore(resolvedToken)
  const index = attempts.findIndex((item) => item.id === attempt.id)
  if (index >= 0) {
    attempts[index] = attempt
  } else {
    attempts.push(attempt)
  }
  writeStore(resolvedToken, attempts)
}
