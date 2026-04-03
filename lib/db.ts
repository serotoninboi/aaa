import fs from 'fs/promises'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'db.json')

export interface DB {
  users: User[]
  purchases: Purchase[]
  generations: Generation[]
}

export interface User {
  id: string
  name: string | null
  email: string
  passwordHash: string | null
  credits: number
  createdAt: string
  updatedAt: string
}

export interface Purchase {
  id: string
  userId: string
  billingId: string | null
  amount: number
  credits: number
  provider: string
  providerRef: string | null
  status: string
  createdAt: string
}

export interface Generation {
  id: string
  userId: string
  type: string
  inputUrl: string | null
  outputUrl: string
  modelUsed: string
  creditsUsed: number
  prompt: string | null
  seed: number | null
  status: string
  error: string | null
  createdAt: string
}

let cache: DB | null = null

export async function readDB(): Promise<DB> {
  if (cache) return cache
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8')
    cache = JSON.parse(data)
  } catch {
    cache = { users: [], purchases: [], generations: [] }
  }
  return cache!
}

export async function writeDB(data: DB): Promise<void> {
  cache = data
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2))
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}