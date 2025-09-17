import { type Component, JSX, Show, children, createMemo } from 'solid-js'
import { KunImage } from './KunImage'
import { cn } from '~/utils/cn'

export interface KunLoadingProps {
  loading?: boolean
  description?: string
  class?: string
  children?: JSX.Element
}

export const KunLoading: Component<KunLoadingProps> = (props) => {
  const c = children(() => props.children)
  const isWrapperMode = createMemo(() => !!c())

  return (
    <Show when={isWrapperMode()} fallback={
      <div class="m-auto flex flex-col items-center gap-3">
        <KunImage alt="loading" src="/kun.webp" class="h-48 w-48 rounded-lg" />
        <span class="info">{props.description ?? '少女祈祷中...请稍候'}</span>
      </div>
    }>
      <div class="relative min-h-24">
        <div class={cn('transition-opacity', props.loading && 'opacity-50')}>
          {c()}
        </div>
        <Show when={props.loading}>
          <div class="bg-background/50 absolute inset-0 z-50 flex items-center justify-center rounded-lg">
            <div class="flex flex-col items-center gap-3">
              <KunImage alt="loading" src="/kun.webp" class="h-48 w-48 rounded-lg" />
              <span class="info text-xl">{props.description ?? '少女祈祷中...请稍候'}</span>
            </div>
          </div>
        </Show>
      </div>
    </Show>
  )
}

export default KunLoading

