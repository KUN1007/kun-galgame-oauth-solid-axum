import { createEffect, createSignal } from 'solid-js'
import { useParams } from '@solidjs/router'
import { KunCard } from '../components/ui/KunCard'
import { KunAvatar } from '../components/ui/KunAvatar'
import { kunFetchGet } from '../utils/api'
import { useKunMessage } from '../components/ui/message/useMessage'

export const ProfilePage = () => {
  const params = useParams()
  const [user, setUser] = createSignal<{ id: string; username: string } | null>(
    null
  )

  createEffect(async () => {
    const id = params.id
    const endpoint = id === 'me' ? '/api/users/me' : `/api/users/${id}`
    const res = await kunFetchGet<{ id: string; username: string }>(endpoint)
    if (!res.ok) {
      return useKunMessage(res.message || '获取用户失败', 'error')
    }
    setUser(res.data)
  })

  return (
    <div class="grid min-h-screen place-items-center p-4">
      <KunCard class="w-full max-w-md">
        <h2 class="mb-4 text-xl font-semibold">个人信息</h2>
        {user() ? (
          <div class="flex items-center gap-4">
            <KunAvatar
              user={{ id: user()!.id, name: user()!.username }}
              size="xl"
            />
            <div>
              <div class="font-semibold">{user()!.username}</div>
              <div class="text-default-500 text-sm">ID: {user()!.id}</div>
            </div>
          </div>
        ) : (
          <div>加载中...</div>
        )}
      </KunCard>
    </div>
  )
}
