import { type Component, createSignal, onCleanup, onMount } from 'solid-js'
import { cn } from '~/utils/cn'

export interface KunPopoverProps {
  position?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
  innerClass?: string
  trigger?: any
  children?: any
}

export const KunPopover: Component<KunPopoverProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false)
  let triggerRef: HTMLElement | undefined
  let popoverRef: HTMLElement | undefined
  const popoverId = `kun-popover-${Math.random().toString(36).slice(2, 8)}`

  const positionClass = () => {
    switch (props.position ?? 'bottom-start') {
      case 'top-start':
        return 'bottom-full left-0 mb-2'
      case 'top-end':
        return 'bottom-full right-0 mb-2'
      case 'bottom-end':
        return 'top-full right-0'
      default:
        return 'top-full left-0'
    }
  }

  const close = (event: MouseEvent) => {
    const t = event.target as Node
    if (triggerRef && triggerRef.contains(t)) return
    if (popoverRef && popoverRef.contains(t)) return
    setIsOpen(false)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen()) setIsOpen(false)
  }

  onMount(() => {
    document.addEventListener('click', close)
    window.addEventListener('keydown', onKeyDown)
  })
  onCleanup(() => {
    document.removeEventListener('click', close)
    window.removeEventListener('keydown', onKeyDown)
  })

  return (
    <div class="relative z-20 inline-block">
      <div
        ref={(el) => (triggerRef = el)}
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={(e) =>
          (e.key === 'Enter' || e.key === ' ') && setIsOpen((v) => !v)
        }
        tabindex={0}
        role="button"
        aria-label="popover-trigger"
        aria-expanded={isOpen()}
        aria-controls={popoverId}
      >
        {props.trigger}
      </div>
      {isOpen() && (
        <div
          ref={(el) => (popoverRef = el)}
          id={popoverId}
          role="dialog"
          aria-hidden={!isOpen()}
          class={cn(
            'absolute z-50 mt-2 rounded-lg border bg-white shadow-lg dark:bg-black',
            positionClass(),
            props.innerClass
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {props.children}
        </div>
      )}
    </div>
  )
}

export default KunPopover
