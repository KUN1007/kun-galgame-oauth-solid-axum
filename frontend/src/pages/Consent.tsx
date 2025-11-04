import { useLocation } from '@solidjs/router'
import { KunCard } from '../components/ui/KunCard'
import { KunButton } from '../components/ui/KunButton'
import { createEffect, createSignal, Show } from 'solid-js'
import { kunFetchGet } from '../utils/api'

const getSearchParam = (search: string, key: string) =>
  new URLSearchParams(search).get(key) || ''

export const ConsentPage = () => {
  const loc = useLocation()
  const tx = () => getSearchParam(loc.search, 'tx')
  const [clientName, setClientName] = createSignal<string>('')
  const [scope, setScope] = createSignal<string>('')

  createEffect(async () => {
    if (!tx()) return
    const res = await kunFetchGet<{
      client_id: string
      client_name?: string
      scope?: string
    }>(`/api/oauth/tx/${tx()}`)
    if (res.ok) {
      setClientName(res.data.client_name || res.data.client_id)
      setScope(res.data.scope || '')
    }
  })

  const approve = () => {
    if (!tx()) return
    window.location.href = `/api/oauth/authorize?tx=${encodeURIComponent(tx())}&decision=approve`
  }
  const deny = () => {
    if (!tx()) return
    window.location.href = `/api/oauth/authorize?tx=${encodeURIComponent(tx())}&decision=deny`
  }

  return (
    <div class="grid min-h-screen place-items-center p-4">
      <KunCard class="w-full max-w-lg">
        <h2 class="mb-2 text-xl font-semibold">授权同意</h2>
        <div class="text-default-600 mb-4">
          <div>
            应用：<span class="font-medium">{clientName() || '应用'}</span>
          </div>
          <Show when={scope()}>
            <div>请求权限（scope）：{scope()}</div>
          </Show>
        </div>
        <div class="flex gap-3">
          <KunButton onClick={approve}>同意</KunButton>
          <KunButton variant="light" color="default" onClick={deny}>
            拒绝
          </KunButton>
        </div>
      </KunCard>
    </div>
  )
}
