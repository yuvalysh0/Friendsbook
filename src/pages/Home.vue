<template>
  <q-page>
    <div class="row q-pa-sm constrain">
      <div
        class="col-12 col-sm-8"
        v-for="(post,index) in posts"
        :key="index">
        <PostsCards :post="post"/>
      </div>
      <InfiniteLoading class="absolute-bottom" spinner="waveDots" @infinite="infiniteHandler">
        <span class="col-12 col-sm-8" slot="no-more"> There are no more posts :) </span>
      </InfiniteLoading>

      <div class="col-12 col-sm-8">
        <template v-if="loading">
          <q-card flat bordered>
            <q-item>
              <q-item-section avatar>
                <q-skeleton size="40px" type="QAvatar"/>
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton
                    type="text"/>
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton
                    type="text"/>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-skeleton
              height="450px"
              square/>
            <q-card-section>
              <q-skeleton
                type="text"
                class="text-subtitle2"/>
              <q-skeleton
                type="text"
                width="50%"
                class="text-subtitle2"/>
              <q-skeleton
                type="text"
                width="50%"
                class="text-subtitle2"/>
              <q-skeleton
                type="text"
                width="50%"
                class="text-subtitle2"/>
              <q-skeleton
                type="text"
                width="50%"
                class="text-subtitle2"/>
              <q-skeleton
                type="text"
                width="100%"
                class="text-subtitle2"/>
            </q-card-section>
          </q-card>
        </template>
      </div>

    </div>

  </q-page>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import {mapState, mapActions} from 'vuex'
import PostsCards from "components/PostsCards";
import firebase from 'firebase/compat'
import 'firebase/firestore'
import {LocalStorage} from "quasar";

export default {
  components: {
    PostsCards, InfiniteLoading
  },

  data() {
    return {
      posts: [],
      lastDocSnapshot: null,
      loading: true
    }
  },

  computed: {
    ...mapState('posts', ['allPosts']),
  },
  methods: {
    ...mapActions('posts', ['getPosts']),
    ...mapActions('users', ['getUserInfo']),

    async fetchPosts() {
      const db = firebase.firestore()
      let postsRef = await db.collection('posts').limit(3).orderBy('date', 'desc')
      if (this.lastDocSnapshot) {
        postsRef = postsRef.startAfter(this.lastDocSnapshot)
      }
      const postsSnap = await postsRef.get()
      this.lastDocSnapshot = postsSnap.docs[postsSnap.docs.length - 1]
      const result = postsSnap.docs.map(doc => doc.data())
      this.posts.push(...result)
      this.loading = false;
      return result.length
    },

    async infiniteHandler($state) {
      const newPicturesCount = await this.fetchPosts()
      if (newPicturesCount > 0) {
        return $state.loaded() // More pictures to come
      }
      return $state.complete() // Done with the pictures
    },
  },

  mounted() {
    // this.fetchPosts()
    this.getUserInfo(window.user.uid)
  }

}
</script>

<style>

</style>
