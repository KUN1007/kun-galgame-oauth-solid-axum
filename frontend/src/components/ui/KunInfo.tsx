import { cn } from '~/utils/cn'
import { type Component, type JSX } from 'solid-js'

export interface KunInfoProps {
  class?: string
  children?: JSX.Element
}

export const KunInfo: Component<KunInfoProps> = (props) => {
  return <div class={cn('text-default-600', props.class)}>{props.children}</div>
}
