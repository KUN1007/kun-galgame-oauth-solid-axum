import { type Component } from 'solid-js'
import { KunIcon } from '../KunIcon'
import { cn } from '~/utils/cn'

export interface IconProps {
  name: string
  class?: string
}

export const Icon: Component<IconProps> = (props) => {
  return <KunIcon name={props.name} class={cn(props.class)} />
}

export default Icon

