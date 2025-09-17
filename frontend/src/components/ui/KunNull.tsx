import { KunImage } from './KunImage'
import { getRandomSticker } from './utils/getRandomSticker'
import { withDefaults } from '@/src/utils/withDefaults'
import type { Component } from 'solid-js'

type Props = {
  description?: string
  isShowSticker?: boolean
}

export const KunNull: Component<Props> = (props) => {
  const local = withDefaults(props, {
    description: '',
    isShowSticker: true
  })

  return (
    <div class="m-auto flex flex-col items-center gap-3">
      {local.isShowSticker && (
        <KunImage
          src={getRandomSticker(local.description)()}
          class="h-32 w-32 rounded-lg"
          loading="lazy"
          alt="blank galgame"
        />
      )}
      <span>{local.description}</span>
    </div>
  )
}
