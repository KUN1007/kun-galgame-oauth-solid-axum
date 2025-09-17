import { type Component, createSignal } from 'solid-js'
import { cn } from '~/utils/cn'

export interface KunSliderProps {
  min?: number
  max?: number
  step?: number
  value: number
  onChange?: (value: number) => void
  class?: string
}

export const KunSlider: Component<KunSliderProps> = (props) => {
  const [val, setVal] = createSignal(props.value)
  const min = props.min ?? 0
  const max = props.max ?? 100
  const step = props.step ?? 1

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    const v = Number(e.currentTarget.value)
    setVal(v)
    props.onChange?.(v)
  }

  return (
    <div class={cn('w-full', props.class)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val()}
        onInput={handleInput}
        class="w-full accent-primary"
      />
    </div>
  )
}

export default KunSlider

