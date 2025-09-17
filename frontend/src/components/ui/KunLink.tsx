import { type Component, splitProps } from 'solid-js'
import { A } from '@solidjs/router'
import type { KunUIColor, KunUISize } from './type'
import { cn } from '~/utils/cn'
import { KunIcon } from './KunIcon'

export interface KunLinkProps extends Record<string, any> {
  to?: string
  color?: KunUIColor | 'foreground'
  underline?: 'none' | 'hover' | 'always'
  size?: KunUISize
  class?: string
  rel?: string
  target?: '_self' | '_blank' | '_parent' | '_top'
  isShowAnchorIcon?: boolean
  prefix?: any
  suffix?: any
}

const colorClasses: Record<Exclude<KunLinkProps['color'], undefined>, string> = {
  default: 'text-foreground',
  foreground: 'text-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
}

const sizeClasses: Record<KunUISize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
}

const underlineMap = {
  none: '',
  hover: 'hover:underline underline-offset-3',
  always: 'underline underline-offset-3',
} as const

export const KunLink: Component<KunLinkProps> = (allProps) => {
  const [props, others] = splitProps(allProps, [
    'to',
    'color',
    'underline',
    'size',
    'class',
    'rel',
    'target',
    'isShowAnchorIcon',
    'prefix',
    'suffix',
    'children',
  ])

  const useRouter = !!props.to && props.to.startsWith('/')
  const className = cn(
    'inline-flex flex-wrap items-center gap-2 break-all',
    underlineMap[(props.underline ?? 'always')],
    sizeClasses[props.size ?? 'md'],
    colorClasses[(props.color ?? 'primary')],
    props.class,
  )

  const content = (
    <>
      {props.prefix}
      {props.children}
      {props.isShowAnchorIcon && <KunIcon name="lucide:external-link" />}
      {props.suffix}
    </>
  )

  if (useRouter) {
    return (
      <A href={props.to!} class={className} rel={props.rel} target={props.target} {...others}>
        {content}
      </A>
    )
  }
  return (
    <a href={props.to} class={className} rel={props.rel} target={props.target} {...others}>
      {content}
    </a>
  )
}

export default KunLink

