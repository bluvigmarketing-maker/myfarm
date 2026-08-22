import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Server Component / Server Action / Route Handler client.
// Must be created fresh per request — do not module-cache the instance.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component (no request/response to write to).
            // Safe to ignore as long as proxy.ts refreshes the session.
          }
        },
      },
    }
  )
}
