import { auth } from '@clerk/nextjs/server'

/**
 * Get the current user's access token (JWT) for API calls
 * Use this in server-side code or API routes
 */
export async function getClerkToken() {
  const { getToken } = await auth()
  return await getToken()
}

/**
 * Get the current authenticated user on the server
 * Returns the Clerk user object with ID and metadata
 */
export async function getClerkUser() {
  const { userId } = await auth()
  if (!userId) return null
  return userId
}
