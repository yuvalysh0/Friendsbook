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
    <q-btn
      v-show="postOfUser(userInfo.id)"
      @click="deletePost(postId)"
      size="10px"
      flat
      color="dark"
      label="delete Post"
      rounded
    />

    <q-space/>

  </q-item>
</template>

<script>
import { mapActions, mapState } from "vuex";
import firebase from '../../middleware/firebase'

export default {
  data() {
    return {
      userInfo: {},
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
    }

  },
  created() {
    this.getUserInfoForPosts(this.userId).then(res => {
      this.userInfo = res
    })


  }
}
</script>

<style scoped>

</style>
