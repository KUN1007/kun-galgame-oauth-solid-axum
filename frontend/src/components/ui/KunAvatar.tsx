import { type Component, createMemo } from 'solid-js'
import { cn } from '~/utils/cn'

export interface KunUser {
  id: string | number
  name: string
  avatar?: string | null
}

export interface KunAvatarProps {
  user: KunUser
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'original' | 'original-sm'
  isNavigation?: boolean
  class?: string
  disableFloating?: boolean
  floatingPosition?: 'top' | 'bottom' | 'left' | 'right'
}

export const KunAvatar: Component<KunAvatarProps> = (props) => {
  const sizeClasses = createMemo(() => {
    switch (props.size) {
      case 'original':
        return 'size-40'
      case 'original-sm':
        return 'size-24'
      case 'xs':
        return 'size-4'
      case 'sm':
        return 'size-6'
      case 'md':
        return 'size-8'
      case 'lg':
        return 'size-10'
      case 'xl':
        return 'size-12'
      default:
        return 'size-8'
    }
  })

  const userAvatarSrc = createMemo(() => {
    const src = props.user.avatar || ''
    if (!src) return ''
    if (props.size === 'original' || props.size === 'original-sm') return src
    return src.endsWith('.webp') ? src.replace(/\.webp$/, '-100.webp') : src
  })

  const handleClick = (e: MouseEvent) => {
    if (props.isNavigation !== false) {
      e.preventDefault()
    }
  }

  return (
    <div
      class={cn(
        'flex shrink-0 cursor-pointer justify-center rounded-full transition duration-150 ease-in-out hover:scale-110',
        sizeClasses(),
        props.class,
      )}
      onClick={handleClick}
      role="img"
      aria-label={props.user.name}
    >
      {userAvatarSrc() ? (
        <img
          class={cn('inline-block rounded-full', sizeClasses())}
          src={userAvatarSrc()}
          alt={props.user.name}
          loading="lazy"
        />
      ) : (
        <span
          class={cn(
            'bg-default flex shrink-0 items-center justify-center rounded-full text-white',
            sizeClasses(),
          )}
        >
          {props.user.name.slice(0, 1).toUpperCase()}
        </span>
      )}
    </div>
  )
}

export default KunAvatar

