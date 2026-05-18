import { useEffect, useState } from 'react'
import { AuthContext } from './auth-context'
import { supabase } from '../lib/supabase'

async function getAgentRecord(user) {
  if (!user?.id) {
    return null
  }

  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [agentRecord, setAgentRecord] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const hydrateSession = async (nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)

      if (!nextSession?.user) {
        if (active) {
          setAgentRecord(null)
          setLoading(false)
        }
        return
      }

      try {
        const agent = await getAgentRecord(nextSession.user)
        if (active) {
          setAgentRecord(agent)
        }
      } catch (error) {
        console.error('Failed to load agent record', error)
        if (active) {
          setAgentRecord(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      hydrateSession(data.session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      hydrateSession(nextSession)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUp = async ({ name, email, password, role }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    })

    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return (
    <AuthContext.Provider
      value={{
        agentRecord,
        isAgent: Boolean(agentRecord),
        loading,
        session,
        signIn,
        signOut,
        signUp,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
