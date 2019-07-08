<template>
  <div class="newdoc-view">
  <h1 class="title">New Document</h1>
  <form method="post" @submit.prevent="onSubmit()">
    <p v-if="error" class="tip error">{{error}}</p>
    <div class="form-alias">
      <label>
        <strong>title</strong>
        <input
          v-model.trim="title"
          type="text"
          name="title"
          placeholder="title">
      </label>
    </div>

    <div class="form-name">
      <label>
        <strong>URL</strong>
        <input
          v-model.trim="uri"
          type="text"
          name="uri"
          placeholder="URL">
      </label>
    </div>

    <div class="form-name">
      <label>
        <strong>Category</strong>
        <input
          v-model.trim="category"
          type="text"
          name="category"
          placeholder="category">
      </label>
    </div>

    <div class="form-name">
      <label>
        <strong>Authors</strong>
        <input
          v-model.trim="author"
          type="text"
          name="author"
          placeholder="authors">
      </label>
    </div>

    <div class="form-name">
      <label>
        <strong>Publisher</strong>
        <input
          v-model.trim="publisher"
          type="text"
          name="publisher"
          placeholder="publisher">
      </label>
    </div>

    <div class="form-name">
      <label>
        <strong>Summary</strong>
        <input
          v-model.trim="summary"
          type="text"
          name="summary"
          placeholder="Summary">
      </label>
    </div>

    <div class="form-name">
      <label>
        <strong>Publish Date</strong>
        <input
          v-model.trim="pubdate"
          type="text"
          name="pubdate"
          placeholder="Publish Date">
      </label>
    </div>

    <div class="form-name">
      <label>
        <strong>Pages</strong>
        <input
          v-model.trim="pages"
          type="text"
          name="pages"
          placeholder="Pages">
      </label>
    </div>

    <div class="form-name">
      <label>
        <strong>Price</strong>
        <input
          v-model.trim="price"
          type="text"
          name="price"
          placeholder="Price">
      </label>
    </div>

    <div class="form-submit">
      <button
        class="submit"
        type="submit"
        :disabled="isDisabled"
        :class="{disabled: isDisabled}">
        Save
      </button>
    </div>
  </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'newdoc-view',
  data () {
    return {
      title: 'The Probablistic Method',
      uri: 'https://www.dropbox.com/sh/vkexrfecjdgej9j/AADxKV1NEiQuTDhuXVqdJm7ra?dl=0&preview=all-notes-up-to-spring-break.pdf',
      category: 'Math',
      author: 'Andrew Lin',
      publisher: 'MIT',
      summary: '',
      pubdate: '',
      pages: 0,
      price: 0.0,
      isDisabled: false,    // Disabled submit button
      isShow: 0,            // Show pwd
      passType: 'password',
      error: ''             // Verification results
    }
  },
  computed: {
    // Getting Vuex State from store/modules/user
    ...mapState({
      email: state => state.user.temp_email,
      token: state => state.user.temp_token
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
        type: 'newdoc',
        title: this.title,
        uri: this.uri,
        category: this.category,
        author: this.author.split(','),
        publisher: this.publisher,
        summary: this.summary,
        // pubdate: this.pubdate,
        pages: this.pages,
        price: this.price
      }).then(res => {
        // Success handle
        this.onSuccess(res)
      }, err => {
        // Error handle
        this.onError(err)
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$store.getters.currentUser.email) {
        // next({ path: '/' })
        // vm.$router.push({name: 'HomeView'})
      } else {
        next()
      }
    })
  },
  created () {
    // Getting local user automatic filling
    if (localStorage.getItem('email')) {
      this.$store.commit({
        type: 'getLocalUser'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.newdoc-view {
  h1 {
    height: 4.5rem;
    margin: 0 0 1rem 0;
    padding: 0 1.8rem;
    line-height: 4.5rem;
    background: #fff;
    border-bottom: 0.1rem solid #eee;
    text-align: center;
    font-size: 1.8rem;
    font-weight: bold;

    a {
      position: absolute;
      left: 1.8rem;
      top: 0;
      color: #42bd56;
      font-size: 1.5rem;
      font-weight: normal;
    }
  }

  form {
    padding: 2rem 1.5rem;

    >div {
      margin-top: 1em;
    }

    strong {
      font-size: 1.5rem;
      color: #222;
      display: none;
      margin-bottom: 0.5rem;
    }

    input[type="email"], input[type="text"], input[type="password"] {
      display: inline-block;
      width: 100%;
      height: 4.4rem;
      padding: 0 0.8rem;
      box-sizing: border-box;
      font-size: 1.5rem;
      background: #fff;
      border: 0.1rem solid #ccc;
      border-top-left-radius: 0.3rem;
      border-top-right-radius: 0.3rem;
      outline: 0;
    }

    .form-pwd {
      position: relative;

      input {
        padding-right: 4rem;
        border-top: 0;
      }
    }

    .submit {
      cursor: pointer;
      width: 100%;
      padding: 1.2rem 2.6rem;
      margin-top: 1rem;
      font-size: 1.7rem;
      text-align: center;
      color: #fff;
      background: #17AA52;
      border: 0.1rem solid #17AA52;
      border-radius: 0.3rem;
    }

    .disabled {
      cursor: not-allowed;
      background: #eee;
      border: none;
    }

    .tip {
      font-size: 1.4rem;
      color: #aaa;
    }

    .error {
      color: #ff0000;
    }
  }

  .footer {
    .more-login {
      font-size: 1.5rem;
      color: #aaa;
      text-align: center;
    }

    .btns {
      margin-top: 4rem;
      text-align: center;
      font-size: 1.5rem;

      a {
        color: #42bd56;
        margin-right: 1.5rem;
      }
    }
  }
}
</style>
