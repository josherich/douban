<template>
  <div class="home-view has-header">
    <sub-nav mold="quickNav"></sub-nav>
    <d-list mold="thumbnail" :items="docs"></d-list>
    <list mold="thumbnail" :items="events"></list>
    <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading">
      <loading slot="spinner"></loading>
      <div slot="no-more">No more results.</div>
    </infinite-loading>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import InfiniteLoading from 'vue-infinite-loading'
import SubNav from '../components/SubNav'
import List from '../components/List'
import DList from '../components/DList'
import Loading from '../components/Loading'

export default {
  name: 'home-view',
  components: { SubNav, List, DList, InfiniteLoading, Loading },
  data () {
    return {}
  },
  computed: {
    // Getting Vuex State from store/modules/activities
    ...mapState({
      events: state => state.activities.events,
      docs: state => state.docs.docs,
      noMore: state => state.docs.noMore
    })
  },
  methods: {
    // Using vue-infinite-loading
    onInfinite ($state) {
      if (this.noMore) {
        $state.complete()
        return
      }
      setTimeout(() => {
        this.loadMoreDocs()
        // this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
        $state.loaded()
      }, 1000)
    },
    // Dispatching Actions
    ...mapActions([
      'loadMoreDocs'
    ])
  }
}
</script>

<style lang="scss" scoped>
.sub-nav {
  margin: 0 1.8rem;
  padding-top: 0.2rem;
}
</style>
