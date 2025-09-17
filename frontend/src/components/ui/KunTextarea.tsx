import { type Component, type JSX, createSignal, splitProps, onMount } from 'solid-js'
import { cn } from '~/utils/cn'

let textareaSeed = 0
const uniqueId = (prefix: string) => `${prefix}-${++textareaSeed}`

export interface KunTextareaProps extends Omit<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onInput'> {
  placeholder?: string
  modelValue?: string
  label?: string
  name?: string
  hint?: string
  error?: string
  maxHeight?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  autofocus?: boolean
  showCharCount?: boolean
  autoGrow?: boolean
  rows?: number
  maxlength?: number
  minlength?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  darkBorder?: boolean
}

export const KunTextarea: Component<KunTextareaProps> = (allProps) => {
  const [props, others] = splitProps(allProps, [
    'placeholder',
    'modelValue',
    'label',
    'name',
    'hint',
    'error',
    'maxHeight',
    'disabled',
    'readonly',
    'required',
    'autofocus',
    'showCharCount',
    'autoGrow',
    'rows',
    'maxlength',
    'minlength',
    'resize',
    'darkBorder',
  ])

  const id = uniqueId('kun-textarea')
  const [localValue, setLocalValue] = createSignal(props.modelValue ?? '')
  let textareaRef: HTMLTextAreaElement | undefined

  const adjustHeight = () => {
    if (!textareaRef) return
    textareaRef.style.height = 'auto'
    let newHeight = `${textareaRef.scrollHeight}px`
    if (props.maxHeight && parseInt(newHeight) > parseInt(props.maxHeight)) {
      newHeight = props.maxHeight
    }
    textareaRef.style.height = newHeight
  }

  const handleInput = (e: InputEvent & { currentTarget: HTMLTextAreaElement }) => {
    setLocalValue(e.currentTarget.value)
    if (props.autoGrow) adjustHeight()
  }

  onMount(() => {
    if (props.autoGrow && textareaRef) adjustHeight()
    if (props.autofocus && textareaRef) textareaRef.focus()
  })

  return (
    <div class="w-full">
      {props.label && (
        <label for={id} class="mb-1 block text-sm font-medium">
          {props.label}
          {props.required && <span class="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <div class="relative">
        <textarea
          id={id}
          ref={textareaRef}
          value={localValue() as any}
          name={props.name}
          placeholder={props.placeholder}
          disabled={props.disabled}
          readOnly={props.readonly}
          required={props.required}
          maxlength={props.maxlength}
          minlength={props.minlength}
          rows={props.rows ?? 4}
          autofocus={props.autofocus}
          class={cn(
            'scrollbar-hide border-default/20 w-full rounded-md border p-3 shadow-sm transition duration-150 ease-in-out',
            'focus:ring-primary-500 focus:border-transparent focus:ring-2 focus:outline-none',
            props.disabled ? 'text-default-500 cursor-not-allowed' : '',
            props.darkBorder !== false && 'dark:border-default-200',
            props.resize === 'none'
              ? 'resize-none'
              : props.resize === 'vertical'
                ? 'resize-y'
                : props.resize === 'horizontal'
                  ? 'resize-x'
                  : 'resize',
          )}
          onInput={handleInput}
          {...others}
        />

        {props.maxlength && props.showCharCount && (
          <div class="text-default-500 absolute right-2 bottom-2 text-xs">
            {String(localValue()).length}/{props.maxlength}
          </div>
        )}
      </div>

      {props.error ? (
        <div class="text-danger-600 mt-1 text-sm">{props.error}</div>
      ) : (
        props.hint && <div class="text-default-500 mt-1 text-sm">{props.hint}</div>
      )}
    </div>
  )
}

export default KunTextarea
