import request from 'superagent'
// import jsonp from 'superagent-jsonp'

const state = {
  queryRes_movie: [],
  queryRes_book: [],
  queryRes_music: [],
  queryRes_doc: []
}

const mutations = {
  query (state, payload) {
    switch (payload.tag) {
      case 'doc':
        state.queryRes_doc = payload.res
        break
      case 'movie':
        state.queryRes_movie = payload.res
        break
      case 'book':
        state.queryRes_book = payload.res
        break
      case 'music':
        state.queryRes_music = payload.res
        break
      default:
        console.log('[Error]:Api error!')
    }
  }
}

const actions = {
  /**
   * Search
   * queryStr: String
   * count: 3 default
   */
  query ({ commit }, payload) {
    request
      .get('http://localhost:3000/doc/search?q=' +
        payload.queryStr + '&count=3')
      // .use(jsonp)
      .end((err, res) => {
        if (!err) {
          commit({
            type: 'query',
            tag: 'doc',
            res: res.body
          })
        }
      })

    /**
     * API rate limit exceeded
     * Learn more: https://developers.douban.com/wiki/?title=api_v2
     */

    // Getting book
    // request
    //   .get('https://api.douban.com/v2/book/search?q=' +
    //     payload.queryStr + '&count=3')
    //   .use(jsonp)
    //   .end((err, res) => {
    //     if (!err) {
    //       commit({
    //         type: 'query',
    //         tag: 'book',
    //         res: res.body
    //       })
    //     }
    //   })

    // Getting music
    // request
    //   .get('https://api.douban.com/v2/music/search?q=' +
    //     payload.queryStr + '&count=3')
    //   .use(jsonp)
    //   .end((err, res) => {
    //     if (!err) {
    //       commit({
    //         type: 'query',
    //         tag: 'music',
    //         res: res.body.musics
    //       })
    //     }
    //   })
  }
}

export default {
  state,
  mutations,
  actions
}
