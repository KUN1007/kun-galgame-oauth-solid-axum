import { type Component, splitProps } from 'solid-js'
import type { KunUIColor } from './type'
import { cn } from '~/utils/cn'
import { KunIcon } from './KunIcon'

export interface KunCheckBoxProps {
  modelValue?: boolean
  color?: KunUIColor
  type?: 'single' | 'multiple'
  label?: string
  id?: string
  name?: string
  value?: string | number | boolean
  disabled?: boolean
  class?: string
}

const colorClasses: Record<KunUIColor, string> = {
  default:
    'border-default-300 checked:bg-default checked:border-default hover:border-default',
  primary:
    'border-primary-300 checked:bg-primary checked:border-primary hover:border-primary',
  secondary:
    'border-secondary-300 checked:bg-secondary checked:border-secondary hover:border-secondary',
  success:
    'border-success-300 checked:bg-success checked:border-success hover:border-success',
  warning:
    'border-warning-300 checked:bg-warning checked:border-warning hover:border-warning',
  danger:
    'border-danger-300 checked:bg-danger checked:border-danger hover:border-danger'
}

export const KunCheckBox: Component<KunCheckBoxProps> = (allProps) => {
  const [props] = splitProps(allProps, [
    'modelValue',
    'color',
    'type',
    'label',
    'id',
    'name',
    'value',
    'disabled',
    'class'
  ])

  return (
    <div class={cn('flex cursor-pointer items-center', props.class)}>
      <div class="relative flex items-center">
        <input
          type="checkbox"
          id={props.id}
          name={props.name}
          value={props.value as unknown as string}
          checked={!!props.modelValue}
          disabled={props.disabled}
          class={cn(
            'peer h-5 w-5 appearance-none border-2 text-white transition-all disabled:cursor-not-allowed disabled:opacity-50',
            props.type === 'single' ? 'rounded-full' : 'rounded',
            colorClasses[props.color ?? 'default']
          )}
        />
        <div class="pointer-events-none absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100">
          <KunIcon name="lucide:check" />
        </div>
      </div>
      {props.label && (
        <label
          for={props.id}
          class={cn(
            'text-default-700 ml-2 cursor-pointer text-sm select-none',
            props.disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          {props.label}
        </label>
      )}
    </div>
  )
}
