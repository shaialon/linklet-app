const routes = (module.exports = require('next-routes')())

routes
  .add('/', 'index')
  .add('about')
  .add('show', '/show/:itemId', 'show')
/* .add('user', '/user/:id', 'profile')
  .add('/:noname/:lang(en|es)/:wow+', 'complex')
  .add({name: 'beta', pattern: '/v3', page: 'v3'}) */
