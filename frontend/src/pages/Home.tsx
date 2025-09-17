import { KunButton } from '../components/ui/KunButton'
import { KunCard } from '../components/ui/KunCard'
import { KunIcon } from '../components/ui/KunIcon'
import { useKunMessage } from '~/components/ui/message/useMessage'

export const KunHome = () => {
  return (
    <div class="grid h-screen place-items-center">
      <KunButton
        variant="flat"
        color="danger"
        onClick={() => useKunMessage('欸嘿嘿嘿莲', 'error')}
      >
        欸嘿嘿嘿莲
      </KunButton>
      <KunButton onClick={() => useKunMessage('咕咕咕', 'success')}>
        咕咕咕
      </KunButton>
      <KunButton onClick={() => useKunMessage('欸嘿嘿嘿', 'info')}>
        欸嘿嘿嘿
      </KunButton>

      <KunIcon name="lucide:x" />

      <KunCard is-hoverable={false}>
        <p>
          <strong>我们鼓励添加游戏的正版购买链接</strong>
        </p>
        <p>
          这里可以添加任何与该游戏有关的链接, 例如论坛话题, 其它网络文章,
          视频链接, 媒体链接等等
        </p>
        <p>除官方购买链接外, 不得放置付费的引流链接</p>
        <p>我们会在发布游戏时自动添加 VNDB 链接</p>
      </KunCard>
    </div>
  )
}
