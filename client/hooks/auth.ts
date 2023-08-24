import { useSyncExternalStore } from 'react'

type AuthStatus = { username: string; id: number } | undefined

interface Store {
  listeners: Array<() => void>
  state: AuthStatus
}

const store: Store = {
  listeners: [],
  state: undefined,
}

function getSnapshot() {
  return store.state
}

function subscribe(listener: () => void) {
  const wrapper = () => listener()
  store.listeners.push(wrapper)

  return () => {
    unsubscribe(wrapper)
  }
}

function unsubscribe(listener: unknown) {
  for (let i = store.listeners.length - 1; i >= 0; i--) {
    if (store.listeners[i] === listener) {
      store.listeners.splice(i, 1)
    }
  }
}

function setState(status: AuthStatus) {
  store.state = status
  for (const listener of store.listeners) {
    try {
      listener()
    } catch (err) { }
  }
}

async function whoami() {
  const res = await fetch('/api/v1/whoami')
  if (!res.ok) {
    setState(undefined)
    return
  }

  const { username, id } = await res.json()
  setState({ username, id })
}

let initialised = false
function initialise() {
  if (!initialised) {
    initialised = true
    // I'm not awaiting this call because it will update the store when it
    // completes
    whoami().catch((err) => console.error(err))
  }
}

async function login(username: string, password: string) {
  const res = await fetch('/api/v1/login', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  if (res.ok) {
    const { username, id } = await res.json()
    setState({ username, id })
    return true
  }

  setState(undefined)
  return false
}

async function logout() {
  const res = await fetch('/api/v1/logout', {
    method: 'POST',
  })

  if (res.ok) {
    setState(undefined)
    return true
  }

  return false
}

export function useAuth() {
  initialise()

  const status = useSyncExternalStore(subscribe, getSnapshot)
  const isAuthenticated = status != undefined

  return { isAuthenticated, login, logout, ...status }
}
