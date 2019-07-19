<template>
  <div class="d-list">
    <template v-if="mold === 'thumbnail'" v-for="item in items">
      <div class="row">

        <div class="content">
          <!-- <img :src="item.image" alt="cover"> -->
          <router-link
            class="thumbnail"
            :to="{name: 'DetailView', params: { id: item.id }}"><h3>{{item.title}}</h3></router-link>

          <div class="thumbnail">
            <template v-for="author in item.author">
              <router-link class="" :to="{name: 'AuthorView', params: { name: author }}"><span class="name">{{author}}</span></router-link>
            </template>
          </div>

          <router-link
            class="thumbnail"
            :to="{name: 'DetailView', params: { id: item.id }}"><p>{{item.summary | subStr}}</p></router-link>
        </div>

        <div class="download">
          <a :href="item.uri">Download</a>
        </div>
      </div>
    </template>

    <template v-if="mold === 'basic'">
      <ul class="basic">
        <li v-for="item in items">
          <a href="#">
            <h3>{{item.title}}</h3>
            <div class="info">{{item.summary}}</div>
          </a>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
export default {
  name: 'list',
  props: {
    mold: {
      type: String,
      default: 'basic'
    },
    items: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
    }
  },
  filters: {
    subStr: function (value) {
      let newVal = value.replace(/<.*?>/g, '')
      return newVal.slice(0, 400) + '...'
    }
  }
}
</script>

<style lang='scss' scoped>
.d-list {
  .row {
    margin: 1em 0;
  }
  .download {
    margin-left: 1.8rem;
  }
  .thumbnail {
    position: relative;
    display: block;
    padding: 0 1.8rem 1.5rem 0;
    margin-left: 1.8rem;

    .content {
      overflow: hidden;
      margin-bottom: 1rem;
    }
    h3 {
      margin-top: 0;
      margin-bottom: 0.6rem;
      line-height: 1.41;
      text-align: justify;
      font-size: 1.7rem;
      font-weight: 500;
      color: #494949;
    }
    .name {
      margin-right: 1em;
      font-size: 1.4rem;
    }
    p {
      line-height: 1.5;
      text-align: justify;
      color: #aaa;
      font-size: 1.2rem;
      overflow: hidden;
    }

    img {
      float: right;
      // width: 25.6%;
      height: 8.678rem;
      margin-left: 2.5rem;
    }

    .author {
      font-size: 1.2rem;
      color: #ccc;
    }

    .label {
      position: absolute;
      bottom: 2.5rem;
      right: 1.8rem;
    }
  }

  .basic {
    h3 {
      padding: 0;
      line-height: 1.41;
      font-size: 1.7rem;
      font-weight: 500;
      color: #494949;
    }

    .info {
      margin-top: 0.5rem;
      font-size: 1.4rem;
      color: #42bd56;
    }
  }
}
</style>
