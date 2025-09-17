import type { KunSiteConfig } from './config'

const KUN_SITE_NAME = '鲲 Galgame OAuth 系统'
const KUN_SITE_SHORT = '鲲 Galgame OAuth'
const KUN_SITE_MENTION = '@kungalgame_auth'
const KUN_SITE_TITLE =
  '鲲 Galgame OAuth 系统 - 最快速、最先进的企业级 OAuth 系统'
const KUN_SITE_DESCRIPTION =
  '为 鲲 Galgame / Kun Visual Novel 及其所有网站集群定制化开发的企业级、高可用性、最快速、最先进的 OAuth 系统, 为鲲 Galgame 的所有子网站提供可靠的账户体系认证服务'
const KUN_SITE_URL = 'https://www.kungal.com'
const KUN_SITE_URL_BACKUP = 'https://www.kungal.org'
const KUN_SITE_OAUTH = 'https://oauth.kungal.com'
const KUN_SITE_NAV = 'https://nav.kungal.org'
const KUN_SITE_PATCH = 'https://www.moyu.moe'
const KUN_SITE_STICKER = 'https://sticker.kungal.com'
const KUN_SITE_DEVELOPMENT_DOCUMENTATION =
  'https://soft.moe/kun-visualnovel-docs/kun-forum.html'
const KUN_SITE_TELEGRAM_GROUP = 'https://t.me/kungalgame'
const KUN_SITE_GITHUB = 'https://github.com/KUN1007/kun-galgame-nuxt3'
const KUN_SITE_AUTHOR_GITHUB = 'https://github.com/KUN1007'
const KUN_SITE_LIST = [
  { name: '鲲 Galgame 导航', url: KUN_SITE_NAV },
  { name: '鲲 Galgame 补丁', url: KUN_SITE_PATCH },
  { name: '鲲 Galgame OAuth 系统', url: KUN_SITE_OAUTH },
  { name: '鲲 Galgame 表情包', url: KUN_SITE_STICKER },
  { name: '鲲 Galgame 论坛 (备用)', url: KUN_SITE_URL_BACKUP },
  { name: '鲲 Galgame 开发文档', url: KUN_SITE_DEVELOPMENT_DOCUMENTATION }
]
const KUN_SITE_THEME_COLOR = '#006FEE'
const KUN_SITE_VALID_DOMAIN_LIST = ['www.kungal.com', 'www.kungal.org']

const KUN_SITE_KEYWORDS = ['Galgame', 'OAuth', 'Solid.js', 'Axum-web']

export const kunOauth: KunSiteConfig = {
  name: KUN_SITE_NAME,
  title: KUN_SITE_TITLE,
  titleShort: KUN_SITE_SHORT,
  titleTemplate: `%s - ${KUN_SITE_TITLE}`,
  description: KUN_SITE_DESCRIPTION,
  keywords: KUN_SITE_KEYWORDS,
  canonical: KUN_SITE_URL,
  themeColor: KUN_SITE_THEME_COLOR,
  github: KUN_SITE_GITHUB,
  authorGitHub: KUN_SITE_AUTHOR_GITHUB,
  validDomain: KUN_SITE_VALID_DOMAIN_LIST,
  author: [
    { name: KUN_SITE_TITLE, url: KUN_SITE_URL },
    { name: 'GitHub', url: KUN_SITE_GITHUB },
    ...KUN_SITE_LIST
  ],
  creator: {
    name: KUN_SITE_SHORT,
    mention: KUN_SITE_MENTION,
    url: KUN_SITE_URL
  },
  publisher: {
    name: KUN_SITE_SHORT,
    mention: KUN_SITE_MENTION,
    url: KUN_SITE_URL
  },
  domain: {
    main: KUN_SITE_URL,
    imageBed: 'https://img.kungal.com',
    storage: 'https://oss.kungal.com',
    telegram_group: KUN_SITE_TELEGRAM_GROUP,
    patch: KUN_SITE_PATCH,
    backup: KUN_SITE_URL_BACKUP,
    oauth: KUN_SITE_OAUTH,
    sticker: KUN_SITE_STICKER,
    nav: KUN_SITE_NAV,
    doc: KUN_SITE_DEVELOPMENT_DOCUMENTATION
  },
  og: {
    title: KUN_SITE_TITLE,
    description: KUN_SITE_DESCRIPTION,
    image: '/kungalgame.webp',
    url: KUN_SITE_URL
  },
  images: [
    {
      url: '/kungalgame.webp',
      fullUrl: `${KUN_SITE_URL}/kungalgame.webp`,
      width: 1000,
      height: 800,
      alt: KUN_SITE_TITLE
    }
  ]
}
