import { type Component, JSX } from 'solid-js'
import { cn } from '~/utils/cn'
import KunBrand from '../KunBrand'

export const KunLayoutSidebar: Component<{
  class?: string
  children?: JSX.Element
}> = (props) => {
  return (
    <div
      class={cn(
        'scrollbar-hide sm:bg-default-100 bg-default-200 fixed z-1 flex h-full w-72 shrink-0 -translate-x-1 flex-col justify-between overflow-y-scroll rounded-none border-none p-0 shadow-none sm:backdrop-blur-[var(--kun-background-blur)]',
        props.class
      )}
    >
      <div class="space-y-3 p-3">
        <KunBrand />
        {props.children}
      </div>
    </div>
  )
}

export default KunLayoutSidebar
