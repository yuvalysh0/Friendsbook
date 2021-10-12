import Vue from 'vue'
import Vuex from 'vuex'

import users from './users'
import posts from './posts'
import auth from './store-auth'
import settings from './store-settings'
import comments from './store-comments'


Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    posts,
    users,
    auth,
    settings,
    comments
  }
})
