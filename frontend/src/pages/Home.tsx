import { KunButton } from '../components/ui/KunButton'
import { A } from '@solidjs/router'
import { getUser } from '~/utils/api'

export const KunHome = () => {
  return (
    <div class="grid h-screen place-items-center gap-4">
      <div class="flex gap-2">
        <A href="/login">
          <KunButton variant="light">登录</KunButton>
        </A>
        <A href="/register">
          <KunButton>注册</KunButton>
        </A>
        {getUser() && (
          <A href={`/user/${getUser().id}`}>
            <KunButton variant="flat" color="primary">
              我的主页
            </KunButton>
          </A>
        )}
      </div>
    </div>
  )
}
