import { readDB, writeDB, generateId, User } from './db'

export async function getUserCredits(userId: string): Promise<number> {
  const db = await readDB()
  const user = db.users.find((u) => u.id === userId)
  return user?.credits ?? 0
}

export async function getOrCreateUser(userId: string, email: string, name?: string | null): Promise<User> {
  const db = await readDB()
  let user = db.users.find((u) => u.id === userId)

  if (!user) {
    user = {
      id: userId,
      name: name ?? null,
      email,
      passwordHash: null,
      credits: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    db.users.push(user)
    await writeDB(db)
  }

  return user
}

export async function deductCredits(
  userId: string,
  amount: number
): Promise<{ success: boolean; remaining: number; error?: string }> {
  const db = await readDB()
  const userIndex = db.users.findIndex((u) => u.id === userId)

  if (userIndex === -1) {
    return { success: false, remaining: 0, error: 'User not found' }
  }

  const user = db.users[userIndex]

  if (user.credits < amount) {
    return {
      success: false,
      remaining: user.credits,
      error: `Insufficient credits. Need ${amount}, have ${user.credits}`,
    }
  }

  db.users[userIndex].credits -= amount
  db.users[userIndex].updatedAt = new Date().toISOString()
  await writeDB(db)

  return { success: true, remaining: user.credits - amount }
}

export async function addCredits(
  userId: string,
  amount: number,
  billingId?: string,
  provider?: string,
  providerRef?: string
): Promise<{ success: boolean; newTotal: number }> {
  const db = await readDB()
  const userIndex = db.users.findIndex((u) => u.id === userId)

  if (userIndex === -1) {
    throw new Error('User not found')
  }

  db.users[userIndex].credits += amount
  db.users[userIndex].updatedAt = new Date().toISOString()

  db.purchases.push({
    id: generateId(),
    userId,
    billingId: billingId ?? null,
    amount: 0,
    credits: amount,
    provider: provider ?? 'manual',
    providerRef: providerRef ?? null,
    status: 'completed',
    createdAt: new Date().toISOString(),
  })

  await writeDB(db)
  return { success: true, newTotal: db.users[userIndex].credits }
}

export async function logGeneration(
  userId: string,
  data: {
    type: string
    inputUrl?: string
    outputUrl: string
    modelUsed: string
    creditsUsed: number
    prompt?: string
    seed?: number
    status?: string
    error?: string
  }
) {
  const db = await readDB()

  const generation = {
    id: generateId(),
    userId,
    type: data.type,
    inputUrl: data.inputUrl ?? null,
    outputUrl: data.outputUrl,
    modelUsed: data.modelUsed,
    creditsUsed: data.creditsUsed,
    prompt: data.prompt ?? null,
    seed: data.seed ?? null,
    status: data.status ?? 'success',
    error: data.error ?? null,
    createdAt: new Date().toISOString(),
  }

  db.generations.push(generation)
  await writeDB(db)

  return generation
}