import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StoredAttempt } from '../types/attempt'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.resolve(__dirname, '../../data')
const storePath = path.join(dataDir, 'attempts.json')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

export function initDbSchema() {
  if (!fs.existsSync(storePath)) {
    fs.writeFileSync(storePath, '[]', 'utf8')
  }
}

function readStore(): StoredAttempt[] {
  initDbSchema()
  try {
    const raw = fs.readFileSync(storePath, 'utf8')
    const parsed = JSON.parse(raw) as StoredAttempt[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStore(attempts: StoredAttempt[]) {
  fs.writeFileSync(storePath, JSON.stringify(attempts, null, 2), 'utf8')
}

export function listAttempts(limit = 100): StoredAttempt[] {
  return readStore()
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export function upsertAttempt(attempt: StoredAttempt) {
  const attempts = readStore()
  const index = attempts.findIndex((item) => item.id === attempt.id)
  if (index >= 0) {
    attempts[index] = attempt
  } else {
    attempts.push(attempt)
  }
  writeStore(attempts)
}
