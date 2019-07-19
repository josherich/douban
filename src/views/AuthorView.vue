<template>
  <div class="author-view has-header">
    <h1>{{name}}</h1>
    <d-list mold="thumbnail" :items="docs"></d-list>
    <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading">
      <loading slot="spinner"></loading>
      <div slot="no-more">No more results.</div>
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
  name: 'author-view',
  components: { SubNav, List, DList, InfiniteLoading, Loading },
  data () {
    return {
      name: ''
    }
  },
  computed: {
    // Getting Vuex State from store/modules/activities
    ...mapState({
      docs: state => state.docs.docQueryResult,
      noMore: state => state.docs.noMore
    })
  },
  watch: {
    '$route' (to, from) {
      this.queryDocs()
    }
  },
  methods: {
    queryDocs () {
      const name = this.$route.params.name
      this.name = name
      this.$store.dispatch({
        type: 'queryDoc',
        queryStr: name
      })
    },
    // Using vue-infinite-loading
    onInfinite ($state) {
      if (this.noMore) {
        $state.complete()
        return
      }
      setTimeout(() => {
        this.queryDocs()
        $state.loaded()
      }, 1000)
    }
  },
  created () {
    this.queryDocs()
  }
}
</script>

<style lang="scss" scoped>
h1 {
  margin-left: 1.8rem;
  margin-bottom: 5rem;
}

.author-view {
  margin-top: 12em;
}
</style>
