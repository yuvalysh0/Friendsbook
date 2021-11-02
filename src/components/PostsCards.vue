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
      <div class="likeBtn">
        <span class="text-subtitle2 text-grey-8 q-mr-xs">{{ allLikes }} likes</span>
        <q-btn
          @click="changeLike()"
          :class="{'text-red' : this.isLiked, 'text-grey-8' : !this.isLiked}"
          flat
          round
          icon="favorite"/>
      </div>
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
import firebase from "app/middleware/firebase";

export default {
  data() {
    return {
      userInfo: [],
      like: true,
      allLikes: 0,
      isLiked: true,
      postId: this.post.id
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
    ...mapActions('posts', ['getPosts', 'addLike', 'deleteLike', 'checkIfTheUserLikedThePost', 'deletePostByUser', 'getAllLikes']),
    ...mapActions('users', ['getUserInfo']),


    changeLike() {
      this.isLiked = !this.isLiked;
      let payload = {postId: this.postId, userId: this.user.id}
      if (this.isLiked) {
        this.addLike(payload).then(() => {
          this.getAllLikes(this.postId).then(res => {
            this.allLikes = res
          })
        })
      } else {
        this.deleteLike(payload).then(() => {
          this.getAllLikes(this.postId).then(res => {
            this.allLikes = res
          })
        })
      }
    },
  },

  created() {
    this.userInfo = LocalStorage.getItem('user')
    this.getUserInfo(this.$q.localStorage.getItem('userId'))

    this.getAllLikes(this.postId).then(res => {
      this.allLikes = res
    })

    let payload = {postId: this.postId, userId: this.userInfo.id}
    this.checkIfTheUserLikedThePost(payload).then(res => {
      this.isLiked = res
    })

    firebase.getRef(this.postId).on('child_changed', (snapshot) => {
      let data = snapshot.val()
    })

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

.likeBtn {
  position: absolute;
  right: 5px
}
</style>
