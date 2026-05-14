import { Router } from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataPath = path.resolve(__dirname, '../data/practiceContent.json')

function readContent() {
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'))
}

const router = Router()

// GET /api/content/list - return summary list (without full text)
router.get('/list', (_req, res) => {
  const data = readContent()
  const summary = {
    partA: data.partA.map(({ id, title, topic, difficulty, wordCount }: any) => ({ id, title, topic, difficulty, wordCount })),
    partB: data.partB.map(({ id, scenario, role }: any) => ({ id, scenario, role })),
    partC: data.partC.map(({ id, title, difficulty, wordCount, frameworkHint }: any) => ({ id, title, difficulty, wordCount, frameworkHint })),
    mockExams: data.mockExams.map(({ id, title }: any) => ({ id, title })),
  }
  res.json({ success: true, data: summary })
})

// GET /api/content/:type/:id - return single full item
router.get('/:type/:id', (req, res) => {
  const { type, id } = req.params
  const data = readContent()
  const collection = data[type]
  if (!collection) return res.status(404).json({ success: false, error: `Unknown type: ${type}` })
  const item = collection.find((i: any) => i.id === id)
  if (!item) return res.status(404).json({ success: false, error: `Not found: ${id}` })
  res.json({ success: true, data: item })
})

export default router
