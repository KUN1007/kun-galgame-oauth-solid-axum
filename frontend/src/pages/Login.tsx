import { createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { KunInput } from '../components/ui/KunInput'
import { KunButton } from '../components/ui/KunButton'
import { KunCard } from '../components/ui/KunCard'
import { useKunMessage } from '../components/ui/message/useMessage'
import { kunFetchPost, setAuth } from '../utils/api'

export const LoginPage = () => {
  const nav = useNavigate()
  const [username, setUsername] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [loading, setLoading] = createSignal(false)

  const submit = async (e: Event) => {
    e.preventDefault()
    setLoading(true)
    const res = await kunFetchPost<{ token: string; user: any }>(
      '/api/auth/login',
      { username: username().trim(), password: password() }
    )
    setLoading(false)
    if (!res.ok) return useKunMessage(res.message || '登录失败', 'error')
    setAuth(res.data.token, res.data.user)
    useKunMessage('登录成功', 'success')
    nav(`/user/${res.data.user.id}`)
  }

  return (
    <div class="grid min-h-screen place-items-center p-4">
      <KunCard class="w-full max-w-sm">
        <h2 class="mb-4 text-xl font-semibold">登录</h2>
        <form class="space-y-3" onSubmit={submit}>
          <KunInput
            autocomplete="username"
            label="用户名"
            placeholder="请输入用户名"
            onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
          />
          <KunInput
            autocomplete="current-password"
            label="密码"
            type="password"
            placeholder="请输入密码"
            onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
          />
          <KunButton type="submit" disabled={loading()} fullWidth>
            {loading() ? '登录中...' : '登录'}
          </KunButton>
        </form>
      </KunCard>
    </div>
  )
}
