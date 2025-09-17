import { type Component, createMemo, For } from 'solid-js'
import { TransitionGroup } from 'solid-transition-group'
import {
  createMessageState,
  type MessageOptions,
  type MessagePosition
} from './useMessage'
import '../styles/kun-message.css'
import { MessageItem } from './MessageItem'

export const MessageContainer: Component = () => {
  const { messages, removeMessage } = createMessageState()

  const positionedMessages = createMemo(() => {
    const groups = {
      'top-left': [],
      'top-center': [],
      'top-right': [],
      'bottom-left': [],
      'bottom-center': [],
      'bottom-right': []
    } as Record<MessagePosition, MessageOptions[]>

    for (const msg of messages) {
      if (groups[msg.position]) {
        groups[msg.position].push(msg)
      }
    }
    return groups
  })

  const positionClasses: Record<MessagePosition, string> = {
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
    'top-left': 'top-4 left-4 items-start',
    'top-right': 'top-4 right-4 items-end',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-left': 'bottom-4 left-4 items-start',
    'bottom-right': 'bottom-4 right-4 items-end'
  }

  return (
    <For each={Object.keys(positionClasses) as MessagePosition[]}>
      {(position) => (
        <div
          class={[
            'pointer-events-none fixed z-[7777] flex w-full max-w-sm flex-col p-4',
            positionClasses[position]
          ].join(' ')}
        >
          <TransitionGroup
            enterClass="message-list-enter"
            enterActiveClass="message-list-enter-active"
            exitToClass="message-list-exit-to"
            exitActiveClass="message-list-exit-active"
            moveClass="message-list-move"
          >
            <For each={positionedMessages()[position]}>
              {(msg) => (
                <MessageItem
                  messageData={msg}
                  onRemove={removeMessage}
                  class="pointer-events-auto"
                />
              )}
            </For>
          </TransitionGroup>
        </div>
      )}
    </For>
  )
}
