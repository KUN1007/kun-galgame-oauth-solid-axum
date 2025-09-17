import { createSignal, For, Show } from 'solid-js'
import { KunButton } from '../components/ui/KunButton'
import { KunCard } from '../components/ui/KunCard'
import { KunIcon } from '../components/ui/KunIcon'
import { KunBadge } from '../components/ui/KunBadge'
import { KunLink } from '../components/ui/KunLink'
import { KunAvatar } from '../components/ui/KunAvatar'
import { KunImage } from '../components/ui/KunImage'
import { KunContent } from '../components/ui/KunContent'
import { KunInfo } from '../components/ui/KunInfo'
import { KunNull } from '../components/ui/KunNull'
import { KunBrand } from '../components/ui/KunBrand'
import { KunLightbox } from '../components/ui/KunLightbox'
import { KunLoading } from '../components/ui/KunLoading'
import { KunFadeCard } from '../components/ui/KunFadeCard'
import { KunScrollShadow } from '../components/ui/KunScrollShadow'
import { KunUserCard } from '../components/ui/KunUser'
import { KunInput } from '../components/ui/KunInput'
import { KunTextarea } from '../components/ui/KunTextarea'
import { KunCheckBox } from '../components/ui/KunCheckBox'
import { KunSwitch } from '../components/ui/KunSwitch'
import { KunSlider } from '../components/ui/KunSlider'
import { KunSelect } from '../components/ui/KunSelect'
import { KunUpload } from '../components/ui/KunUpload'
import { KunModal } from '../components/ui/KunModal'
import { KunPopover } from '../components/ui/KunPopover'
import { KunTooltip } from '../components/ui/KunTooltip'
import { KunTab } from '../components/ui/KunTab'
import { KunPagination } from '../components/ui/KunPagination'
import { KunDatePicker } from '../components/ui/KunDatePicker'
import { KunEditor } from '../components/ui/editor/KunEditor'
import { Favicon } from '../components/ui/icons/Favicon'
import { Markdown } from '../components/ui/icons/Markdown'
import { useKunMessage } from '../components/ui/message/useMessage'
import type { ParentComponent } from 'solid-js'

const Section: ParentComponent<{ title: string }> = (props) => (
  <div class="space-y-3">
    <h2 class="text-xl font-semibold">{props.title}</h2>
    <div class="bg-content1/60 rounded-lg border p-4 shadow-sm">
      {props.children}
    </div>
  </div>
)

export const UiShowcase = () => {
  const [showModal, setShowModal] = createSignal(false)
  const [loading, setLoading] = createSignal(false)
  const [switchOn, setSwitchOn] = createSignal(true)
  const [checked] = createSignal(true)
  const [sliderVal, setSliderVal] = createSignal(42)
  const [selectVal, setSelectVal] = createSignal<string | number>('a')
  const [currentPage, setCurrentPage] = createSignal(3)
  const [tabVal, setTabVal] = createSignal('tab1')
  const [showFade, setShowFade] = createSignal(true)
  const [dateSingle, setDateSingle] = createSignal<string | null>(null)
  const [dateRange, setDateRange] = createSignal<
    [string | null, string | null]
  >([null, null])

  const user: KunUser = { id: 1, name: '莲', avatar: '' }

  const triggerMessages = () => {
    useKunMessage('这是一条信息提示', 'info')
    useKunMessage('操作成功', 'success')
    useKunMessage('请注意该警告', 'warn')
    useKunMessage('发生了错误', 'error')
  }

  return (
    <div class="mx-auto max-w-6xl space-y-8 p-6">
      <h1 class="text-2xl font-bold">KUN UI for Solid.js</h1>

      <Section title="Button / Icon / Badge">
        <div class="flex flex-wrap items-center gap-3">
          <KunButton onClick={triggerMessages}>触发消息</KunButton>
          <KunButton variant="flat" color="danger">
            危险
          </KunButton>
          <KunButton isIconOnly aria-label="close">
            <KunIcon name="lucide:x" />
          </KunButton>
          <KunBadge color="primary">Primary</KunBadge>
          <KunBadge variant="solid" color="success">
            Success
          </KunBadge>
          <KunBadge variant="bordered" color="warning">
            Warning
          </KunBadge>
          <KunIcon name="lucide:alarm-clock" />
          <Favicon />
          <Markdown />
        </div>
      </Section>

      <Section title="Card / Divider / Link / Brand">
        <KunCard
          isHoverable
          isPressable
          cover={<img src="/alert/琥珀.webp" alt="cover" class="h-24" />}
          header={
            <div class="flex items-center gap-2">
              <KunBrand title="琥珀" titleShort="K" />
            </div>
          }
        >
          <div class="flex gap-3">
            <KunContent>Pressable Card</KunContent>
            <KunLink to="/" color="primary">
              返回萝莉之家
            </KunLink>
            <KunLink
              to="https://www.kungal.com"
              target="_blank"
              isShowAnchorIcon
            >
              外链
            </KunLink>
          </div>
        </KunCard>
      </Section>

      <Section title="Avatar / User">
        <div class="flex items-center gap-4">
          <KunAvatar user={user} />
          <KunUserCard user={user} description="一个有巨乳的少女" />
        </div>
      </Section>

      <Section title="Inputs">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <KunInput
            label="萝莉名"
            placeholder="输入萝莉名"
            prefix={<KunIcon name="lucide:user" />}
          />
          <KunTextarea label="个人简介" placeholder="莲最可爱..." rows={3} />
          <div class="flex items-center gap-3">
            <KunCheckBox label="接受霸王条款" modelValue={checked()} />
            <KunSwitch
              label="一键高潮"
              modelValue={switchOn()}
              onChange={setSwitchOn}
            />
          </div>
          <div class="flex items-center gap-3">
            <span>滑块：{sliderVal()}</span>
            <KunSlider
              value={sliderVal()}
              onChange={setSliderVal}
              min={0}
              max={100}
            />
          </div>
          <KunSelect
            label="选择"
            modelValue={selectVal()}
            options={[
              { value: 'a', label: '萝莉' },
              { value: 'b', label: '少女' }
            ]}
            onChange={(v) => setSelectVal(v)}
          />
          <KunUpload
            accept="image/*"
            onFiles={(fs) => console.log('files', fs)}
          />
        </div>
      </Section>

      <Section title="Modal / Popover / Tooltip / Lightbox">
        <div class="flex flex-wrap items-center gap-3">
          <KunButton onClick={() => setShowModal(true)}>打开模态框</KunButton>
          <KunPopover
            position="bottom-start"
            trigger={<KunButton variant="light">打开 Popover</KunButton>}
          >
            <div class="p-3">这是 Popover 内容</div>
          </KunPopover>
          <KunTooltip text="提示信息">
            <KunButton variant="light">悬停查看 Tooltip</KunButton>
          </KunTooltip>
          <KunLightbox src="/favicon.ico" alt="logo">
            <KunImage src="/favicon.ico" alt="logo" class="h-10 w-10" />
          </KunLightbox>
        </div>
        <KunModal modalValue={showModal()} onUpdateModalValue={setShowModal}>
          <div class="space-y-2">
            <h3 class="text-lg font-semibold">模态框</h3>
            <p>这是模态框内容</p>
            <KunButton onClick={() => setShowModal(false)}>关闭</KunButton>
          </div>
        </KunModal>
      </Section>

      <Section title="Tabs / Pagination">
        <div class="flex flex-col gap-4">
          <KunTab
            items={[
              { value: 'tab1', textValue: '标签一', icon: 'lucide:home' },
              { value: 'tab2', textValue: '标签二' },
              { value: 'tab3', textValue: '标签三', disabled: true }
            ]}
            modelValue={tabVal()}
            onUpdateModelValue={setTabVal}
            color="primary"
          />
          <KunPagination
            currentPage={currentPage()}
            totalPage={10}
            onUpdateCurrentPage={setCurrentPage}
          />
        </div>
      </Section>

      <Section title="Loading / FadeCard / ScrollShadow">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <KunButton onClick={() => setLoading((v) => !v)}>
              切换 Loading
            </KunButton>

            <KunLoading loading={loading()}>
              <KunCard>被 Loading 包裹的组件</KunCard>
            </KunLoading>
          </div>

          <div class="flex items-center gap-3">
            <KunButton onClick={() => setShowFade((v) => !v)}>
              切换 FadeCard
            </KunButton>
            <KunFadeCard>
              <Show when={showFade()}>
                <KunCard>淡入淡出内容</KunCard>
              </Show>
            </KunFadeCard>
          </div>
          <KunScrollShadow axis="horizontal" class="max-w-full">
            <div class="flex flex-wrap gap-3">
              <For each={Array.from({ length: 20 }).map((_, i) => i)}>
                {(i) => <KunBadge color="secondary">萝莉 {i + 1}</KunBadge>}
              </For>
            </div>
          </KunScrollShadow>
        </div>
      </Section>

      <Section title="DatePicker / Editor">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <KunDatePicker
              label="单选日期"
              modelValue={dateSingle()}
              onUpdateModelValue={(v) => setDateSingle(v as string | null)}
              clearable
            />
            <div class="text-default-500 text-sm">
              当前值：{dateSingle() || '-'}
            </div>
          </div>
          <div class="space-y-2">
            <KunDatePicker
              label="范围日期"
              modelValue={dateRange()}
              mode="range"
              onUpdateModelValue={(v) =>
                setDateRange(v as [string | null, string | null])
              }
              clearable
            />
            <div class="text-default-500 text-sm">
              当前值：
              {(dateRange()[0] || '-') + ' ~ ' + (dateRange()[1] || '-')}
            </div>
          </div>
          <div class="col-span-full">
            <KunEditor placeholder="Textarea 编辑器占位" />
          </div>
        </div>
      </Section>

      <Section title="Others">
        <div class="flex items-center gap-3">
          <KunInfo>这是一条信息</KunInfo>
          <KunNull />
        </div>
      </Section>
    </div>
  )
}
