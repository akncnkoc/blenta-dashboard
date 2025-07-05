import { fetcher } from '../../lib/fetcher'

export const login = (email: string, password: string) =>
  fetcher(
    '/admin/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
    false,
  ) // authRequired = false
