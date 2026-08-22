import 'server-only'

import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// The real authorization boundary. proxy.ts only does an optimistic,
// cookie-only redirect — every Server Component/Action/Route Handler that
// needs an authenticated user or a specific role must call one of these.
export const verifySession = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return user
})

export const getFarmerProfile = cache(async () => {
  const user = await verifySession()
  const supabase = await createClient()

  const { data } = await supabase
    .from('farmer_profiles')
    .select('id, user_id, verified, years_experience, specialties')
    .eq('user_id', user.id)
    .maybeSingle()

  return data
})
