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
  }
}
