import { type Component, JSX } from 'solid-js'
import { cn } from '~/utils/cn'

export interface KunInfoProps {
  class?: string
  children?: JSX.Element
}

export const KunInfo: Component<KunInfoProps> = (props) => {
  return <div class={cn('text-default-600', props.class)}>{props.children}</div>
}

export default KunInfo

