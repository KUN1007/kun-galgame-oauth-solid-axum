import { type Component, For } from 'solid-js'
import { cn } from '~/utils/cn'
import { KunIcon } from './KunIcon'

export interface KunTabItem {
  value: string
  textValue?: string
  icon?: string
  href?: string
  disabled?: boolean
}

export type KunTabVariant = 'solid' | 'underlined'
export type KunTabColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default'
export type KunTabSize = 'sm' | 'md' | 'lg'

export interface KunTabProps {
  items: KunTabItem[]
  modelValue: string
  variant?: KunTabVariant
  color?: KunTabColor
  size?: KunTabSize
  iconSize?: string
  fullWidth?: boolean
  disabled?: boolean
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  disableAnimation?: boolean
  class?: string
  innerClass?: string
  hasScrollbar?: boolean
  onUpdateModelValue?: (value: string) => void
  onChange?: (value: string) => void
}

export const KunTab: Component<KunTabProps> = (props) => {
  const containerClasses = cn(
    'inline-flex max-w-full overflow-scroll',
    props.fullWidth && 'w-full',
    props.disabled && 'opacity-50 cursor-not-allowed',
    !props.hasScrollbar && 'scrollbar-hide',
    props.class,
  )

  const tabListClasses = cn(
    'flex h-fit items-center gap-2',
    (props.variant ?? 'solid') === 'solid' && 'border border-default-200 rounded-lg p-1',
    (props.variant ?? 'solid') === 'underlined' && 'border-b border-default-200',
    props.fullWidth && 'w-full',
    props.innerClass,
  )

  const itemClasses = (item: KunTabItem) => {
    const isSelected = props.modelValue === item.value
    const base = 'whitespace-nowrap cursor-pointer select-none'
    const color = props.color ?? 'primary'
    if ((props.variant ?? 'solid') === 'solid') {
      return cn(
        base,
        'rounded-lg px-3 py-2',
        isSelected ? `bg-${color} text-white` : `hover:text-${color}`,
        item.disabled && 'opacity-50 cursor-not-allowed',
        !props.disableAnimation && 'transition-colors',
      )
    }
    return cn(
      base,
      'px-4 py-2 relative',
      isSelected && `text-${color} border-b-2 border-${color}`,
      isSelected && 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5',
      isSelected && `after:bg-${color}`,
      !isSelected && 'hover:text-default-900',
      item.disabled && 'opacity-50 cursor-not-allowed',
      !props.disableAnimation && 'after:transition-all',
    )
  }

  const sizeClass = ({ sm: 'text-sm', md: '', lg: 'text-lg' } as const)[props.size ?? 'md']

  const handleClick = (item: KunTabItem) => {
    if (props.disabled || item.disabled) return
    if (item.href) {
      window.location.href = item.href
    }
    props.onUpdateModelValue?.(item.value)
    props.onChange?.(item.value)
  }

  return (
    <div class={containerClasses}>
      <div class={tabListClasses} role="tablist">
        <For each={props.items}>
          {(item) => (
            <div
              role="tab"
              aria-selected={props.modelValue === item.value}
              aria-disabled={item.disabled || props.disabled}
              tabindex={(item.disabled || props.disabled) ? -1 : 0}
              onClick={[handleClick, item]}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick(item)}
              class="flex items-center gap-2"
            >
              {item.icon && (
                <KunIcon
                  name={item.icon}
                  class={cn(
                    props.modelValue === item.value ? `text-${props.color ?? 'primary'}` : 'text-default-500',
                    'transition-colors',
                  )}
                />
              )}
              {item.textValue && (
                <span class={cn(itemClasses(item), sizeClass)}>
                  {item.textValue}
                </span>
              )}
            </div>
          )}
        </For>
      </div>
    </div>
  )
}

export default KunTab

