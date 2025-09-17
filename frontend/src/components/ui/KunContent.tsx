import { type Component, JSX } from 'solid-js'
import { cn } from '~/utils/cn'

export const KunContent: Component<{ class?: string; children?: JSX.Element }> = (props) => {
  return <div class={cn('prose prose-neutral dark:prose-invert', props.class)}>{props.children}</div>
}

export default KunContent

