export default {
  setPosts: ((state, posts) => state.allPosts = posts),
  setIsEmpty: ((state, data) => state.stateEmpty = data),
  setPostsById: ((state, posts) => state.postsById = posts)
}
