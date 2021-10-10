<template>
  <q-page>
    <div class="row q-col-gutter-lg constrain">
      <div class="col-11 col-sm-8">
        <template>
          <q-card class="q-mb-lg" flat bordered>
            <q-img :src="user.profilePic" style="height: 200px; width: 100%" />

            <q-card-section>
              <q-btn
                @click="settingsDialog = true"
                fab
                color="primary"
                icon="settings"
                class="absolute small-screen-only"
                style="top: 0; right: 12px; transform: translateY(-50%);"
              >
                <q-tooltip>
                  Enter Settings
                </q-tooltip>
              </q-btn>

              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  Hello {{user.firstName}} {{user.lastName}}
                  <p class="text-subtitle2 text-weight-light">You posted {{ postsById.length }} images.</p>
                </div>
              </div>
            </q-card-section>

          </q-card>
        </template>

        <template v-if="!loadingPosts && postsById.length">
          <q-card
            flat
            v-for="post in postsById"
            :key="post.id"
            class="card-post q-mb-md "
            bordered>
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img :src=user.profilePic>
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-bold">{{ user.firstName }} {{ user.lastName }}</q-item-label>
                <q-item-label caption>
                  {{ post.location }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator/>

            <q-img
              :src="post.imageUrl"/>

            <q-card-section>
              <div class="text-h6">{{ post.caption }}</div>
              <div class="text-caption text-grey">{{ post.date | niceDate }}</div>
            </q-card-section>
          </q-card>
        </template>

        <template v-else-if="!loadingPosts && !postsById.length">
          <h5 class="text-center text-grey">No posts yet.</h5>
        </template>
      </div>
      <div class="col-4 large-screen-only">
        <q-card class="q-mr-md text-center">
          <q-card-section class="bg-grey-3">
            <div class="text-h6 text-primary">Settings</div>
          </q-card-section>
          <q-separator class="bg-primary"/>
              <Settings/>
        </q-card>
      </div>
    </div>

    <template>
      <q-dialog v-model="settingsDialog">
        <q-card>
          <q-separator />
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Settings</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section>
            <Settings/>
          </q-card-section>
        </q-card>
      </q-dialog>
    </template>

  </q-page>
</template>

<script>
import { ref } from 'vue'
import {date} from 'quasar'
import {mapState, mapActions, mapGetters} from 'vuex'
import usersState from "src/store/users/state";
import firebaseInstance from '../../middleware/firebase'
import {LocalStorage} from "quasar";
import Settings from "components/Settings";


export default {
  data() {
    return {
      loadingPosts: false,
      tab: 'settings',
      settingsDialog: false
    }
  },

  components: {
    Settings
  },

  computed: {
    ...mapState('users', ['user']),
    ...mapState('posts', ['postsById']),
  },

  methods: {
    ...mapActions('posts', ['getPostsById']),
    ...mapActions('users', ['getUserInfo'])
  },

  filters: {
    niceDate(value) {
      return date.formatDate(value, 'MMM D h:mmA')
    },
  },

  created() {
    this.loadingPosts = true
    this.getUserInfo(this.$q.localStorage.getItem('userId'))
    this.getPostsById(this.$q.localStorage.getItem('userId')).then(() => {
      this.loadingPosts = false
    }).catch(() => {
      this.$q.dialog({
        title: 'Error',
        message: 'Could not download posts'
      })
      this.loadingPosts = false
    })
  }
}
</script>

<style scoped>

</style>
