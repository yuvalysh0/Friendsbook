<template>
  <div class="text-center justify-center">
    <q-btn
      @click="confirm"
      class="q-ma-md"
      icon="delete"
      label="Delete all posts!"
      rounded
      color="red-8" />

    <q-item-label class="text-subtitle1 text-bold q-ma-sm">More</q-item-label>

    <q-item
      tag="label"
      v-ripple
      to="/profile/help"
    >
      <q-item-label>Help</q-item-label>
      <q-space/>
      <q-item-section side>
        <q-icon name="chevron_right"/>
      </q-item-section>
    </q-item>

    <q-item
      tag="label"
      v-ripple
      @click="visitOurWebsite"
    >
      <q-item-label>Visit our website</q-item-label>
      <q-space/>
      <q-item-section side>
        <q-icon name="chevron_right"/>
      </q-item-section>
    </q-item>

    <q-item
      tag="label"
      v-ripple
      @click="emailUs()"
    >
      <q-item-label>Email us</q-item-label>
      <q-space/>
      <q-item-section side>
        <q-icon name="chevron_right"/>
      </q-item-section>
    </q-item>

  </div>
</template>

<script>
import {openURL} from 'quasar'
import {mapActions} from "vuex";

export default {
  props: ['userId'],
  methods: {
    ...mapActions('posts', ['deleteAllUserPosts']),
    visitOurWebsite() {
      openURL('https://www.google.com')
    },
    emailUs() {
      window.location.href = 'mailto: yuvalysh0@gmail.com?subject=friendsbook feedback'
    },

    confirm () {
      this.$q.dialog({
        title: 'Delete all posts',
        message: 'Are you sure you want to delete all of your posts? ',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.deleteAllUserPosts(this.userId).then(() => {
          this.$q.notify({
            color: 'red-6',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'All of your posts were removed successfully.'
          })
        }).catch(err => console.log(err))
      }).onCancel(() => {
        console.log('>>>> Cancel')
      })
    },
  }
}
</script>

<style scoped>

</style>
