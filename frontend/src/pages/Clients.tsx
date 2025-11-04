import { createEffect, createSignal, For } from 'solid-js'
import { KunCard } from '../components/ui/KunCard'
import { KunLink } from '../components/ui/KunLink'
import { kunFetchGet } from '../utils/api'

type Client = {
  id: string
  name: string
  application_type: string
}

export const ClientsListPage = () => {
  const [items, setItems] = createSignal<Client[]>([])

  createEffect(async () => {
    const res = await kunFetchGet<Client[]>('/api/users/me/apps/created')
    if (res.ok) setItems(res.data)
  })

  return (
    <div class="mx-auto max-w-4xl p-4">
      <h2 class="mb-4 text-xl font-semibold">我创建的客户端</h2>
      <div class="grid grid-cols-1 gap-3">
        <For each={items()}>
          {(c) => (
            <KunCard>
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-semibold">{c.name}</div>
                  <div class="text-default-500 text-sm">ID: {c.id}</div>
                </div>
                <KunLink href={`/clients/${c.id}`}>详情</KunLink>
              </div>
            </KunCard>
          )}
        </For>
      </div>
    </div>
  )
}
