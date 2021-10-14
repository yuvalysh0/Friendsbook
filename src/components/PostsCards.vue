<template>
  <q-card
    :key=post.id
    class="card-post q-mb-md"
    flat
  >

    <itemByUserId :userId="post.userId" :location="post.location" :user="user" :postId="post.id"/>

    <q-separator/>

    <q-img
      :ratio="1"
      :src="post.imageUrl"/>

    <q-card-section>
      <div class="text-h6">{{ post.caption }}

      </div>
      <div class="text-caption text-grey">
        {{ post.date | niceDate }}
      </div>
    </q-card-section>
    <q-card-section>
      <Comments :postId="post.id"/>
    </q-card-section>
  </q-card>
</template>

<script>
import {date, LocalStorage} from "quasar";
import {mapActions, mapState} from "vuex";
import itemByUserId from "components/itemByUserId";
import Comments from "components/Comments";

export default {
  data() {
    return {
      userInfo: [],
    }
  },
  components: {
    itemByUserId, Comments
  },
  props: ['post'],

  computed: {
    ...mapState('posts', ['allPosts']),
    ...mapState('users', ['user'])
  },

  methods: {
    ...mapActions('posts', ['getPosts', 'addLike', 'deleteLike']),
    ...mapActions('users', ['getUserInfo']),

    addOrDeleteLike(postId) {
      id(this.isLiked)
    },
  },

  created() {
    this.userInfo = LocalStorage.getItem('user')
    this.getUserInfo(this.$q.localStorage.getItem('userId'))
  },

  filters: {
    niceDate(value) {
      return date.formatDate(value, 'MMM D h:mmA')
    }
  },
}
</script>

<style scoped>
.card-post {
  border: #EFEFEF solid 1px;
  border-radius: 3px;
}
</style>
