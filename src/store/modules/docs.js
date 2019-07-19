import request from 'superagent'
// import jsonp from 'superagent-jsonp'
import config from '@/config'

const state = {
  temp: [],
  skip: 0,
  noMore: false,

  skipQuery: 0,
  noMoreQuery: false,
  perPage: 10,

  docs: [],
  docItem: {},
  docMeta: {},
  similarDocs: [],
  docQueryResult: []
}

const mutations = {
  loadMoreDocs (state, payload) {
    state.skip += 10
    state.docs = state.docs.concat(payload.res)
    if (payload.res.length < state.perPage) {
      state.noMore = true
    }
  },
  queryMoreDocs (state, payload) {
    state.skipQuery += 10
    state.docQueryResult = state.docQueryResult.concat(payload.res)
    if (payload.res.length < state.perPage) {
      state.noMoreQuery = true
    }
  },
  getSingleDoc (state, payload) {
    state.docItem = payload.res
  },
  getSimilarDocs (state, payload) {
    state.similarDocs = payload.res
  },
  getDocMeta (state, payload) {
    state.docMeta = payload.res
  },
  queryDoc (state, payload) {
    state.docQueryResult = payload.res
  }
}

const actions = {
  newdoc ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      request
        .post(config.api + '/doc/')
        .set('Authorization', 'Bearer ' + localStorage.getItem('token'))
        .send(payload)
        .then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  },
  updateDocRating ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      request
        .post(config.api + `/doc/${payload.id}/rating`)
        .set('Authorization', 'Bearer ' + localStorage.getItem('token'))
        .send({rating: payload.rating})
        .then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  },
  updatedoc ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      request
        .put(config.api + `/doc/${payload.id}`)
        .set('Authorization', 'Bearer ' + localStorage.getItem('token'))
        .send(payload.item)
        .then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  },
  deletedoc ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      request
        .post(config.api + `/doc/${payload.id}/delete`)
        .set('Authorization', 'Bearer ' + localStorage.getItem('token'))
        .then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  },
  /**
   * Loading more data
   * skip: 10 default
   * count: 10 default
   */
  loadMoreDocs ({commit, state}) {
    if (state.noMore) return
    request
      .get(config.api + '/doc?start=' +
        state.skip + '&count=10')
      // .use(jsonp)
      .end((err, res) => {
        if (!err) {
          commit({
            type: 'loadMoreDocs',
            res: res.body
          })
        }
      })
  },
  /**
   * Getting single event
   * id: event id
   */
  getSingleDoc ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      request
        .get(config.api + '/doc/' + payload.id)
        // .use(jsonp)
        .end((err, res) => {
          if (!err) {
            commit({
              type: 'getSingleDoc',
              res: res.body
            })
            resolve(res)
          }
        })
    })
  },
  getSimilarDocs ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      request
        .get(config.api + `/doc/${payload.id}/more`)
        .end((err, res) => {
          if (!err) {
            commit({
              type: 'getSimilarDocs',
              res: res.body
            })
            resolve(res)
          }
        })
    })
  },
  getDocMeta ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      request
        .get(config.api + `/doc/${payload.uuid}/meta`)
        .end((err, res) => {
          if (!err) {
            commit({
              type: 'getDocMeta',
              res: res.body
            })
            resolve(res)
          }
        })
    })
  },
  /**
   * Query doc
   * @param  {[type]} options.commit [description]
   * @param  {[type]} options.state  [description]
   * @param  {[type]} payload        [{queryStr}]
   * @return {Promise}                [description]
   */
  queryDoc ({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      request
        .get(config.api + `/doc/search?q=${payload.queryStr}`)
        .end((err, res) => {
          if (!err) {
            commit({
              type: 'queryDoc',
              res: res.body
            })
            resolve(res)
          }
        })
    })
  },
  /**
   * Query more docs
   * skip: 10 default
   * count: 10 default
   */
  queryMoreDocs ({commit, state}) {
    if (state.noMoreQuery) return
    request
      .get(config.api + '/doc?start=' +
        state.skipQuery + '&count=10')
      // .use(jsonp)
      .end((err, res) => {
        if (!err) {
          commit({
            type: 'queryMoreDocs',
            res: res.body
          })
        }
      })
  }
}

export default {
  state,
  mutations,
  actions
}
