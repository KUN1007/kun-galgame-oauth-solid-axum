import { createEffect, createSignal, For, Show } from 'solid-js'
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
  const [authorized, setAuthorized] = createSignal<any[]>([])
  const [created, setCreated] = createSignal<any[]>([])

  createEffect(async () => {
    const id = params.id
    const endpoint = id === 'me' ? '/api/users/me' : `/api/users/${id}`
    const res = await kunFetchGet<{ id: string; username: string }>(endpoint)
    if (!res.ok) return useKunMessage(res.message || '获取用户失败', 'error')
    setUser(res.data)
    if (id === 'me') {
      const a = await kunFetchGet<any[]>('/api/users/me/apps/authorized')
      if (a.ok) setAuthorized(a.data)
      const c = await kunFetchGet<any[]>('/api/users/me/apps/created')
      if (c.ok) setCreated(c.data)
    }
  })

  return (
    <div class="mx-auto max-w-4xl space-y-6 p-4">
      <KunCard>
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

      <Show when={params.id === 'me'}>
        <KunCard>
          <h3 class="mb-3 text-lg font-semibold">已授权的应用</h3>
          <div class="grid grid-cols-1 gap-3">
            <For each={authorized()}>
              {(c) => (
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium">{c.name}</div>
                    <div class="text-default-500 text-sm">ID: {c.id}</div>
                  </div>
                  <a class="text-primary-500" href={`/clients/${c.id}`}>
                    查看
                  </a>
                </div>
              )}
            </For>
            <Show when={!authorized().length}>
              <div class="text-default-500">暂无授权的应用</div>
            </Show>
          </div>
        </KunCard>

        <KunCard>
          <h3 class="mb-3 text-lg font-semibold">我创建的应用</h3>
          <div class="grid grid-cols-1 gap-3">
            <For each={created()}>
              {(c) => (
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium">{c.name}</div>
                    <div class="text-default-500 text-sm">ID: {c.id}</div>
                  </div>
                  <a class="text-primary-500" href={`/clients/${c.id}`}>
                    管理
                  </a>
                </div>
              )}
            </For>
            <Show when={!created().length}>
              <div class="text-default-500">暂无创建的应用</div>
            </Show>
          </div>
        </KunCard>
      </Show>
    </div>
  )
}
