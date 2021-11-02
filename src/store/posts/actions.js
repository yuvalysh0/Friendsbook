import db from '../../../middleware/firebase'

export default {

  deleteAllUserPosts: async ({}, userId ) => {
    await db.deleteAllUserPosts(userId).then(() => {
      console.log('All user posts were removed. ')
    })
  },

  deletePostByUser: async ({}, postId) => {
    await db.deletePost(postId)
  },

  getPostsById: async ({commit}, id) => {
    let posts = []
    posts = await db.getPostsById(id)
    commit('setPostsById', posts)
  },

  getPosts: async ({commit}) => {
    const posts = await db.getPosts()
    commit('setPosts', posts)
  },

  addPhotoToRealTimeDb: async ({}, postId) => {
    return await db.addPhotoToDb(postId)
  },

  addLike: async ({}, payload) => {
    return await db.addOrDeleteLike(payload.postId, payload.userId, 'add')
  },

  deleteLike: async ({}, payload) => {
    return await db.addOrDeleteLike(payload.postId, payload.userId, 'delete')
  },

  getAllLikes: async ({}, postId) => {
    return await db.getAllLikes(postId)
  },

  checkIfTheUserLikedThePost: async ({}, payload) => {
    return await db.getWhoLikedThePost(payload.postId, payload.userId)
  }

}
