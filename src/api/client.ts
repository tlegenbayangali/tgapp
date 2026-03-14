const BASE = import.meta.env.VITE_API_URL

export async function getToken() {
const res = await fetch(`${BASE}/api/auth/telegram`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ init_data: window.Telegram?.WebApp?.initDataUnsafe }),
})
const { token } = await res.json()
localStorage.setItem('token', token)
return token
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
const token = localStorage.getItem('token')
const res = await fetch(`${BASE}${path}`, {
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...init,
})
if (!res.ok) throw new Error(await res.text())
return res.json()
}