import { createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { KunInput } from '../components/ui/KunInput'
import { KunButton } from '../components/ui/KunButton'
import { KunCard } from '../components/ui/KunCard'
import { useKunMessage } from '../components/ui/message/useMessage'
import { kunFetchPost, setAuth } from '../utils/api'

export const RegisterPage = () => {
  const nav = useNavigate()
  const [username, setUsername] = createSignal('')
  const [email, setEmail] = createSignal('')
  const [avatar, setAvatar] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [loading, setLoading] = createSignal(false)

  const submit = async (e: Event) => {
    e.preventDefault()
    setLoading(true)
    const res = await kunFetchPost<{ token: string; user: any }>(
      '/api/auth/register',
      {
        username: username().trim(),
        email: email().trim(),
        password: password(),
        avatar: avatar().trim() || undefined
      }
    )
    setLoading(false)
    if (!res.ok) return useKunMessage(res.message || '注册失败', 'error')
    setAuth(res.data.token, res.data.user)
    useKunMessage('注册成功', 'success')
    nav(`/user/${res.data.user.id}`)
  }

  return (
    <div class="grid min-h-screen place-items-center p-4">
      <KunCard class="w-full max-w-sm">
        <h2 class="mb-4 text-xl font-semibold">注册</h2>
        <form class="space-y-3" onSubmit={submit}>
          <KunInput
            label="用户名"
            placeholder="请输入用户名"
            autocomplete="username"
            onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
          />
          <KunInput
            label="邮箱"
            type="email"
            autocomplete="email"
            placeholder="请输入邮箱"
            onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
          />
          <KunInput
            label="头像(可选)"
            placeholder="头像 URL"
            onInput={(e) => setAvatar((e.target as HTMLInputElement).value)}
          />
          <KunInput
            label="密码"
            type="password"
            autocomplete="new-password"
            placeholder="请输入密码 (>=6 位)"
            onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
          />
          <KunButton type="submit" disabled={loading()} fullWidth>
            {loading() ? '注册中...' : '注册'}
          </KunButton>
        </form>
      </KunCard>
    </div>
  )
}
