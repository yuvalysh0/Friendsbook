import db from '../../../middleware/firebase'

export default {

  getPost() {

  },

  getPostsById: async ({commit}, id) => {
    let posts = []
    posts = await db.getPostsById(id)
    commit('setPostsById', posts)
  },

  getPosts: async ({commit}) => {
    let posts = []
    posts = await db.getPosts()
    commit('setPosts', posts)
  },

  addPhotoToRealTimeDb: async ({}, postId) => {
    return await db.addPhotoToDb(postId)
  },

  addLike: async ({}, payload) => {
    return await db.addOrDeleteLike(payload.postId,payload.userId, 'add')
  },

  deleteLike: async ({}, payload) => {
    return await db.addOrDeleteLike(payload.postId,payload.userId, 'delete')
  },

  getAllLikes: async ({}, postId) => {
    return await db.getAllLikes(postId)
  },

  checkIfTheUserLikedThePost: async ({}, payload) => {
    return await db.getWhoLikedThePost(payload.postId, payload.userId)
  }

}
