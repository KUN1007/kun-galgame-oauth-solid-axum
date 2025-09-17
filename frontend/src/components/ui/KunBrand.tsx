import { type Component } from 'solid-js'
import { KunLink } from './KunLink'
import { KunBadge } from './KunBadge'
import { KunImage } from './KunImage'

export interface KunBrandProps {
  title?: string
  titleShort?: string
  href?: string
}

export const KunBrand: Component<KunBrandProps> = (props) => {
  return (
    <KunLink
      to={props.href ?? '/'}
      underline="none"
      color="default"
      class="flex cursor-pointer items-center gap-3"
    >
      <KunImage
        class="size-10"
        src="/favicon.webp"
        alt={props.titleShort ?? 'kun'}
      />
      <span class="text-xl">{props.title ?? 'KUN'}</span>
      <KunBadge size="md" color="primary">
        OAuth
      </KunBadge>
    </KunLink>
  )
}

export default KunBrand
