import { type Component, splitProps } from 'solid-js'
import { cn } from '~/utils/cn'

export interface KunImageProps extends Record<string, any> {
  src: string
  alt?: string
  class?: string
  custom?: boolean
}

export const KunImage: Component<KunImageProps> = (allProps) => {
  const [props, others] = splitProps(allProps, ['src', 'alt', 'class', 'custom'])
  return (
    <img
      src={props.src}
      alt={props.alt}
      class={cn(props.class)}
      loading="lazy"
      {...others}
    />
  )
}

export default KunImage

