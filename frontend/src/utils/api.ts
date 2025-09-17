export type KunResult<T = unknown> =
  | { ok: true; status: number; data: T; headers: Headers }
  | {
      ok: false
      status: number
      message: string
      headers?: Headers
      error?: unknown
    }

export const getAuthHeader = (): Record<string, string> => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const mergeHeaders = (base?: HeadersInit, extra?: Record<string, string>) => {
  const h = new Headers(base)
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v !== undefined && v !== null) h.set(k, String(v))
    }
  }
  return h
}

const parseBody = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    try {
      return await response.json()
    } catch (_) {
      return null
    }
  }
  try {
    return await response.text()
  } catch (_) {
    return null
  }
}

const kunFetchCore = async <T>(
  path: string,
  init: RequestInit = {}
): Promise<KunResult<T>> => {
  try {
    const headers = mergeHeaders(init.headers, getAuthHeader())
    const resp = await fetch(path, {
      credentials: 'same-origin',
      ...init,
      headers
    })
    const data = await parseBody(resp)
    if (!resp.ok) {
      const message =
        typeof data === 'string' && data.length
          ? data
          : resp.statusText || '请求错误'
      return { ok: false, status: resp.status, message, headers: resp.headers }
    }
    return {
      ok: true,
      status: resp.status,
      data: data as T,
      headers: resp.headers
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : '网络错误'
    return { ok: false, status: 0, message: msg, error }
  }
}

export const kunFetchGet = async <T>(path: string, init: RequestInit = {}) => {
  return kunFetchCore<T>(path, { ...init, method: 'GET' })
}

export const kunFetchPost = <T>(
  path: string,
  body?: any,
  init: RequestInit = {}
) => {
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData
  const headers = isForm
    ? mergeHeaders(init.headers, getAuthHeader())
    : mergeHeaders(init.headers, {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      })
  return kunFetchCore<T>(path, {
    ...init,
    method: 'POST',
    headers,
    body: isForm
      ? (body as FormData)
      : body != null
        ? JSON.stringify(body)
        : undefined
  })
}

export const kunFetchPut = <T>(
  path: string,
  body?: any,
  init: RequestInit = {}
) => {
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData
  const headers = isForm
    ? mergeHeaders(init.headers, getAuthHeader())
    : mergeHeaders(init.headers, {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      })
  return kunFetchCore<T>(path, {
    ...init,
    method: 'PUT',
    headers,
    body: isForm
      ? (body as FormData)
      : body != null
        ? JSON.stringify(body)
        : undefined
  })
}

export const kunFetchDelete = <T>(path: string, init: RequestInit = {}) => {
  return kunFetchCore<T>(path, { ...init, method: 'DELETE' })
}

export const kunFetchFormdata = <T>(
  path: string,
  form: FormData,
  init: RequestInit = {}
) => {
  const headers = mergeHeaders(init.headers, getAuthHeader())
  return kunFetchCore<T>(path, { ...init, method: 'POST', body: form, headers })
}

export const getToken = () => localStorage.getItem('kun_token') || ''
export const setAuth = (token: string, user: any) => {
  localStorage.setItem('kun_token', token)
  localStorage.setItem('kun_user', JSON.stringify(user))
}
export const getUser = () => {
  const raw = localStorage.getItem('kun_user')
  return raw ? JSON.parse(raw) : null
}
