interface KunLanguage {
  'en-us': string
  'ja-jp': string
  'zh-cn': string
  'zh-tw': string
}

interface KunUser {
  id: number
  name: string
  avatar: string
}

interface KunPagination {
  page: string
  limit: string
}

type KunOrder = 'asc' | 'desc'
