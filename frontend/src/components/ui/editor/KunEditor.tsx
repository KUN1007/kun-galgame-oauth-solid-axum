import { type Component, createSignal } from 'solid-js'

export interface KunEditorProps {
  modelValue?: string
  placeholder?: string
  onUpdateModelValue?: (value: string) => void
  class?: string
}

export const KunEditor: Component<KunEditorProps> = (props) => {
  const [val, setVal] = createSignal(props.modelValue ?? '')
  return (
    <textarea
      value={val()}
      placeholder={props.placeholder}
      class={props.class}
      onInput={(e) => {
        const v = (e.target as HTMLTextAreaElement).value
        setVal(v)
        props.onUpdateModelValue?.(v)
      }}
      rows={10}
    />
  )
}

export default KunEditor

