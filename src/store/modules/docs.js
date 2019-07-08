import request from 'superagent'
// import jsonp from 'superagent-jsonp'

const state = {
  docs: [],
  temp: [],
  skip: 0,
  noMore: false,
  perPage: 10,
  docItem: {}
}

const mutations = {
  loadMoreDocs (state, payload) {
    state.skip += 3
    state.docs = state.docs.concat(payload.res)
    if (payload.res.length < state.perPage) {
      state.noMore = true
    }
  },
  getSingleDoc (state, payload) {
    state.docItem = payload.res
  }
}

const actions = {
  newdoc ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      request
        .post('http://localhost:3000/doc/')
        .set('Authorization', 'Bearer ' + localStorage.getItem('token'))
        .send(payload)
        .then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  },
  /**
   * Loading more data
   * skip: 3 default
   * count: 3 default
   */
  loadMoreDocs ({commit, state}) {
    if (state.noMore) return
    request
      .get('http://localhost:3000/doc?start=' +
        state.skip + '&count=3')
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
        .get('http://localhost:3000/doc/' + payload.id)
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
  }
}

export default {
  state,
  mutations,
  actions
}
