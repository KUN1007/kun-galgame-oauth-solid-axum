import { createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { KunCard } from '../components/ui/KunCard'
import { KunInput } from '../components/ui/KunInput'
import { KunTextarea } from '../components/ui/KunTextarea'
import { KunButton } from '../components/ui/KunButton'
import { KunSwitch } from '../components/ui/KunSwitch'
import { useKunMessage } from '../components/ui/message/useMessage'
import { kunFetchPost } from '../utils/api'

type RegisterResp = {
  client_id: string
  client_secret?: string
  client_id_issued_at: string
}

const parseList = (s: string) =>
  s
    .split(/[\n,]/g)
    .map((x) => x.trim())
    .filter(Boolean)

export const ClientNewPage = () => {
  const nav = useNavigate()
  const [name, setName] = createSignal('')
  const [redirectUris, setRedirectUris] = createSignal('')
  const [postLogoutRedirectUris, setPostLogoutRedirectUris] = createSignal('')
  const [applicationType, setApplicationType] = createSignal<
    'web' | 'native' | 'spa' | 'service'
  >('web')
  const [authMethod, setAuthMethod] = createSignal<
    'client_secret_basic' | 'client_secret_post' | 'none'
  >('client_secret_basic')
  const [grantAuthorizationCode, setGrantAuthorizationCode] = createSignal(true)
  const [grantRefreshToken, setGrantRefreshToken] = createSignal(true)
  const [responseCode, setResponseCode] = createSignal(true)
  const [scope, setScope] = createSignal('')
  const [contacts, setContacts] = createSignal('')
  const [logoUri, setLogoUri] = createSignal('')
  const [clientUri, setClientUri] = createSignal('')
  const [policyUri, setPolicyUri] = createSignal('')
  const [tosUri, setTosUri] = createSignal('')
  const [requirePkce, setRequirePkce] = createSignal(true)
  const [firstParty, setFirstParty] = createSignal(false)
  const [allowedCors, setAllowedCors] = createSignal('')
  const [loading, setLoading] = createSignal(false)
  const [created, setCreated] = createSignal<RegisterResp | null>(null)

  const submit = async (e: Event) => {
    e.preventDefault()
    if (!name().trim()) return useKunMessage('请填写应用名称', 'warn')
    const redirects = parseList(redirectUris())
    if (redirects.length === 0)
      return useKunMessage('请填写至少一个回调地址', 'warn')

    const grant_types: string[] = []
    if (grantAuthorizationCode()) grant_types.push('authorization_code')
    if (grantRefreshToken()) grant_types.push('refresh_token')
    const response_types: string[] = []
    if (responseCode()) response_types.push('code')

    setLoading(true)
    const res = await kunFetchPost<RegisterResp>('/api/clients/register', {
      name: name().trim(),
      redirect_uris: redirects,
      post_logout_redirect_uris: parseList(postLogoutRedirectUris()),
      application_type: applicationType(),
      token_endpoint_auth_method: authMethod(),
      grant_types,
      response_types,
      scope: scope().trim() || undefined,
      contacts: parseList(contacts()),
      logo_uri: logoUri().trim() || undefined,
      client_uri: clientUri().trim() || undefined,
      policy_uri: policyUri().trim() || undefined,
      tos_uri: tosUri().trim() || undefined,
      require_pkce: requirePkce(),
      first_party: firstParty(),
      allowed_cors_origins: parseList(allowedCors())
    })
    setLoading(false)
    if (!res.ok) return useKunMessage(res.message || '注册失败', 'error')
    setCreated(res.data)
    useKunMessage('客户端注册成功', 'success')
  }

  const gotoDetail = () => {
    const id = created()!.client_id
    nav(`/clients/${id}`)
  }

  return (
    <div class="grid min-h-screen place-items-center p-4">
      <KunCard class="w-full max-w-2xl">
        <h2 class="mb-4 text-xl font-semibold">注册 OAuth 客户端</h2>
        {created() ? (
          <div class="space-y-3">
            <div>
              <div class="text-default-500 text-sm">Client ID</div>
              <code class="break-all">{created()!.client_id}</code>
            </div>
            {created()!.client_secret && (
              <div>
                <div class="text-danger-500 text-sm">
                  Client Secret (仅显示一次，请妥善保存)
                </div>
                <code class="break-all">{created()!.client_secret}</code>
              </div>
            )}
            <div class="flex gap-2">
              <KunButton onClick={gotoDetail}>查看详情</KunButton>
              <KunButton
                variant="light"
                color="default"
                onClick={() => setCreated(null)}
              >
                继续创建
              </KunButton>
            </div>
          </div>
        ) : (
          <form class="grid grid-cols-1 gap-3" onSubmit={submit}>
            <KunInput
              label="应用名称"
              placeholder="例如: Kun App"
              onInput={(e) => setName((e.target as HTMLInputElement).value)}
            />
            <KunTextarea
              label="回调地址 (逗号或换行分隔)"
              placeholder="https://your.app/callback"
              onInput={(e) =>
                setRedirectUris((e.target as HTMLTextAreaElement).value)
              }
            />
            <KunTextarea
              label="登出回调地址 (可选)"
              placeholder="https://your.app/logout"
              onInput={(e) =>
                setPostLogoutRedirectUris(
                  (e.target as HTMLTextAreaElement).value
                )
              }
            />

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label class="text-default-500 text-sm">应用类型</label>
                <select
                  class="bg-content1 mt-1 w-full rounded-md border p-2"
                  value={applicationType()}
                  onInput={(e) =>
                    setApplicationType(
                      (e.target as HTMLSelectElement).value as any
                    )
                  }
                >
                  <option value="web">web</option>
                  <option value="native">native</option>
                  <option value="spa">spa</option>
                  <option value="service">service</option>
                </select>
              </div>
              <div>
                <label class="text-default-500 text-sm">认证方式</label>
                <select
                  class="bg-content1 mt-1 w-full rounded-md border p-2"
                  value={authMethod()}
                  onInput={(e) =>
                    setAuthMethod((e.target as HTMLSelectElement).value as any)
                  }
                >
                  <option value="client_secret_basic">
                    client_secret_basic
                  </option>
                  <option value="client_secret_post">client_secret_post</option>
                  <option value="none">none</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div class="flex items-center gap-6">
                <KunSwitch
                  label="authorization_code"
                  modelValue={grantAuthorizationCode()}
                  onChange={setGrantAuthorizationCode}
                />
                <KunSwitch
                  label="refresh_token"
                  modelValue={grantRefreshToken()}
                  onChange={setGrantRefreshToken}
                />
              </div>
              <div class="flex items-center gap-6">
                <KunSwitch
                  label="response: code"
                  modelValue={responseCode()}
                  onChange={setResponseCode}
                />
              </div>
            </div>

            <KunInput
              label="Scope (可选，空格分隔)"
              placeholder="openid profile email"
              onInput={(e) => setScope((e.target as HTMLInputElement).value)}
            />
            <KunTextarea
              label="联系人 (逗号或换行分隔，可选)"
              placeholder="admin@example.com"
              onInput={(e) =>
                setContacts((e.target as HTMLTextAreaElement).value)
              }
            />
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <KunInput
                label="Logo URL (可选)"
                placeholder="https://..."
                onInput={(e) =>
                  setLogoUri((e.target as HTMLInputElement).value)
                }
              />
              <KunInput
                label="Client URL (可选)"
                placeholder="https://..."
                onInput={(e) =>
                  setClientUri((e.target as HTMLInputElement).value)
                }
              />
              <KunInput
                label="Policy URL (可选)"
                placeholder="https://..."
                onInput={(e) =>
                  setPolicyUri((e.target as HTMLInputElement).value)
                }
              />
              <KunInput
                label="TOS URL (可选)"
                placeholder="https://..."
                onInput={(e) => setTosUri((e.target as HTMLInputElement).value)}
              />
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <KunSwitch
                label="启用 PKCE"
                modelValue={requirePkce()}
                onChange={setRequirePkce}
              />
              <KunSwitch
                label="First-party"
                modelValue={firstParty()}
                onChange={setFirstParty}
              />
            </div>

            <KunTextarea
              label="CORS 允许来源 (逗号或换行分隔，可选)"
              placeholder="https://your.app"
              onInput={(e) =>
                setAllowedCors((e.target as HTMLTextAreaElement).value)
              }
            />

            <KunButton type="submit" disabled={loading()} fullWidth>
              {loading() ? '提交中...' : '提交注册'}
            </KunButton>
          </form>
        )}
      </KunCard>
    </div>
  )
}
