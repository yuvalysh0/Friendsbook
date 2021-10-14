<template>
  <q-item>
    <q-item-section avatar>
      <q-avatar>
        <q-img :src= userInfo.profilePic />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-bold">{{ userInfo.firstName }} {{userInfo.lastName}}</q-item-label>
      <q-item-label caption>
        {{ location }}
      </q-item-label>
    </q-item-section>

    <q-space/>
    <q-card-section class="text-subtitle2 text-grey-8">
      {{ allLikes }} likes
    </q-card-section>
    <q-btn
      @click="changeLike()"
      :class="{'text-red' : this.isLiked, 'text-grey-8' : !this.isLiked}"
      flat
      round
      icon="favorite"/>
    <q-btn
      v-show="postOfUser(userInfo.id)"
      @click="deletePost(postId)"
      size="12px"
      flat
      color="dark"
      icon="delete"
      round/>
  </q-item>
</template>

<script>
import { mapActions, mapState } from "vuex";
import firebase from '../../middleware/firebase'

export default {
  data() {
    return {
      userInfo: {},
      like: true,
      allLikes: 0,
      isLiked: true
    }
  },
  props: ['location', 'userId', 'user', 'postId'],
  methods: {
    ...mapActions('users', ['getUserInfoForPosts']),
    ...mapActions('posts', ['getAllLikes', 'addLike', 'deleteLike', 'checkIfTheUserLikedThePost', 'deletePostByUser']),
    postOfUser(userId) {
      if (userId === window.user.uid) {
        return true
      }
      return false
    },

    deletePost(postId) {
      this.deletePostByUser(postId).then(() => {
        location.reload();
        this.$q.notify({
          color: 'orange-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'The post was removed.'
        })
      })
    },

    changeLike()  {
      this.isLiked = !this.isLiked;
      let payload = {postId: this.postId, userId: this.userId}
      if (this.isLiked) {
        this.addLike(payload).then(() => {
          this.getAllLikes(this.postId).then(res => {
            this.allLikes = res
          })
        })
      }
      else {
        this.deleteLike(payload).then(() => {
          this.getAllLikes(this.postId).then(res => {
            this.allLikes = res
          })
        })
      }
    },
  },
  created() {
    this.getUserInfoForPosts(this.userId).then(res => {
      this.userInfo = res
    })

    this.getAllLikes(this.postId).then(res => {
      this.allLikes = res
    })

    let payload = {postId: this.postId, userId: this.userId}
    this.checkIfTheUserLikedThePost(payload).then(res => {
      this.isLiked = res
    })

    firebase.getRef(this.postId).on('child_changed', (snapshot) => {
      let data = snapshot.val()
    })
  }
}
</script>

<style scoped>

</style>
