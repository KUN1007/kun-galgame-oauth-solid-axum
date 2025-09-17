import {
  createMemo,
  splitProps,
  Show,
  type JSX,
  type ParentComponent
} from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { cn } from '~/utils/cn'
import { withDefaults } from '~/utils/withDefaults'
import { useRipple } from './ripple/useRipple'
import { KunIcon } from './KunIcon'
import { extractTextFromChildren } from './utils/extractTextFromChildren'
import { KunRipple } from './ripple/Ripple'
import type { KunUIVariant, KunUIColor, KunUISize, KunUIRounded } from './type'

export interface KunButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: KunUIVariant
  color?: KunUIColor
  size?: KunUISize
  rounded?: KunUIRounded
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  isIconOnly?: boolean
  icon?: JSX.Element
  iconPosition?: 'left' | 'right'
  class?: string
  href?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  'aria-label'?: string
}

export const KunButton: ParentComponent<KunButtonProps> = (props) => {
  const merged = withDefaults(props, {
    variant: 'solid',
    color: 'primary',
    size: 'md',
    rounded: 'lg',
    type: 'button',
    disabled: false,
    loading: false,
    fullWidth: false,
    isIconOnly: false,
    iconPosition: 'left',
    target: '_self'
  })

  const [local, others] = splitProps(merged, [
    'variant',
    'color',
    'size',
    'rounded',
    'loading',
    'fullWidth',
    'isIconOnly',
    'icon',
    'disabled',
    'iconPosition',
    'class',
    'href',
    'target',
    'children',
    'onClick'
  ])

  const { ripples, createRipple } = useRipple()

  const handleClick = (event: MouseEvent) => {
    createRipple(event)
    if (typeof local.onClick === 'function') {
      ;(local.onClick as (e: MouseEvent) => void)(event)
    }
  }

  const sizeClasses = createMemo(() => {
    if (local.isIconOnly) {
      switch (local.size) {
        case 'xs':
          return 'p-1'
        case 'sm':
          return 'p-1.5'
        case 'md':
          return 'p-2'
        case 'lg':
          return 'p-2.5'
        case 'xl':
          return 'p-3'
        default:
          return 'p-2'
      }
    }
    switch (local.size) {
      case 'xs':
        return 'text-xs px-2 py-1'
      case 'sm':
        return 'text-sm px-3 py-1.5'
      case 'md':
        return 'text-sm px-4 py-2'
      case 'lg':
        return 'text-base px-5 py-2.5'
      case 'xl':
        return 'text-lg px-6 py-3'
      default:
        return 'text-sm px-4 py-2'
    }
  })

  const colorVariants: Record<KunUIVariant, Record<KunUIColor, string>> = {
    solid: {
      default: 'bg-default',
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      success: 'bg-success',
      warning: 'bg-warning',
      danger: 'bg-danger'
    },
    bordered: {
      default: 'bg-transparent border-default',
      primary: 'bg-transparent border-primary text-primary',
      secondary: 'bg-transparent border-secondary text-secondary',
      success: 'bg-transparent border-success text-success',
      warning: 'bg-transparent border-warning text-warning',
      danger: 'bg-transparent border-danger text-danger'
    },
    light: {
      default: 'bg-transparent hover:bg-default/40',
      primary: 'bg-transparent text-primary hover:bg-primary/20',
      secondary: 'bg-transparent text-secondary hover:bg-secondary/20',
      success: 'bg-transparent text-success hover:bg-success/20',
      warning: 'bg-transparent text-warning hover:bg-warning/20',
      danger: 'bg-transparent text-danger hover:bg-danger/20'
    },
    flat: {
      default: 'bg-default/40 text-default-700',
      primary: 'bg-primary/20 text-primary-600',
      secondary: 'bg-secondary/20 text-secondary-600',
      success: 'bg-success/20 text-success-700 dark:text-success',
      warning: 'bg-warning/20 text-warning-700 dark:text-warning',
      danger: 'bg-danger/20 text-danger-600 dark:text-danger-500'
    },
    faded: {
      default: 'border-default bg-default-100',
      primary: 'border-default bg-primary-100 text-primary',
      secondary: 'border-default bg-secondary-100 text-secondary',
      success: 'border-default bg-success-100 text-success',
      warning: 'border-default bg-warning-100 text-warning',
      danger: 'border-default bg-danger-100 text-danger'
    },
    shadow: {
      default: 'shadow-lg shadow-default/50 bg-default',
      primary: 'shadow-lg shadow-primary/40 bg-primary',
      secondary: 'shadow-lg shadow-secondary/40 bg-secondary',
      success: 'shadow-lg shadow-success/40 bg-success',
      warning: 'shadow-lg shadow-warning/40 bg-warning',
      danger: 'shadow-lg shadow-danger/40 bg-danger'
    },
    ghost: {
      default: 'border-default',
      primary: 'border-primary text-primary',
      secondary: 'border-secondary text-secondary',
      success: 'border-success text-success',
      warning: 'border-warning text-warning',
      danger: 'border-danger text-danger'
    }
  }

  const variantClasses = createMemo(() => {
    switch (local.variant) {
      case 'solid':
        return 'shadow-sm text-white'
      case 'bordered':
        return 'border-2 bg-transparent'
      case 'light':
        return 'bg-opacity-20 border-transparent'
      case 'flat':
        return 'bg-opacity-20 border-transparent shadow-none'
      case 'faded':
        return 'bg-opacity-10 border-transparent'
      case 'shadow':
        return 'shadow-lg text-white'
      case 'ghost':
        return 'bg-transparent border-transparent shadow-none hover:bg-opacity-10'
      default:
        return 'shadow-sm'
    }
  })

  const colorClasses = createMemo(() => {
    return colorVariants[local.variant]?.[local.color] || ''
  })

  const roundedClasses = createMemo(() => {
    switch (local.rounded) {
      case 'none':
        return 'rounded-none'
      case 'sm':
        return 'rounded-sm'
      case 'md':
        return 'rounded-md'
      case 'lg':
        return 'rounded-lg'
      case 'full':
        return 'rounded-full'
      default:
        return 'rounded-lg'
    }
  })

  const computedAriaLabel = createMemo(() => {
    if (merged['aria-label']) {
      return merged['aria-label']
    }
    if (local.isIconOnly) {
      // if (import.meta.env.DEV) {
      //   console.warn(
      //     `[KunButton] An icon-only button should have an explicit 'aria-label' prop for accessibility.`
      //   )
      // }
      return 'button'
    }
    return extractTextFromChildren(local.children).trim() || ''
  })

  return (
    <Dynamic
      component={local.href ? 'a' : 'button'}
      class={cn(
        'relative inline-flex cursor-pointer items-center justify-center gap-1 overflow-hidden rounded-md font-medium transition-all hover:opacity-80 active:scale-[0.97] disabled:opacity-50',
        sizeClasses(),
        variantClasses(),
        colorClasses(),
        roundedClasses(),
        local.fullWidth && 'w-full',
        (local.disabled || local.loading) && 'cursor-not-allowed',
        local.class
      )}
      href={local.href}
      target={local.target}
      {...others}
      disabled={local.disabled || local.loading}
      role={local.href ? 'link' : 'button'}
      aria-label={computedAriaLabel()}
      onClick={handleClick}
    >
      <Show when={local.loading}>
        <KunIcon class="text-sm" name="svg-spinners:90-ring-with-bg" />
      </Show>

      <Show when={!local.loading}>
        <Show when={local.icon && local.iconPosition === 'left'}>
          <span class="mr-2">{local.icon}</span>
        </Show>
        {local.children}
        <Show when={local.icon && local.iconPosition === 'right'}>
          <span class="ml-2">{local.icon}</span>
        </Show>
      </Show>

      <KunRipple ripples={ripples()} />
    </Dynamic>
  )
}
