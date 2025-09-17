import { type Component, type JSX, For } from 'solid-js'
import { type RippleType } from '../ripple/useRipple'
import type { KunUIVariant, KunUIColor, KunUISize, KunUIRounded } from '../type'
import '../styles/kun-ripple.css'

export interface KunButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: KunUIVariant
  color?: KunUIColor
  size?: KunUISize
  rounded?: KunUIRounded
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  isIconOnly?: boolean
  icon?: JSX.Element
  iconPosition?: 'left' | 'right'
  class?: string
  href?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  'aria-label'?: string
}

export const KunRipple: Component<{ ripples: RippleType[] }> = (props) => {
  return (
    <>
      <For each={props.ripples}>
        {(ripple) => (
          <span
            class="bg-foreground/30 kun-ripple pointer-events-none absolute rounded-full"
            style={{
              width: `${ripple.size}px`,
              height: `${ripple.size}px`,
              top: `${ripple.y}px`,
              left: `${ripple.x}px`
            }}
          />
        )}
      </For>
    </>
  )
}
