// @vitest-environment jsdom

import { render, screen, waitFor, cleanup } from '@testing-library/react'
import matchers from '@testing-library/jest-dom/matchers'
import '@testing-library/jest-dom/vitest'
import { describe, it, beforeEach, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import routes from '../routes'
expect.extend(matchers)

let loggedIn = true

const server = setupServer(
  rest.get('/api/v1/whoami', (req, res, ctx) => {
    if (loggedIn) {
      return res(ctx.status(200), ctx.json({ id: 1, username: 'admin' }))
    }

    return res(ctx.status(401))
  }),

  rest.post('/api/v1/logout', (req, res, ctx) => {
    loggedIn = false
    return res(ctx.status(204))
  }),

  rest.post('/api/v1/login', (req, res, ctx) => {
    loggedIn = true
    return res(ctx.status(200), ctx.json({ id: 1, username: 'admin' }))
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
