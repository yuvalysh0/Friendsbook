<template>
  <q-item>
    <q-item-section avatar>
      <q-avatar>
        <q-img :src= userInfo.profilePic />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-bold">{{ userInfo.firstName }} {{userInfo.lastName}}</q-item-label>
      <q-item-label caption>
        {{ location }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      userInfo: {}
    }
  },
  props: ['location', 'userId', 'user'],
  methods: {
    ...mapActions('users', ['getUserInfo', 'getUserInfoForPosts'])
  },
  created() {

    console.log('user id: ',this.userId)
    this.getUserInfoForPosts(this.userId).then(res => {
      this.userInfo = res
    })
  }
}
</script>

<style scoped>

</style>
