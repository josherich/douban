<template>
  <div class="detail-view has-header">
    <template v-if="!showLoading">
      <div class="info">
        <h2>
          {{docItem.title}}
        </h2>
        <div class="poster">
          <img :src="docItem.image" alt="">
        </div>

        <div class="detail">
          <span>Authors:&nbsp;&nbsp;</span>
          <ul>
            <li>
            <template v-for="author in docItem.author">
              <span class="badge">{{author}}</span>
            </template>
            </li>
          </ul>
        </div>

        <div class="detail">
          <span><rating v-if="docItem.title" :rating="{average: docItem.rating}"></rating></span>
          <ul>
            <li></li>
          </ul>
        </div>

        <div class="detail">
          <span><a :href="docItem.uri">Download</a></span>
          <ul>
            <li></li>
          </ul>
        </div>

        <div class="detail">
          <span>Publisher:&nbsp;&nbsp;</span>
          <ul>
            <li>{{docItem.publisher}}</li>
          </ul>
        </div>

        <div class="detail">
          <span>Summary:&nbsp;&nbsp;</span>
          <ul>
            <li>{{docItem.summary}}</li>
          </ul>
        </div>

        <div class="detail">
          <span>Created at:&nbsp;&nbsp;</span>
          <ul>
            <li>{{(new Date(docItem.createdAt)).toDateString()}}</li>
          </ul>
        </div>

        <div class="detail">
          <span>Category:&nbsp;&nbsp;</span>
          <ul>
            <li>{{docItem.category}}</li>
          </ul>
        </div>

      </div>

    </template>
    <loading v-show="showLoading"></loading>
    <h1 class="related-title">Related Papers</h1>
    <d-list class="similar-docs" mold="thumbnail" :items="similarDocs"></d-list>

    <form method="post" @submit.prevent="onSubmit()">
      <div class="form-submit">
        <button
          class="submit"
          type="submit"
          :disabled="isDisabled"
          :class="{disabled: isDisabled}">
          Delete
        </button>
      </div>
    </form>

    <router-link
      class="thumbnail"
      :to="{name: 'EditView', params: { id: docItem.id }}">
      <button
        class="submit"
        type="submit"
        :disabled="isDisabled"
        :class="{disabled: isDisabled}">
        Edit
      </button>
    </router-link>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import Banner from '../components/Banner'
import Tags from '../components/Tags'
import DownloadApp from '../components/DownloadApp'
import Loading from '../components/Loading'
import Rating from '../components/Rating'
import DList from '../components/DList'

export default {
  name: 'detail-view',
  components: { Banner, Tags, DownloadApp, Loading, Rating, DList },
  data () {
    return {
      showLoading: true,
      isDisabled: false
    }
  },
  filters: {
    toArray (value) {
      return value.split(',')
    }
  },
  computed: {
    content: function () {
      // Careful XSS
      // Remove copyright imgs
      return this.docItem.content.replace(/<img.+?>/ig, '')
    },
    // Getting Vuex State from store/modules/activities
    ...mapState({
      docItem: state => state.docs.docItem,
      similarDocs: state => state.docs.similarDocs
    })
  },
  methods: {
    beforeSubmit: function () {
      // console.log('Submiting...')
      this.isDisabled = true
    },
    onSuccess: function (res) {
      // console.log('complete!')
      this.$router.push({name: 'HomeView'})
    },
    onError: function (err) {
      // console.log(err)
      this.error = err.body.error
      this.isDisabled = false
    },
    onSubmit: function () {
      // Disabled submit button
      this.beforeSubmit()
      // Login...
      this.$store.dispatch({
        type: 'deletedoc',
        id: this.$route.params.id
      }).then(res => {
        // Success handle
        this.onSuccess(res)
      }, err => {
        // Error handle
        this.onError(err)
      })
    },
    onGetSimilarDocs: function (res) {
      console.log(res)
      // Dispatching getSingleEvent
      this.$store.dispatch({
        type: 'getSimilarDocs',
        id: this.$route.params.id
      })
    }
  },
  created () {
    // Getting route params
    const id = this.$route.params.id

    // Dispatching getSingleEvent
    this.$store.dispatch({
      type: 'getSingleDoc',
      id: id
    }).then(res => {
      // Success handle
      this.onGetSimilarDocs(res)
      this.showLoading = false
    })
  }
}
</script>

<style lang="scss" scoped>
.detail-view {
  margin-top: 12em;
}
h1.related-title {
  margin: 4rem 0 4rem 1.8rem;
}
.similar-docs {
  margin-top: 1em;
}
.info {
  margin: 1rem;
  margin-left: 1.8rem;

  h2 {
    margin: 2rem 0;
    font-weight: bold;
    color: #494949;
  }

  .badge {
    display: inline-block;
    padding: 0.1rem 0.5rem;
    margin-bottom: 0.3rem;
    margin-right: 10px;
    vertical-align: middle;
    line-height: 1.8rem;
    font-size: 1.2rem;
    color: #fff;
    background-color: #FF8263;
    border-radius: 0.2rem;
  }

  .poster {
    margin: 2rem auto;
    text-align: center;

    img {
      width: 100%;
      max-width: 22rem;
      height: auto;
    }
  }
}

.detail {
  margin-left: 3.3rem;
  margin-bottom: 1rem;
  min-height: 1.5em;
  font-size: 1.4rem;
  clear: left;

  > span {
    float: left;
    margin-left: -3.3rem;
    color: #666666;
  }

  ul {
    list-style-position: outside;
    margin-left: 0;
  }
}

.describe {
  h2 {
    color: #072;
  }

  .content {
    overflow: hidden;
    font-size: 1.4rem;
  }
}

</style>
