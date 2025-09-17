import { type Component, createSignal, type JSX } from 'solid-js'
import { KunModal } from './KunModal'
import { KunImage } from './KunImage'

export interface KunLightboxProps {
  src: string
  alt?: string
  thumbClass?: string
  children?: JSX.Element
}

export const KunLightbox: Component<KunLightboxProps> = (props) => {
  const [open, setOpen] = createSignal(false)
  return (
    <>
      {props.children ? (
        <div onClick={() => setOpen(true)}>{props.children}</div>
      ) : (
        <KunImage
          class={props.thumbClass}
          src={props.src}
          alt={props.alt}
          onClick={() => setOpen(true)}
        />
      )}
      <KunModal
        modalValue={open()}
        onUpdateModalValue={setOpen}
        withContainer={false}
      >
        <div class="max-h-[90vh] max-w-[90vw]">
          <img
            src={props.src}
            alt={props.alt}
            class="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      </KunModal>
    </>
  )
}
