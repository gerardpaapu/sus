import { useCallback, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/auth.ts'

export default function Login() {
  const navigate = useNavigate()
  const auth = useAuth()

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const form = event.currentTarget
      const { username, password } = Object.fromEntries(new FormData(form))
      const ok = await auth.login(String(username), String(password))
      if (ok) {
        navigate('/')
      }
    },
    []
  )

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <label htmlFor="Username">Username</label>
      <input type="text" id="Username" name="username" />
      <label htmlFor="Password">Password</label>
      <input type="password" id="Password" name="password" />
      <div>
        <input className="button-primary" type="submit" value="Submit" />
      </div>
    </form>
  )
}
