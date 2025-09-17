import { type Component, createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import { KunButton } from './KunButton'
import { KunIcon } from './KunIcon'
import { cn } from '~/utils/cn'

export interface KunPaginationProps {
  currentPage: number
  totalPage: number
  isLoading?: boolean
  onUpdateCurrentPage?: (page: number) => void
}

export const KunPagination: Component<KunPaginationProps> = (props) => {
  const displayedPages = createMemo(() => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 7
    if (props.totalPage <= maxVisiblePages) return Array.from({ length: props.totalPage }, (_, i) => i + 1)
    pages.push(1)
    if (props.currentPage > 3) pages.push('...')
    let start = Math.max(2, props.currentPage - 1)
    let end = Math.min(props.totalPage - 1, props.currentPage + 1)
    if (props.currentPage <= 3) end = Math.min(props.totalPage - 1, 4)
    if (props.currentPage >= props.totalPage - 2) start = Math.max(2, props.totalPage - 3)
    for (let i = start; i <= end; i++) pages.push(i)
    if (props.currentPage < props.totalPage - 2) pages.push('...')
    pages.push(props.totalPage)
    return pages
  })

  const [jumpToPage, setJumpToPage] = createSignal('')
  const id = `kun-pagination-${Math.random().toString(36).slice(2, 8)}`

  const handlePageChange = (page: number) => {
    if (props.isLoading || page === props.currentPage) return
    props.onUpdateCurrentPage?.(page)
  }

  const handleJumpToPage = () => {
    if (props.isLoading) return
    const page = parseInt(jumpToPage())
    if (page && page >= 1 && page <= props.totalPage) {
      props.onUpdateCurrentPage?.(page)
      setJumpToPage('')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && props.currentPage > 1) handlePageChange(props.currentPage - 1)
    if (e.key === 'ArrowRight' && props.currentPage < props.totalPage) handlePageChange(props.currentPage + 1)
  }
  onMount(() => window.addEventListener('keydown', onKey))
  onCleanup(() => window.removeEventListener('keydown', onKey))

  return (
    <div class="flex w-full flex-wrap items-center justify-between gap-4">
      <div class="mx-auto flex flex-wrap items-center gap-2">
        <div class="mx-auto flex items-center gap-2">
          <KunButton
            isIconOnly
            variant="light"
            disabled={props.isLoading || props.currentPage === 1}
            onClick={() => handlePageChange(props.currentPage - 1)}
            class={cn(props.isLoading || props.currentPage === 1 ? 'cursor-not-allowed opacity-50' : '')}
          >
            <KunIcon name="lucide:chevron-left" />
          </KunButton>
          <div class="flex items-center gap-1">
            {displayedPages().map((page) =>
              page === '...'
                ? (
                    <span class="px-2">...</span>
                  )
                : (
                    <KunButton
                      variant={props.currentPage === page ? 'solid' : 'light'}
                      size="sm"
                      onClick={() => handlePageChange(Number(page))}
                      disabled={props.isLoading}
                    >
                      {String(page)}
                    </KunButton>
                  ),
            )}
          </div>
          <KunButton
            isIconOnly
            variant="light"
            disabled={props.isLoading || props.currentPage === props.totalPage}
            onClick={() => handlePageChange(props.currentPage + 1)}
            class={cn(props.isLoading || props.currentPage === props.totalPage ? 'cursor-not-allowed opacity-50' : '')}
          >
            <KunIcon name="lucide:chevron-right" />
          </KunButton>
        </div>
        <div class="text-default-500 mx-auto hidden items-center gap-2 text-sm sm:flex">
          使用 <KunIcon name="lucide:arrow-left" /> <KunIcon name="lucide:arrow-right" /> 键快速翻页
        </div>
      </div>
      <div class="mx-auto flex items-center gap-2">
        <label for={id} class="text-sm">跳转至</label>
        <input
          id={id}
          type="number"
          value={jumpToPage()}
          onInput={(e) => setJumpToPage((e.target as HTMLInputElement).value)}
          disabled={props.isLoading}
          onKeyUp={(e) => e.key === 'Enter' && handleJumpToPage()}
          min={1}
          max={props.totalPage}
          class={cn(
            'focus:ring-primary border-default-300 w-24 rounded-md border px-2 py-1 text-sm focus:ring-1 focus:outline-none',
            props.isLoading && 'cursor-not-allowed opacity-50',
          )}
        />
        <KunButton size="sm" onClick={handleJumpToPage} disabled={props.isLoading}>
          前往
        </KunButton>
      </div>
    </div>
  )
}

export default KunPagination
