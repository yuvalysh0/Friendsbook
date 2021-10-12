import firebaseInstance from '../../middleware/firebase'
import {LocalStorage} from 'quasar'
import db from "app/middleware/firebase";

const state = {
  postId: '',
  comment: {
    date: '',
    text: '',
    userId: ''
  }
}

const mutations = {
  setComments: ((state, comments) => state.comments = comments),
}

const actions = {
  addNewComment: async ({}, payload) => {
    await db.addComment(payload[0], payload[1], payload[2])
  },

  /*deleteComment: {

  },*/

  getAllComments: async ({}, postId) => {
    return await db.getComments(postId)
  },
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
