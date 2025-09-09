import {
  type Component,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  Show,
  untrack,
} from 'solid-js'
import { Icon } from '@iconify-icon/solid'
import { cn } from '~/utils/cn'
import type { MessageOptions } from './useMessage'

type MessageItemProps = {
  messageData: MessageOptions
  onRemove: (id: string) => void
  class?: string
}

export const MessageItem: Component<MessageItemProps> = (props) => {
  const isRichText = createMemo(() => props.messageData.richText ?? false)

  let progressBarRef: HTMLDivElement | undefined
  let timer: NodeJS.Timeout | null = null
  const [remainingTime, setRemainingTime] = createSignal(
    props.messageData.duration
  )
  const [startTime, setStartTime] = createSignal(0)
  const [progressKey, setProgressKey] = createSignal(0)

  const pauseTimer = () => {
    if (props.messageData.duration <= 0) return
    if (timer) clearTimeout(timer)
    if (progressBarRef) {
      progressBarRef.style.animationPlayState = 'paused'
    }
    const elapsed = Date.now() - untrack(startTime)
    setRemainingTime((prev) => prev - elapsed)
  }

  const resumeTimer = () => {
    if (props.messageData.duration <= 0) return

    setStartTime(Date.now())
    if (progressBarRef) {
      progressBarRef.style.animationPlayState = 'running'
    }
    timer = setTimeout(
      () => props.onRemove(props.messageData.id),
      remainingTime()
    )
  }

  onMount(() => {
    if (props.messageData.duration > 0) {
      resumeTimer()
    }
  })

  onCleanup(() => {
    if (timer) clearTimeout(timer)
  })

  createEffect(() => {
    const currentCount = props.messageData.count

    untrack(() => {
      if (currentCount > 1) {
        if (timer) clearTimeout(timer)
        setRemainingTime(props.messageData.duration)
        setProgressKey((k) => k + 1)

        resumeTimer()
      }
    })
  })

  const typeStyles = createMemo(() => {
    switch (props.messageData.type) {
      case 'success':
        return {
          bg: 'bg-success-50 dark:bg-success-50/90',
          text: 'text-success-800',
          icon: 'text-success-500',
          progress: 'bg-success-400',
          iconName: 'lucide:check-circle-2',
        }

      case 'error':
        return {
          bg: 'bg-danger-50 dark:bg-danger-50/90',
          text: 'text-danger-800',
          icon: 'text-danger-500',
          progress: 'bg-danger-400',
          iconName: 'lucide:x-circle',
        }
      case 'warn':
        return {
          bg: 'bg-warning-50 dark:bg-warning-50/90',
          text: 'text-warning-800',
          icon: 'text-warning-500',
          progress: 'bg-warning-400',
          iconName: 'lucide:alert-triangle',
        }
      case 'info':
      default:
        return {
          bg: 'bg-primary-50 dark:bg-primary-50/90',
          text: 'text-primary-800',
          icon: 'text-primary-500',
          progress: 'bg-primary-400',
          iconName: 'lucide:info',
        }
    }
  })

  return (
    <div
      class={cn(
        'relative mb-3 flex w-full items-center overflow-hidden rounded-xl p-4 shadow-lg transition-all duration-300',
        typeStyles().bg,
        typeStyles().text,
        props.class
      )}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
    >
      <Icon
        class={cn('mt-0.5 mr-3 h-6 w-6 flex-shrink-0', typeStyles().icon)}
        icon={typeStyles().iconName}
      />

      <div class="flex-1 text-sm font-medium">
        <Show
          when={!isRichText()}
          fallback={<div innerHTML={props.messageData.message} />}
        >
          <span>{props.messageData.message}</span>
        </Show>
      </div>

      <Show when={props.messageData.count > 1}>
        <span class="ml-3 flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-xs font-bold dark:bg-white/10">
          {props.messageData.count}
        </span>
      </Show>

      {(() => {
        progressKey()
        return (
          <div
            ref={progressBarRef}
            class="progress-bar absolute bottom-0 left-0 h-1"
            classList={{ [typeStyles().progress]: true }}
            style={{
              'animation-duration': `${props.messageData.duration}ms`,
            }}
          />
        )
      })()}
    </div>
  )
}
