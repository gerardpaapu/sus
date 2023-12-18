// @vitest-environment happy-dom

import { render, screen, waitFor, cleanup } from '@testing-library/react'
import matchers from '@testing-library/jest-dom/matchers'
import '@testing-library/jest-dom/vitest'
import { describe, it, beforeEach, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { http, HttpResponse} from 'msw'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import routes from '../routes'
expect.extend(matchers)

let loggedIn = true

const server = setupServer(
  http.get('/api/v1/whoami', () => {
    if (loggedIn) {
      return HttpResponse.json({ id: 1, username: 'admin '})
    }

    return new HttpResponse(null, { status: 401 })
  }),

  http.post('/api/v1/logout', () => {
    loggedIn = false
    return new HttpResponse(null, { status: 204 })
  }),

  http.post('/api/v1/login', () => {
    loggedIn = true
    return new HttpResponse(null, { status: 204 })
  })
)

server.listen()

beforeEach(() => {
  cleanup()
  loggedIn = true
})

describe('Logout button', () => {
  it('starts hidden', async () => {
    const router = createMemoryRouter(routes)
    render(
        <RouterProvider router={router} />
    )

    const button = screen.queryByRole('button', { name: 'Logout: admin'})
    expect(button).toBeNull()
  })

  it('updates logged-in status', async () => {
      const router = createMemoryRouter(routes)
      render(
          <RouterProvider router={router} />
      )

      const button = await screen.findByRole('button', { name: 'Logout: admin'})
      expect(button).toBeVisible()
  })

  it('logs out ', async () => {
    const router = createMemoryRouter(routes)
    const user = userEvent.setup()
    render(
        <RouterProvider router={router} />
    )

    const button = await screen.findByRole('button', { name: 'Logout: admin'})
    expect(button).toBeVisible()
    await user.click(button)

    expect(button).not.toBeVisible()
    expect(screen.getByText('Login')).toBeVisible()
  })
})
