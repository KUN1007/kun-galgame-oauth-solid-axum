import { A } from '@solidjs/router'
import { ThemeToggle } from './ThemeToggle'
import KunBrand from '../ui/KunBrand'
import { KunLinkButton } from '../ui/KunButton'
import { getUser } from '~/utils/api'
import { kunOauth } from '~/config/kunApp'
import { KunLink } from '../ui/KunLink'
import type { ParentProps } from 'solid-js'

export const Layout = (props: ParentProps) => {
  const user = getUser()
  return (
    <div class="flex min-h-screen flex-col">
      <header class="bg-background sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4">
        <div class="flex items-center gap-6">
          <A href="/">
            <KunBrand title={kunOauth.owner} titleShort="Kun" />
          </A>
          <nav class="hidden items-center gap-6 md:flex">
            <KunLink underline="none" color="default" variant="light" href="/">
              首页
            </KunLink>
            <KunLink
              underline="none"
              color="default"
              variant="light"
              href="/ui"
            >
              UI
            </KunLink>
          </nav>
        </div>

        <div class="flex items-center gap-2">
          <ThemeToggle />
          {!user ? (
            <>
              <KunLinkButton href="/login" variant="light">
                登录
              </KunLinkButton>
              <KunLinkButton href="/register">注册</KunLinkButton>
            </>
          ) : (
            <KunLinkButton href={`/user/${user.id}`}>
              {user.username || '我的'}
            </KunLinkButton>
          )}
        </div>
      </header>
      <main class="flex-1">{props.children}</main>
      <footer class="text-default-500 border-t py-4 text-center text-sm">
        © Kun OAuth
      </footer>
    </div>
  )
}
