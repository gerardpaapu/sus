import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/auth.ts'

export default function Layout() {
  const { isAuthenticated, logout, username } = useAuth()
  return (
    <>
      <header>
        {
          isAuthenticated ? (
            <button onClick={logout}> Logout: {username}</ button >
          ) : (
            <Link to={'/login'} > Login </Link>
          )
        }
      </header>

      <Outlet />
    </>
  )
}
