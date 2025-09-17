import { type Component, type JSX, createSignal, createMemo, splitProps, onMount } from 'solid-js'
import type { KunUIColor, KunUISize } from './type'
import { cn } from '~/utils/cn'

let inputSeed = 0
const uniqueId = (prefix: string) => `${prefix}-${++inputSeed}`

export interface KunInputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'> {
  modelValue?: string | number
  label?: string
  type?: string
  color?: KunUIColor
  class?: string
  placeholder?: string
  helperText?: string
  error?: string
  size?: KunUISize
  required?: boolean
  disabled?: boolean
  darkBorder?: boolean
  autofocus?: boolean
  prefix?: any
  suffix?: any
}

export const KunInput: Component<KunInputProps> = (allProps) => {
  const [props, others] = splitProps(allProps, [
    'modelValue',
    'label',
    'type',
    'color',
    'class',
    'placeholder',
    'helperText',
    'error',
    'size',
    'required',
    'disabled',
    'darkBorder',
    'autofocus',
    'prefix',
    'suffix',
  ])

  const id = uniqueId('kun-input')
  const [value, setValue] = createSignal(props.modelValue ?? '')

  const colorClass: Record<KunUIColor, string> = {
    default: 'focus:ring-default',
    primary: 'focus:ring-primary',
    secondary: 'focus:ring-secondary',
    success: 'focus:ring-success',
    warning: 'focus:ring-warning',
    danger: 'focus:ring-danger',
  }

  const sizeClasses = createMemo(() => {
    switch (props.size) {
      case 'xs':
        return 'text-xs px-2 py-1'
      case 'sm':
        return 'text-sm px-3 py-1.5'
      case 'md':
        return 'text-sm px-4 py-2'
      case 'lg':
        return 'text-base px-5 py-2.5'
      case 'xl':
        return 'text-lg px-6 py-3'
      default:
        return 'text-sm px-4 py-2'
    }
  })

  let inputRef: HTMLInputElement | undefined

  const handleInput = (event: InputEvent & { currentTarget: HTMLInputElement }) => {
    setValue(event.currentTarget.value)
  }

  onMount(() => {
    if (props.autofocus && inputRef) inputRef.focus()
  })

  return (
    <div class="w-full">
      {props.label && (
        <label for={id} class="text-default-700 mb-1 block text-sm font-medium">
          {props.label}
          {props.required && <span class="text-red-500">*</span>}
        </label>
      )}
      <div class="relative">
        <input
          id={id}
          ref={inputRef}
          value={value() as any}
          type={props.type ?? 'text'}
          placeholder={props.placeholder}
          disabled={props.disabled}
          required={props.required}
          class={cn(
            'border-default/20 block w-full rounded-md border px-2 py-1 text-sm shadow-sm transition duration-150 ease-in-out focus:border-transparent focus:ring-2',
            colorClass[props.color ?? 'default'],
            sizeClasses(),
            props.darkBorder !== false && 'dark:border-default-200',
            !!props.prefix && 'pl-10',
            !!props.suffix && 'pr-10',
            props.disabled && 'bg-default-100 cursor-not-allowed',
            props.error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '',
            props.class,
          )}
          onInput={handleInput}
          {...others}
        />
        {props.prefix && (
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {props.prefix}
          </div>
        )}
        {props.suffix && (
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">{props.suffix}</div>
        )}
      </div>
      {props.helperText && !props.error && (
        <p class="text-default-500 mt-1 text-sm">{props.helperText}</p>
      )}
      {props.error && <p class="mt-1 text-sm text-red-600">{props.error}</p>}
    </div>
  )
}

export default KunInput
