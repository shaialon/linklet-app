const UrlPrettifier = require('next-url-prettifier').default

const routes = [
  // {
  // page: 'index',
  // prettyUrl: '/'
  // },
  {
    page: 'item',
    prettyUrl: ({ lang = '', itemId = '' }) =>
      lang === 'fr' ? `/iteme/${itemId}` : `/item/${itemId}`,
    prettyUrlPatterns: [
      { pattern: '/item/:itemId', defaultParams: { lang: 'en' } },
      { pattern: '/iteme/:itemId', defaultParams: { lang: 'fr' } }
    ]
  }
]

const urlPrettifier = new UrlPrettifier(routes)
exports.default = routes
exports.Router = urlPrettifier
