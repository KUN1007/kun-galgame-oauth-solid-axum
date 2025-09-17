import { type Component, type JSX, splitProps } from 'solid-js'
import { cn } from '~/utils/cn'

export interface KunSelectOption {
  value: string | number
  label: string
}

export interface KunSelectProps
  extends Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  modelValue?: string | number
  options: KunSelectOption[]
  placeholder?: string
  label?: string
  disabled?: boolean
  error?: string
  darkBorder?: boolean
  ariaLabel?: string
  onChange?: (value: string | number, index: number) => void
}

let selectSeed = 0
const uniqueId = (prefix: string) => `${prefix}-${++selectSeed}`

export const KunSelect: Component<KunSelectProps> = (allProps) => {
  const [props, others] = splitProps(allProps, [
    'modelValue',
    'options',
    'placeholder',
    'label',
    'disabled',
    'error',
    'darkBorder',
    'ariaLabel',
    'onChange'
  ])

  const id = uniqueId('kun-select')

  const handleChange = (e: Event & { currentTarget: HTMLSelectElement }) => {
    const idx = e.currentTarget.selectedIndex
    const opt = props.options[idx]
    const val = opt?.value ?? ''
    props.onChange?.(val, idx)
  }

  return (
    <div class="relative w-full">
      {props.label && (
        <label for={id} class="mb-2 block text-sm font-medium">
          {props.label}
        </label>
      )}
      <select
        id={id}
        aria-label={props.ariaLabel || 'select'}
        class={cn(
          'focus:border-primary-500 focus:ring-primary-500 w-full cursor-pointer rounded-lg border px-3 py-2 text-left shadow focus:ring-1 focus:outline-none sm:text-sm',
          props.darkBorder !== false &&
            'dark:border-default-200 border border-transparent',
          props.disabled && 'bg-default-100 cursor-not-allowed'
        )}
        disabled={props.disabled}
        value={props.modelValue as any}
        onChange={handleChange}
        {...others}
      >
        {props.placeholder && (
          <option value="" disabled selected={props.modelValue == null}>
            {props.placeholder}
          </option>
        )}
        {props.options.map((opt) => (
          <option value={opt.value as any}>{opt.label}</option>
        ))}
      </select>
      {props.error && <p class="text-danger mt-2 text-sm">{props.error}</p>}
    </div>
  )
}

export default KunSelect
