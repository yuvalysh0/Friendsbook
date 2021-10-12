import firebaseInstance from '../../middleware/firebase'
import {LocalStorage} from 'quasar'

const state = {
  loggedIn: false
}

const mutations = {
  setLoggedIn(state, value) {
    state.loggedIn = value
  }
}

const actions = {

  registerUser({}, payload) {
    return firebaseInstance.firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        window.user = response.user;
        firebaseInstance.uploadProfilePictureToStorage(payload.profilePic, response.user.uid, payload)
        return response.user.uid
      }).catch(error => {
      console.log('error', error)
    })
  },

  loginUser({}, payload) {
    return firebaseInstance.firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        window.user = response.user;
        console.log("response", response)
        return response.user.uid
      }).catch(error => {
        console.log('error', error)
      })
  },

  logoutUser() {
    return firebaseInstance.firebase.auth().signOut().then(() => {
      console.log('User Signed out')
    }).catch(err => {
      console.log(err)
    })
  },

  handleAuthStateChange({commit}) {
    firebaseInstance.firebase.auth().onAuthStateChanged(user => {
      if (user) {
        commit('setLoggedIn', true)
        LocalStorage.set('loggedIn', true)
        window.user = user
        this.$router.push('/').catch(err => {
        })
      } else {
        commit('setLoggedIn', false)
        LocalStorage.set('loggedIn', false)
        window.user = null
        this.$router.replace('/auth')
      }
    })
  }
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
