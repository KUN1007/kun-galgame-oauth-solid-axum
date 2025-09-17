import { type Component } from 'solid-js'
import { KunButton, type KunButtonProps } from './KunButton'
import { KunIcon } from './KunIcon'

export interface KunCopyProps extends Partial<KunButtonProps> {
  text: string
  name?: string
}

const decodeIfEncoded = (text: string) => {
  try {
    return decodeURIComponent(text)
  } catch {
    return text
  }
}

export const KunCopy: Component<KunCopyProps> = (props) => {
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(props.text)
    } catch {
      const el = document.createElement('textarea')
      el.value = props.text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
  }

  return (
    <KunButton
      variant={props.variant ?? 'light'}
      color={props.color ?? 'primary'}
      size={props.size ?? 'md'}
      rounded={props.rounded ?? 'lg'}
      class={['gap-2', props.class].filter(Boolean).join(' ')}
      onClick={handleClick}
    >
      <span>{decodeIfEncoded(props.name ? props.name : props.text)}</span>
      <KunIcon name="lucide:copy" />
    </KunButton>
  )
}

export default KunCopy

