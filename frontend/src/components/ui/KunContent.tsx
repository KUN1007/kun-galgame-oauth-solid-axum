import { type Component, type JSX } from 'solid-js'
import { cn } from '~/utils/cn'

export const KunContent: Component<{
  class?: string
  children?: JSX.Element
}> = (props) => {
  return <div class={cn('kun-prose', props.class)}>{props.children}</div>
}

export default KunContent
