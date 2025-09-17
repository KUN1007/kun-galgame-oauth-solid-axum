import { createMemo, createSignal, onMount } from 'solid-js'
import { KunButton } from '../ui/KunButton'
import { KunIcon } from '../ui/KunIcon'
import { KunPopover } from '../ui/KunPopover'
import { getTheme, setTheme, type ThemeMode } from '~/utils/theme'

export const ThemeToggle = () => {
  const [mode, setMode] = createSignal<ThemeMode>('system')
  onMount(() => {
    setMode(getTheme())
  })

  const choose = (m: ThemeMode) => {
    setMode(m)
    setTheme(m)
  }

  const currentIcon = createMemo(() => {
    switch (mode()) {
      case 'light':
        return 'lucide:sun'
      case 'dark':
        return 'lucide:moon'
      default:
        return 'lucide:monitor'
    }
  })

  return (
    <KunPopover
      position="bottom-end"
      trigger={
        <KunButton
          isIconOnly
          variant="light"
          color="default"
          aria-label="切换主题"
          title="切换主题"
        >
          <KunIcon name={currentIcon()} />
        </KunButton>
      }
      innerClass="min-w-[8rem] p-2 bg-content1"
    >
      <div class="flex flex-col gap-1">
        <KunButton
          variant={mode() === 'light' ? 'flat' : 'ghost'}
          color="default"
          onClick={() => choose('light')}
        >
          <KunIcon class="mr-2" name="lucide:sun" />
          <span class="shrink-0">浅色模式</span>
        </KunButton>
        <KunButton
          variant={mode() === 'dark' ? 'flat' : 'ghost'}
          color="default"
          onClick={() => choose('dark')}
        >
          <KunIcon class="mr-2" name="lucide:moon" />
          <span class="shrink-0">深色模式</span>
        </KunButton>
        <KunButton
          variant={mode() === 'system' ? 'flat' : 'ghost'}
          color="default"
          onClick={() => choose('system')}
        >
          <KunIcon class="mr-2" name="lucide:monitor" />
          <span class="shrink-0">跟随系统</span>
        </KunButton>
      </div>
    </KunPopover>
  )
}
