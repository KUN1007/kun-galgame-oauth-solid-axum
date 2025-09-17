import { type Component, type JSX, splitProps } from 'solid-js'
import { cn } from '~/utils/cn'
import { resizeImage, checkImageValid } from './upload/handleFileChange'

export interface KunUploadProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  accept?: string
  multiple?: boolean
  class?: string
  compressImage?: boolean
  maxWidth?: number
  maxHeight?: number
  onFiles?: (files: File[] | Blob[]) => void
}

export const KunUpload: Component<KunUploadProps> = (allProps) => {
  const [props, others] = splitProps(allProps, [
    'accept',
    'multiple',
    'class',
    'compressImage',
    'maxWidth',
    'maxHeight',
    'onFiles',
  ])

  const handleChange = async (e: Event & { currentTarget: HTMLInputElement }) => {
    const files = Array.from(e.currentTarget.files || [])
    if (!files.length) return
    if (props.compressImage) {
      const blobs: Blob[] = []
      for (const file of files) {
        if (checkImageValid(file)) {
          const blob = await resizeImage(file, props.maxWidth ?? 2000, props.maxHeight ?? 2000)
          blobs.push(blob)
        }
      }
      props.onFiles?.(blobs)
    } else {
      props.onFiles?.(files)
    }
  }

  return (
    <input
      type="file"
      accept={props.accept}
      multiple={props.multiple}
      class={cn('block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-default-200 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-foreground hover:file:bg-default-300', props.class)}
      onChange={handleChange}
      {...others}
    />
  )
}

export default KunUpload
