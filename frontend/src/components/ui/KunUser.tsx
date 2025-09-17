import { type Component } from 'solid-js'
import { KunAvatar, type KunUser } from './KunAvatar'
import { cn } from '~/utils/cn'

export interface KunUserProps {
  user: KunUser
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'original' | 'original-sm'
  description?: string
  class?: string
  disableFloating?: boolean
  floatingPosition?: 'top' | 'bottom' | 'left' | 'right'
}

export const KunUserCard: Component<KunUserProps> = (props) => {
  return (
    <div class={cn('flex items-center gap-2', props.class)}>
      <KunAvatar
        floatingPosition={props.floatingPosition}
        disableFloating={props.disableFloating}
        user={props.user}
        size={props.size}
      />
      <div class="flex flex-col text-sm">
        <span>{props.user.name}</span>
        {props.description && (
          <span class="text-default-500">{props.description}</span>
        )}
      </div>
    </div>
  )
}

export default KunUserCard
