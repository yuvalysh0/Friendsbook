<template>
  <div>
    <p class="text-subtitle1 text-primary" v-if="this.comments">Comments: </p>
    <p class="text-subtitle2 text-grey-8 text-center" v-else>There are no comments! </p>
    <q-card
      v-for="localComment of comments"
      flat
      class="my-card q-mb-md">
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img :src="localComment.userId.profilePic">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-grey-8">{{ localComment.userId.firstName }} {{localComment.userId.lastName }}
          </q-item-label>
          <q-item-section>{{ localComment.text }}</q-item-section>
        </q-item-section>
        <q-item-section side>
          {{ localComment.date | niceDate }}
          <q-btn
            v-show="commentOfUser(localComment.userId)"
            @click="deleteComment(postId, localComment)"
            size="12px"
            icon="delete"
            rounded
            flat
            color="red-4"/>
        </q-item-section>
      </q-item>
    </q-card>
    <q-input
      v-model="commentInput"
      label="Enter a comment"
      filled class="q-mt-md"
    >
      <template v-slot:after>
        <q-btn
          @click="addComment(postId)"
          :disable="!commentInput"
          round
          dense
          flat
          icon="send"
          color="primary"/>
      </template>
    </q-input>

  </div>

</template>

<script>
import {mapState, mapActions} from 'vuex'
import {date, LocalStorage} from "quasar"


export default {
  name: "Comments",
  data() {
    return {
      comments: [],
      commentInput: '',
      userImg: LocalStorage.getItem('user').profilePic
    }
  },

  computed: {
    ...mapState('comments', ['comment']),
    ...mapState('users', ['user'])
  },

  props: ['postId'],

  methods: {
    commentOfUser(userId) {
      if (userId.id === window.user.uid) {
        return true
      }
      return false
    },
    ...mapActions('comments', ['getAllComments', 'addNewComment', 'deleteCommentAction']),
    ...mapActions('users', ['getUserInfoForPosts']),
    async addComment(postId) {
      let userId = LocalStorage.getItem('user').id
      await this.addNewComment([this.commentInput, this.postId, userId]).then(() => {
        this.getAllComments(this.postId).then(res => {
          this.comments = res
          this.commentInput = ''
        }).catch((err) => {
          console.log(err)
        })
      })
    },

    deleteComment(postId, comment) {
      let payload = {postId, comment}
      this.deleteCommentAction(payload).then(() => {
        this.$q.notify({
          color: 'orange-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'The comment was removed.'
        })
        this.getAllComments(this.postId).then(res => {
          this.comments = res
          this.commentInput = ''
        }).catch((err) => {
          console.log(err)
        })
      })
    }
  },

  filters: {
    niceDate(value) {
      return date.formatDate(value, 'MMM D HH:mm')
    }
  },

  created() {
    this.getAllComments(this.postId).then(res => {
      this.comments = res
    }).catch((err) => {
      console.log(err)
    })
  }
}

</script>

<style scoped>

</style>
