<template>
  <q-page>
    <div class="row q-col-gutter-lg constrain">
      <div class="col-11 col-sm-8">
        <template v-if="!loadingPosts && allPosts.length">
          <q-card
            v-for="post of allPosts"
            :key="post.id"
            class="card-post q-mb-md"
            flat
          >

            <itemByUserId :userId="post.userId" :location="post.location" :user="user"/>

            <q-separator/>

            <q-img
              :src="post.imageUrl"/>

            <q-card-section>
              <div class="text-h6">{{ post.caption }}
                <q-btn
                  @click="changeLike()"
                  class="text-grey-7"
                  flat
                  round
                  icon="favorite"/>
              </div>
              <div class="text-caption text-grey">
                {{ post.date | niceDate }}
              </div>
              <div class="text-grey">
                <span class="text-subtitle1">3 likes</span>
              </div>
            </q-card-section>
          </q-card>
        </template>

        <template v-else-if="!loadingPosts && !allPosts.length">
          <h5 class="text-center text-grey">No posts yet.</h5>
        </template>

        <template v-else>
          <q-card flat bordered>
            <q-item>
              <q-item-section avatar>
                <q-skeleton size="40px" type="QAvatar" animation="fade"/>
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton
                    type="text"
                    animation="fade"/>
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton
                    type="text"
                    animation="fade"/>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-skeleton
              height="200px"
              square
              animation="fade"/>

            <q-card-section>
              <q-skeleton
                type="text"
                class="text-subtitle2"
                animation="fade"/>
              <q-skeleton
                type="text"
                width="50%"
                class="text-subtitle2"
                animation="fade"/>
            </q-card-section>
          </q-card>
        </template>
      </div>
      <div class="col-4 large-screen-only">
        <q-item>
          <q-item-section avatar>
            <q-avatar rounded size="60px">
              <q-img :src='userInfo.profilePic'/>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold">{{ userInfo.firstName }} {{ userInfo.lastName }}</q-item-label>
          </q-item-section>
        </q-item>

      </div>
    </div>
  </q-page>
</template>

<script>
import {date} from 'quasar'
import {mapState, mapActions} from 'vuex'
import firebaseInstance from '../../middleware/firebase'
import itemByUserId from "components/itemByUserId";
import {LocalStorage} from "quasar";

export default {
  name: 'Home',
  components: {
    itemByUserId
  },
  data() {
    return {
      loadingPosts: false,
      isLiked: false,
      userInfo: [],
    }
  },
  computed: {
    ...mapState('posts', ['allPosts']),
    ...mapState('users', ['users', 'user'])
  },
  methods: {
    ...mapActions('posts', ['getPosts']),
    ...mapActions('users', ['getUserInfo']),
    changeLike() {
      this.isLiked = !this.isLiked
      console.log(this.isLiked)
    }
  },

  filters: {
    niceDate(value) {
      return date.formatDate(value, 'MMM D h:mmA')
    }
  },

  created() {
    this.userInfo = LocalStorage.getItem('user')
    this.loadingPosts = true
    this.getUserInfo(this.$q.localStorage.getItem('userId'))
      .then(() => {
        this.getPosts().then(() => {
          this.loadingPosts = false
        }).catch(() => {
          this.$q.dialog({
            title: 'Error',
            message: 'Could not download posts'
          })
          this.loadingPosts = false
        })
      }).catch(err => console.log(err))
  }
}
</script>

<style>
.card-post {
  border-top: #9D9D9D solid 1px;
  border-bottom: #9D9D9D solid 1px;
  border-radius: 5px;
}
</style>
