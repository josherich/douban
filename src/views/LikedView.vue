<template>
  <div class="like-view has-header">
    <button
      class="submit button liked"
      disabled="true">
      <i data-feather="heart"></i>
    </button>

    <d-list mold="thumbnail" :items="docs"></d-list>
    <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading">
      <loading slot="spinner"></loading>
      <div slot="no-more">No more liked.</div>
    </infinite-loading>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import InfiniteLoading from 'vue-infinite-loading'
import SubNav from '../components/SubNav'
import List from '../components/List'
import DList from '../components/DList'
import Loading from '../components/Loading'

export default {
  name: 'like-view',
  components: { SubNav, List, DList, InfiniteLoading, Loading },
  data () {
    return {
      name: ''
    }
  },
  computed: {
    // Getting Vuex State from store/modules/activities
    ...mapState({
      docs: state => state.docs.docLikedResult.map(e => e.doc),
      noMore: state => state.docs.noMoreQuery
    })
  },
  watch: {
    '$route' (to, from) {
      this.$store.dispatch({
        type: 'queryLikedDoc'
      })
    }
  },
  methods: {
    queryLikedDocs () {
      this.$store.dispatch({
        type: 'queryLikedDoc'
      })
    },
    // Using vue-infinite-loading
    onInfinite ($state) {
      if (this.noMore) {
        $state.complete()
        return
      }
      setTimeout(() => {
        this.queryLikedDocs()
        $state.loaded()
      }, 1000)
    }
  },
  mounted () {
    setTimeout(() => {
      /* eslint-disable no-undef */
      feather.replace()
    }, 100)
  }
}
</script>

<style lang="scss" scoped>
h1 {
  margin-left: 1.8rem;
  margin-bottom: 5rem;
}

button.liked {
  margin-left: 1.8rem;
  padding-left: 0;
  margin-top: 3.8rem;
}
.author-view {
  margin-top: 12em;
}
</style>
