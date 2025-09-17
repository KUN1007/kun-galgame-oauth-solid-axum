import {
  type ParentComponent,
  Show,
  onCleanup,
  onMount,
  splitProps
} from 'solid-js'
import { Portal } from 'solid-js/web'
import { cn } from '~/utils/cn'
import { KunButton } from './KunButton'
import { KunIcon } from './KunIcon'

export interface KunModalProps {
  modalValue: boolean
  class?: string
  innerClass?: string
  isDismissable?: boolean
  isShowCloseButton?: boolean
  withContainer?: boolean
  onUpdateModalValue?: (value: boolean) => void
  onClose?: () => void
}

const lockScroll = () => {
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = `${
    window.innerWidth - document.documentElement.clientWidth
  }px`
}

const unlockScroll = () => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

export const KunModal: ParentComponent<KunModalProps> = (allProps) => {
  const [props, others] = splitProps(allProps, [
    'modalValue',
    'class',
    'innerClass',
    'isDismissable',
    'isShowCloseButton',
    'withContainer',
    'onUpdateModalValue',
    'onClose',
    'children'
  ])

  const isDismissable = props.isDismissable ?? true
  const withContainer = props.withContainer ?? true
  const showClose = props.isShowCloseButton ?? true

  const handleClose = () => {
    if (!isDismissable) return
    props.onUpdateModalValue?.(false)
    props.onClose?.()
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') handleClose()
  }

  onMount(() => {
    if (props.modalValue) lockScroll()
    window.addEventListener('keydown', onKeyDown)
  })

  onCleanup(() => {
    unlockScroll()
    window.removeEventListener('keydown', onKeyDown)
  })

  if (props.modalValue) lockScroll()
  else unlockScroll()

  return (
    <Portal>
      <Show when={props.modalValue}>
        <div
          class={cn(
            'bg-default-800/70 dark:bg-background/70 fixed top-0 left-0 z-[1007] flex h-full w-full items-center justify-center p-3 transition-all',
            props.class
          )}
          onClick={handleClose}
          tabindex={0}
          {...others}
        >
          {withContainer ? (
            <div
              class={cn(
                'bg-content1/85 scrollbar-hide relative m-auto max-h-[90vh] min-w-80 overflow-y-auto rounded-lg border p-6 shadow-lg backdrop-blur-[var(--kun-background-blur)] transition-all',
                props.innerClass
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {props.children}
              {showClose && (
                <KunButton
                  color="default"
                  variant="light"
                  class="absolute top-1 right-1"
                  rounded="full"
                  isIconOnly
                  onClick={() => {
                    props.onUpdateModalValue?.(false)
                    props.onClose?.()
                  }}
                >
                  <KunIcon name="lucide:x" />
                </KunButton>
              )}
            </div>
          ) : (
            props.children
          )}
        </div>
      </Show>
    </Portal>
  )
}
