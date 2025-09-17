import { type Component } from 'solid-js'
import { Icon } from '@iconify-icon/solid'
import { cn } from '~/utils/cn'
import './styles/kun-icon.css'

export interface KunIconProps {
  name: string
  class?: string
}

export const KunIcon: Component<KunIconProps> = (props) => {
  return (
    <span class="kun-icon inline-flex items-center justify-center">
      <Icon icon={props.name} class={cn('text-inherit', props.class)} />
    </span>
  )
}
