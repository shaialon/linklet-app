import cookie from 'react-cookie'
import fetch from 'isomorphic-unfetch'
import { checkStatus } from '../utils'
import _get from 'lodash/get'
import striptags from 'striptags'

let baseUrl

if (!process.browser) {
  baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'https://linklet.ml/api'
      : 'https://linklet.ml/api'
} else {
  baseUrl = 'https://linklet.ml/api'
}

function tvMapper (item) {
  const show = item.show || item
  return {
    _id: show.id,
    url: show.url,
    description: show.summary ? striptags(show.summary) : null,
    image: _get(show, 'image.medium') || _get(show, 'image.medium'),
    title: show.name,
    timestamp: new Date(show.premiered).getTime(),
    _creator: {
      _id: _get(show, 'network.name') || 'Indie',
      username: _get(show, 'network.name') || 'Indie',
      avatarUrl: 'https://avatars1.githubusercontent.com/u/17708702?v=3',
      email: 'ahmedzubair216@gmail.com',
      name: _get(show, 'network.name') || 'Indie'
    },
    __v: 1,
    bookmarksCount: show.score,
    bookmarkedBy: ['58f25d9b8a7e9800ebc79985', '58f25d9b8a7e9800ebc79985'],
    rating: _get(show, 'rating.average', 0),
    views: show.weight || 0
  }
}

function tvResults (res) {
  // console.dir(res, {colors: true, depth: null});
  const items = res.filter(item => item.show || item.id)
  return {
    data: {
      linksCount: items.length,
      page: 1,
      perPage: 250,
      totalLinks: 1800,
      isLastPage: false,
      links: items.map(tvMapper)
    }
  }
}

const getAll = async function (
  { page = 0, search, myLinks, req, bookmarks, sort } = {}
) {
  // return FIXED;
  const url = search
    ? `http://api.tvmaze.com/search/shows?q=${encodeURIComponent(search)}`
    : `http://api.tvmaze.com/shows?page=${page}`
  // `http://api.tvmaze.com/search/shows?q=${'a'}`;
  return fetch(url, {
    headers: {
      // 'x-auth': loginToken || ''
    }
  })
    .then(checkStatus)
    .then(r => r.json())
    .then(tvResults)
}

// const getAll = ({ page = 1, search, myLinks, req, bookmarks, sort } = {}) => {
//   let loginToken = cookie.load('loginToken')
//   if (!loginToken) {
//     loginToken = req && req.cookies && req.cookies.loginToken
//   }
//   console.log('loginToken', loginToken)
//   console.log('myLinks', myLinks)
//   let url
//   if (myLinks) {
//     url = search
//       ? `${baseUrl}/links/me/all/?page=${page}&search=${search}&sort=${sort}`
//       : `${baseUrl}/links/me/all/?page=${page}&sort=${sort}`
//   } else if (bookmarks) {
//     url = search
//       ? `${baseUrl}/bookmarks/me/all/?page=${page}&search=${search}&sort=${sort}`
//       : `${baseUrl}/bookmarks/me/all/?page=${page}&sort=${sort}`
//   } else {
//     url = search
//       ? `${baseUrl}/links/all/?page=${page}&search=${search}&sort=${sort}`
//       : `${baseUrl}/links/all/?page=${page}&sort=${sort}`
//   }
//   console.log(url)
//   return fetch(url, {
//     headers: {
//       'x-auth': loginToken || ''
//     }
//   })
//     .then(checkStatus)
//     .then(r => r.json())
//     .then(res => ({ data: res }))
// }

const getByFilter = (
  { start, end, page = 1, search, myLinks, req, bookmarks, sort } = {}
) => {
  let loginToken = cookie.load('loginToken')
  if (!loginToken) {
    loginToken = req && req.cookies && req.cookies.loginToken
  }
  let url
  if (myLinks) {
    url =
      start && end && search
        ? `${baseUrl}/links/me/filter/?page=${page}&start=${start}&end=${end}&search=${search}&sort=${sort}`
        : start && end
          ? `${baseUrl}/links/me/filter/?page=${page}&start=${start}&end=${end}&sort=${sort}`
          : `${baseUrl}/links/me/filter/?page=${page}&sort=${sort}`
  } else if (bookmarks) {
    url =
      start && end && search
        ? `${baseUrl}/bookmarks/me/filter/?page=${page}&start=${start}&end=${end}&search=${search}&sort=${sort}`
        : start && end
          ? `${baseUrl}/bookmarks/me/filter/?page=${page}&start=${start}&end=${end}&sort=${sort}`
          : `${baseUrl}/bookmarks/me/filter/?page=${page}&sort=${sort}`
  } else {
    url =
      start && end && search
        ? `${baseUrl}/links/filter/?page=${page}&start=${start}&end=${end}&search=${search}&sort=${sort}`
        : start && end
          ? `${baseUrl}/links/filter/?page=${page}&start=${start}&end=${end}&sort=${sort}`
          : `${baseUrl}/links/filter/?page=${page}&sort=${sort}`
  }

  return fetch(url, {
    headers: {
      'x-auth': loginToken || ''
    }
  })
    .then(checkStatus)
    .then(r => r.json())
    .then(res => ({ data: res }))
}

const getMetaData = link => {
  const url = `${baseUrl}/metadata?url=${link}`
  return fetch(url)
    .then(checkStatus)
    .then(r => r.json())
    .then(res => ({ data: res }))
}

const saveLink = data => {
  const loginToken = cookie.load('loginToken')
  const url = `${baseUrl}/links`
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'x-auth': loginToken || '',
      'Content-Type': 'application/json'
    }
  })
    .then(checkStatus)
    .then(r => r.json())
    .then(res => ({ data: res }))
}

const incrementView = id => {
  const loginToken = cookie.load('loginToken')
  console.log(loginToken)
  const url = `${baseUrl}/links/${id}/views`
  return fetch(url, {
    method: 'PATCH',
    body: JSON.stringify({}),
    headers: {
      'x-auth': loginToken || '',
      'Content-Type': 'application/json'
    }
  })
    .then(checkStatus)
    .then(r => r.json())
    .then(res => ({ data: res }))
}

const likeLink = id => {
  const loginToken = cookie.load('loginToken')
  console.log(loginToken)
  const url = `${baseUrl}/links/${id}/bookmark`
  return fetch(url, {
    method: 'PATCH',
    body: JSON.stringify({}),
    headers: {
      'x-auth': loginToken || '',
      'Content-Type': 'application/json'
    }
  })
    .then(checkStatus)
    .then(r => r.json())
    .then(res => ({ data: res }))
}

export default {
  getAll,
  getByFilter,
  getMetaData,
  saveLink,
  baseUrl,
  incrementView,
  likeLink
}
