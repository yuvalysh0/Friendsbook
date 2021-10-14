import db from '../../../middleware/firebase'
import {LocalStorage} from "quasar";

export default {
  setNewUser: async ({commit}, id) => {
  },



  getUserInfoForPosts: ({}, id) => {
    let user = []
    return db.getUserInfo(id).then((user) => {
      return user
    })
  },

  getUserInfo: async ({commit}, id) => {
    let user = {}
    user = await db.getUserInfo(id)
    LocalStorage.set('user', user)
    LocalStorage.set('userId', id)
    commit('setUser', user)
  },

  setUserInfo: async ({commit}, user) => {
    commit('setUser', user)
  },
}

