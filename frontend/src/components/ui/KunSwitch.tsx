import { type Component } from 'solid-js'
import { cn } from '~/utils/cn'

export interface KunSwitchProps {
  modelValue: boolean
  label?: string
  disabled?: boolean
  class?: string
  labelClass?: string
  onChange?: (value: boolean) => void
}

export const KunSwitch: Component<KunSwitchProps> = (props) => {
  const id = `kun-switch-${Math.random().toString(36).slice(2, 8)}`

  return (
    <label
      class={cn(
        'inline-flex cursor-pointer items-center',
        props.disabled ? 'cursor-not-allowed' : '',
        props.class
      )}
    >
      <input
        id={id}
        type="checkbox"
        class="peer sr-only"
        checked={props.modelValue}
        onChange={(e) =>
          props.onChange?.((e.target as HTMLInputElement).checked)
        }
        disabled={props.disabled}
      />
      <div class="relative">
        <div
          class={cn(
            'h-6 w-11 rounded-full transition-colors duration-200 ease-in-out',
            props.modelValue ? 'bg-primary-500' : 'bg-default-500',
            props.disabled ? 'opacity-50' : '',
            props.modelValue && props.disabled ? 'bg-primary-300' : ''
          )}
        />
        <div
          class={cn(
            'absolute top-0.5 left-0.5 h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out',
            props.modelValue ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </div>
      {props.label && (
        <span
          class={cn(
            'ml-3 text-sm font-medium',
            props.disabled ? 'text-default-400' : '',
            props.labelClass
          )}
        >
          {props.label}
        </span>
      )}
    </label>
  )
}

export default KunSwitch
