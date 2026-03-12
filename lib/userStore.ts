// In-memory user store – replace with Supabase Postgres (see `supabase-migration.sql`) for production

export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: Date
}

const users = new Map<string, User>()
let counter = 1

export const UserStore = {
  findByEmail(email: string): User | undefined {
    return [...users.values()].find(u => u.email === email.toLowerCase())
  },
  findById(id: string): User | undefined {
    return users.get(id)
  },
  create(data: { name: string; email: string; passwordHash: string }): User {
    const id = String(counter++)
    const user: User = { id, ...data, email: data.email.toLowerCase(), createdAt: new Date() }
    users.set(id, user)
    return user
  },
  safe(user: User) {
    const { passwordHash: _, ...safe } = user
    return safe
  },
}
