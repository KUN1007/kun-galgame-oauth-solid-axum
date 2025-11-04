import { createEffect, createSignal, For, Show } from 'solid-js'
import { useParams } from '@solidjs/router'
import { KunCard } from '../components/ui/KunCard'
import { useKunMessage } from '../components/ui/message/useMessage'
import { kunFetchGet } from '../utils/api'

type ClientPublic = {
  id: string
  name: string
  application_type: string
  token_endpoint_auth_method: string
  grant_types: string[]
  response_types: string[]
  redirect_uris: string[]
  post_logout_redirect_uris: string[]
  scope?: string
  contacts: string[]
  logo_uri?: string
  client_uri?: string
  policy_uri?: string
  tos_uri?: string
  jwks_uri?: string
  subject_type?: string
  sector_identifier_uri?: string
  owner_user_id?: string
  require_pkce: boolean
  first_party: boolean
  allowed_cors_origins: string[]
  client_id_issued_at: string
  client_secret_expires_at?: string
  created_at: string
  updated_at: string
}

const Row = (props: {
  label: string
  value?: string | number | boolean | string[]
}) => (
  <div class="grid grid-cols-3 gap-2">
    <div class="text-default-500 text-sm">{props.label}</div>
    <div class="col-span-2 break-words">
      <Show
        when={Array.isArray(props.value)}
        fallback={<span>{String(props.value ?? '-')}</span>}
      >
        <div class="flex flex-wrap gap-1">
          <For each={props.value as string[]}>
            {(v) => <span class="bg-content2 rounded px-1 text-xs">{v}</span>}
          </For>
        </div>
      </Show>
    </div>
  </div>
)

export const ClientDetailPage = () => {
  const params = useParams()
  const [client, setClient] = createSignal<ClientPublic | null>(null)

  createEffect(async () => {
    const id = params.id
    const res = await kunFetchGet<ClientPublic>(`/api/clients/${id}`)
    if (!res.ok) return useKunMessage(res.message || '获取客户端失败', 'error')
    setClient(res.data)
  })

  return (
    <div class="grid min-h-screen place-items-center p-4">
      <KunCard class="w-full max-w-3xl">
        <h2 class="mb-4 text-xl font-semibold">客户端详情</h2>
        {client() ? (
          <div class="space-y-2">
            <Row label="Client ID" value={client()!.id} />
            <Row label="名称" value={client()!.name} />
            <Row label="应用类型" value={client()!.application_type} />
            <Row
              label="认证方式"
              value={client()!.token_endpoint_auth_method}
            />
            <Row label="授权类型" value={client()!.grant_types} />
            <Row label="响应类型" value={client()!.response_types} />
            <Row label="回调地址" value={client()!.redirect_uris} />
            <Row label="登出回调" value={client()!.post_logout_redirect_uris} />
            <Row label="Scope" value={client()!.scope || '-'} />
            <Row label="联系人" value={client()!.contacts} />
            <Row label="Logo URL" value={client()!.logo_uri || '-'} />
            <Row label="Client URL" value={client()!.client_uri || '-'} />
            <Row label="Policy URL" value={client()!.policy_uri || '-'} />
            <Row label="TOS URL" value={client()!.tos_uri || '-'} />
            <Row label="JWKS URI" value={client()!.jwks_uri || '-'} />
            <Row label="Subject Type" value={client()!.subject_type || '-'} />
            <Row
              label="Sector URI"
              value={client()!.sector_identifier_uri || '-'}
            />
            <Row label="Require PKCE" value={client()!.require_pkce} />
            <Row label="First Party" value={client()!.first_party} />
            <Row label="CORS" value={client()!.allowed_cors_origins} />
            <Row label="Issued At" value={client()!.client_id_issued_at} />
            <Row
              label="Secret Expires"
              value={client()!.client_secret_expires_at || '-'}
            />
            <Row label="创建时间" value={client()!.created_at} />
            <Row label="更新时间" value={client()!.updated_at} />
          </div>
        ) : (
          <div>加载中...</div>
        )}
      </KunCard>
    </div>
  )
}
