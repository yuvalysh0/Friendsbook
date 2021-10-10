<template>
  <q-layout view="hHh Lpr lFf">
    <q-header>
      <q-toolbar class="constrain">
        <div class="large-screen-only">
          <q-btn
            icon="home"
            flat
            to='/'
            size="12px"/>
          <q-btn
            icon="add_a_photo"
            flat
            to='/addPicture'
            size="12px"/>
          <q-btn
            icon="account_circle"
            flat
            to='/profile'
            size="12px"/>
        </div>

        <q-toolbar-title class="text-grand-hotel absolute-center">
          Friendsbook
        </q-toolbar-title>

        <q-space/>

        <q-btn
          v-if="!loggedIn"
          icon="login"
          label="Login"
          to="/auth"
          flat
          size="12px" />
        <q-btn
          v-if="loggedIn"
          @click="logout()"
          icon="logout"
          label="Logout"
          flat
          size="12px" />
      </q-toolbar>

    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer
    class="small-screen-only">
      <q-tabs
        v-model="tab"
        dense
      >
        <q-route-tab
          icon="home"
          to='/'
          key="home"/>
        <q-route-tab
          icon="add_a_photo"
          to='/addPicture'
          key="camera"/>
        <q-route-tab
          icon="account_circle"
          to='/profile'
          key="profile"/>

      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
  data () {
    return {
      tab: 'home'
    }
  },
  computed:{
    ...mapState('auth', ['loggedIn']),
    ...mapState('users', ['user']),
  },

  methods: {
    ...mapActions('users', ['getUserInfo']),
    ...mapActions('auth', ['logoutUser']),
    logout() {
      this.logoutUser()
    }
  }
}

import {mapState, mapActions} from "vuex";
</script>

<style lang="sass">
.q-toolbar__title
  font-size: 30px
  text-align: center

</style>
