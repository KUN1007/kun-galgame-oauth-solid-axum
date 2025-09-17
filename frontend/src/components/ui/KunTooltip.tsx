import { type Component, createSignal } from 'solid-js'
import { cn } from '~/utils/cn'

export interface KunTooltipProps {
  text?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  class?: string
  children?: any
  content?: any
}

export const KunTooltip: Component<KunTooltipProps> = (props) => {
  const [isVisible, setIsVisible] = createSignal(false)

  const positionClasses = () => {
    switch (props.position ?? 'top') {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2'
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2'
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2'
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
    }
  }

  const arrowPositionClasses = () => {
    switch (props.position ?? 'top') {
      case 'top':
        return 'bottom-[-4px] left-1/2 -translate-x-1/2'
      case 'bottom':
        return 'top-[-4px] left-1/2 -translate-x-1/2'
      case 'left':
        return 'right-[-4px] top-1/2 -translate-y-1/2'
      case 'right':
        return 'left-[-4px] top-1/2 -translate-y-1/2'
      default:
        return 'bottom-[-4px] left-1/2 -translate-x-1/2'
    }
  }

  return (
    <div
      class={cn('relative inline-block', props.class)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocusIn={() => setIsVisible(true)}
      onFocusOut={() => setIsVisible(false)}
    >
      {props.children}
      {isVisible() && (
        <div
          class={cn(
            'absolute z-50 hidden rounded-lg border bg-white px-3 py-2 text-sm font-medium whitespace-nowrap shadow sm:block dark:bg-black',
            positionClasses()
          )}
          role="tooltip"
        >
          {props.content ?? props.text}
          <div
            class={cn(
              'absolute h-2 w-2 rotate-45 transform bg-white dark:bg-black',
              arrowPositionClasses()
            )}
          />
        </div>
      )}
    </div>
  )
}

export default KunTooltip
