import { createStore } from 'solid-js/store'
import { render } from 'solid-js/web'
import { MessageContainer } from './MessageContainer'

export type MessageType = 'warn' | 'success' | 'error' | 'info'
export type MessagePosition =
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'

export interface MessageOptions {
  id: string
  message: string
  type: MessageType
  duration: number
  richText: boolean
  position: MessagePosition
  count: number
}

const [messages, setMessages] = createStore<MessageOptions[]>([])
let seed = 0
let containerRef: HTMLElement | null = null

export const createMessageState = () => ({
  messages,
  removeMessage: (id: string) => {
    setMessages((msgs) => msgs.filter((msg) => msg.id !== id))
  },
})

const initializeContainer = () => {
  if (containerRef) return

  containerRef = document.createElement('div')
  containerRef.id = 'kun-message-container-root'
  document.body.appendChild(containerRef)

  render(() => <MessageContainer />, containerRef)
}

export const useKunMessage = (
  messageData: number | string,
  type: MessageType,
  duration = 3000,
  richText = false,
  position: MessagePosition = 'top-center'
) => {
  initializeContainer()

  const existingMessageIndex = messages.findIndex(
    (m) =>
      m.message === messageData && m.position === position && m.type === type
  )

  if (existingMessageIndex > -1) {
    setMessages(existingMessageIndex, 'count', (c) => c + 1)
    setMessages(existingMessageIndex, 'duration', duration)
  } else {
    seed++
    const id = `message_${seed}`

    const newMessage: MessageOptions = {
      id,
      message: String(messageData),
      type,
      duration,
      richText,
      position,
      count: 1,
    }

    if (position.startsWith('top')) {
      setMessages(messages.length, newMessage)
    } else {
      setMessages([newMessage, ...messages])
    }
  }
}
