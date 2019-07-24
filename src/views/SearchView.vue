<template>
  <div class="search-view has-header">
    <div class="search">
      <form id="search_form" onsubmit="return false">
        <input
          type="text"
          name="query"
          v-model.trim.lazy="queryStr"
          placeholder="Search title, author, summary, publisher">
        <a href="javascript:void(0);" @click="query()">Search</a>
      </form>
    </div>
    <div v-if="queryStr" class="search-res">
      <d-list mold="thumbnail" :items="queryRes_doc"></d-list>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Group from '../components/Group'
import DList from '../components/DList'

export default {
  name: 'search-view',
  components: { Group, DList },
  data () {
    return {
      queryStr: ''
    }
  },
  computed: {
    ...mapState({
      queryRes_doc: state => state.docs.docQueryResult
    })
  },
  methods: {
    query: function () {
      if (this.queryStr) {
        // Dispatching query
        this.$store.dispatch({
          type: 'queryDoc',
          queryStr: this.queryStr
        })
      }
    }
  },
  created: function () {
    const q = this.$route.params.q
    if (q) {
      this.queryStr = q
      this.query()
    }
  }
}
</script>

<style lang="scss" scoped>
.search-view {
  .search {
    padding: 0.7rem 2rem;
    border-bottom: 0.1rem solid #F2F2F2;
    overflow: hidden;

    input {
      width: 85%;
      height: 3rem;
      padding: 0.5rem 0.8rem;
      box-sizing: border-box;
      font-size: 1.4rem;
      color: #111;
      background: #f5f5f5;
      border-radius: 0.3rem;
      border: 0;
      outline: 0;
    }

    a {
      display: inline-block;
      float: right;
      width: 10%;
      height: 3rem;
      padding-left: 5%;
      line-height: 3rem;
      font-size: 1.4rem;
      color: #333;
      text-decoration: none;
    }
  }

  .list-link {
    display: block;
    margin-bottom: 1.5rem;
    padding: 1.5rem 0 1.5rem 5rem;
    font-size: 1.6rem;
    line-height: 1.8rem;
    color: #42bd56;
  }
}
</style>
