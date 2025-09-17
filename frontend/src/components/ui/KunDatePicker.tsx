import { type Component, Show, createSignal, splitProps } from 'solid-js'
import type { KunDatePickerMode, KunDatePickerProps } from './date-picker/types'
import { cn } from '~/utils/cn'
import { KunButton } from './KunButton'
import { KunIcon } from './KunIcon'

export const KunDatePicker: Component<KunDatePickerProps & {
  onUpdateModelValue?: (value: string | null | [string | null, string | null]) => void
}> = (allProps) => {
  const [props, others] = splitProps(allProps, [
    'modelValue',
    'mode',
    'label',
    'placeholder',
    'error',
    'disabled',
    'darkBorder',
    'clearable',
    'onUpdateModelValue',
  ])

  const mode: KunDatePickerMode = props.mode ?? 'single'
  const [value, setValue] = createSignal<string | null | [string | null, string | null]>(
    props.modelValue ?? (mode === 'single' ? null : ([null, null] as [string | null, string | null]))
  )

  const clear = () => {
    const v: string | null | [string | null, string | null] =
      mode === 'single' ? null : ([null, null] as [string | null, string | null])
    setValue(v)
    props.onUpdateModelValue?.(v)
  }

  const displayValue = () => {
    if (mode === 'single') return (value() as string | null) || ''
    const [a, b] = value() as [string | null, string | null]
    return [a, b].filter(Boolean).join(' ~ ')
  }

  return (
    <div class="relative w-full" {...others}>
      {props.label && <label class="mb-2 block text-sm font-medium">{props.label}</label>}
      <div class="relative">
        <button
          type="button"
          disabled={props.disabled}
          class={cn(
            'flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left shadow focus:ring-1 focus:outline-none sm:text-sm',
            'focus:border-primary-500 focus:ring-primary-500',
            props.darkBorder !== false && 'dark:border-default-200 border border-transparent',
            props.disabled && 'bg-default-100 cursor-not-allowed',
          )}
        >
          <span class={cn('block truncate', !displayValue() && 'text-default-400')}>
            {displayValue() || props.placeholder}
          </span>
          <div class="flex items-center">
            <Show when={props.clearable && displayValue()}>
              <KunButton
                onClick={(e) => {
                  e.stopPropagation()
                  clear()
                }}
                variant="light"
                isIconOnly
                size="sm"
                aria-label="Clear date"
              >
                <KunIcon name="lucide:x" class="h-4 w-4" />
              </KunButton>
            </Show>
            <KunIcon name="lucide:calendar" class="text-default-500" />
          </div>
        </button>
      </div>

      <div class="mt-2 flex gap-2">
        <Show when={mode === 'single'} fallback={
          <>
            <input
              type="date"
              class="border-default/20 rounded-md border px-2 py-1 text-sm dark:border-default-200"
              value={(value() as [string | null, string | null])[0] ?? ''}
              onInput={(e) => {
                const v: [string | null, string | null] = [
                  (e.target as HTMLInputElement).value || null,
                  (value() as [string | null, string | null])[1],
                ]
                setValue(v)
                props.onUpdateModelValue?.(v)
              }}
            />
            <input
              type="date"
              class="border-default/20 rounded-md border px-2 py-1 text-sm dark:border-default-200"
              value={(value() as [string | null, string | null])[1] ?? ''}
              onInput={(e) => {
                const v: [string | null, string | null] = [
                  (value() as [string | null, string | null])[0],
                  (e.target as HTMLInputElement).value || null,
                ]
                setValue(v)
                props.onUpdateModelValue?.(v)
              }}
            />
          </>
        }>
          <input
            type="date"
            class="border-default/20 rounded-md border px-2 py-1 text-sm dark:border-default-200"
            value={(value() as string | null) ?? ''}
            onInput={(e) => {
              const v = (e.target as HTMLInputElement).value || null
              setValue(v as any)
              props.onUpdateModelValue?.(v)
            }}
          />
        </Show>
      </div>

      {props.error && <p class="text-danger mt-2 text-sm">{props.error}</p>}
    </div>
  )
}

export default KunDatePicker

