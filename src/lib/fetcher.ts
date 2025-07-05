export const fetcher = async <T = any>(
  url: string,
  options: RequestInit = {},
  authRequired: boolean = true,
): Promise<T> => {
  const token = localStorage.getItem('token')

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (authRequired && token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch('0.0.0.0:5151/' + url, {
    ...options,
    headers,
  })

  if (authRequired && res.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error?.message || 'Something went wrong')
  }

  return res.json()
}
