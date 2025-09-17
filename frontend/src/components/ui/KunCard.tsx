import {
  type JSX,
  type ParentComponent,
  createMemo,
  splitProps,
  Show
} from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { useRipple } from './ripple/useRipple'
import { cn } from '~/utils/cn'
import { withDefaults } from '~/utils/withDefaults'
import { KunRipple } from './ripple/Ripple'
import type { KunUIColor } from '../ui/type'

export interface KunCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  isHoverable?: boolean
  isPressable?: boolean
  isTransparent?: boolean
  bordered?: boolean
  class?: string
  contentClass?: string
  href?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  color?: KunUIColor | 'background'
  darkBorder?: boolean
  header?: JSX.Element
  cover?: JSX.Element
  footer?: JSX.Element
}

export const KunCard: ParentComponent<KunCardProps> = (props) => {
  const merged = withDefaults(props, {
    isPressable: false,
    isHoverable: true,
    isTransparent: true,
    bordered: true,
    href: '/',
    rounded: 'lg',
    color: 'background',
    darkBorder: false
  })

  const [local, others] = splitProps(merged, [
    'isHoverable',
    'isPressable',
    'isTransparent',
    'bordered',
    'class',
    'contentClass',
    'href',
    'rounded',
    'color',
    'darkBorder',
    'header',
    'cover',
    'footer',
    'children',
    'onClick'
  ])

  const { ripples, createRipple } = useRipple()

  const handleKunCardClick = (event: MouseEvent) => {
    if (local.isPressable) {
      createRipple(event)
    }

    if (typeof local.onClick === 'function') {
      ;(local.onClick as (e: MouseEvent) => void)(event)
    }
  }

  const colorClasses: Record<KunUIColor | 'background', string> = {
    background: 'bg-background',
    default: 'bg-default-100/70',
    primary: 'bg-primary-100/70 border-primary-300',
    secondary: 'bg-secondary-100/70 border-secondary-300',
    success: 'bg-success-100/70 border-success-300',
    warning: 'bg-warning-100/70 border-warning-300',
    danger: 'bg-danger-100/70 border-danger-300'
  }

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

  return (
    <Dynamic
      component={local.isPressable ? 'a' : 'div'}
      class={cn(
        'relative flex flex-col gap-3 p-3 shadow backdrop-blur-[var(--kun-background-blur)] transition-all duration-200',
        local.isHoverable && 'hover:bg-default-100 hover:shadow-md',
        local.darkBorder && 'dark:border-default-200 border border-transparent',
        local.isPressable &&
          'cursor-pointer overflow-hidden active:scale-[0.97]',
        !local.isTransparent
          ? colorClasses[local.color!]
          : 'backdrop-blur-none',
        roundedClasses(),
        local.class
      )}
      href={local.isPressable ? local.href : undefined}
      onClick={handleKunCardClick}
      {...others}
    >
      <Show when={local.header}>
        <div>{local.header}</div>
      </Show>

      <Show when={local.cover}>
        <div class="w-full">{local.cover}</div>
      </Show>

      <div
        class={cn(
          'flex h-full flex-col justify-between gap-1',
          local.contentClass
        )}
      >
        {local.children}
      </div>

      <Show when={local.footer}>
        <div class="bg-default-100 border-t px-3 py-2">{local.footer}</div>
      </Show>

      <Show when={local.isPressable}>
        <KunRipple ripples={ripples()} />
      </Show>
    </Dynamic>
  )
}
