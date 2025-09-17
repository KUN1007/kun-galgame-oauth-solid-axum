import { type Component, createSignal, onCleanup, onMount } from 'solid-js'
import { cn } from '~/utils/cn'

export interface KunScrollShadowProps {
  axis?: 'horizontal' | 'vertical'
  shadowColor?: string
  shadowSize?: string
  class?: string
  children?: any
}

export const KunScrollShadow: Component<KunScrollShadowProps> = (props) => {
  const axis = props.axis ?? 'horizontal'
  const shadowColor = props.shadowColor ?? 'var(--color-background)'
  const shadowSize = props.shadowSize ?? '2rem'

  let scrollContainer: HTMLElement | undefined
  let contentWrapper: HTMLElement | undefined

  const [showStart, setShowStart] = createSignal(false)
  const [showEnd, setShowEnd] = createSignal(false)

  const update = () => {
    if (!scrollContainer || !contentWrapper) return
    const epsilon = 1
    if (axis === 'horizontal') {
      setShowStart(scrollContainer.scrollLeft > epsilon)
      setShowEnd(
        contentWrapper.scrollWidth - scrollContainer.clientWidth - scrollContainer.scrollLeft > epsilon,
      )
    } else {
      setShowStart(scrollContainer.scrollTop > epsilon)
      setShowEnd(
        contentWrapper.scrollHeight - scrollContainer.clientHeight - scrollContainer.scrollTop > epsilon,
      )
    }
  }

  const onScroll = () => update()
  const onResize = () => update()

  onMount(() => {
    update()
    scrollContainer?.addEventListener('scroll', onScroll, { passive: true } as any)
    window.addEventListener('resize', onResize)
  })
  onCleanup(() => {
    scrollContainer?.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
  })

  const startShadowClasses = axis === 'horizontal' ? 'left-0 top-0 bottom-0' : 'top-0 left-0 right-0'
  const endShadowClasses = axis === 'horizontal' ? 'right-0 top-0 bottom-0' : 'bottom-0 left-0 right-0'

  const startStyle = {
    [axis === 'horizontal' ? 'width' : 'height']: shadowSize,
    'background-image': axis === 'horizontal'
      ? `linear-gradient(to right, ${shadowColor}, transparent)`
      : `linear-gradient(to bottom, ${shadowColor}, transparent)`,
  } as any
  const endStyle = {
    [axis === 'horizontal' ? 'width' : 'height']: shadowSize,
    'background-image': axis === 'horizontal'
      ? `linear-gradient(to left, ${shadowColor}, transparent)`
      : `linear-gradient(to top, ${shadowColor}, transparent)`,
  } as any

  return (
    <div class="relative">
      <div
        aria-hidden="true"
        class={cn('pointer-events-none absolute z-10 transition-opacity', startShadowClasses, showStart() ? 'opacity-100' : 'opacity-0')}
        style={startStyle}
      />
      <div
        ref={(el) => (scrollContainer = el)}
        class={cn('scrollbar-hide', axis === 'horizontal' ? 'overflow-x-auto' : 'overflow-y-auto', props.class)}
      >
        <div ref={(el) => (contentWrapper = el)} class={axis === 'horizontal' ? 'w-fit' : ''}>
          {props.children}
        </div>
      </div>
      <div
        aria-hidden="true"
        class={cn('pointer-events-none absolute z-10 transition-opacity', endShadowClasses, showEnd() ? 'opacity-100' : 'opacity-0')}
        style={endStyle}
      />
    </div>
  )
}

export default KunScrollShadow

