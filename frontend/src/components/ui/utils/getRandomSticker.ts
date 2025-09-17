import { createSignal } from 'solid-js'
import { kunOauth } from '@/src/config/kunApp'
import { randomNum } from '@/src/utils/randomNum'

const stickerSignals = new Map<string, () => string>()

export const getRandomSticker = (id: string) => {
  if (stickerSignals.has(id)) {
    return stickerSignals.get(id)!
  }

  const randomPackIndex = randomNum(1, 5)
  const randomStickerIndex = randomNum(1, 80)
  const url = `${kunOauth.domain.sticker}/stickers/KUNgal${randomPackIndex}/${randomStickerIndex}.webp`

  const [value] = createSignal(url)
  stickerSignals.set(id, value)

  return value
}
