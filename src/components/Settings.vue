<template>
  <div class="text-center justify-center">

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

export default {
  methods: {
    visitOurWebsite() {
      openURL('https://www.google.com')
    },
    emailUs() {
      window.location.href = 'mailto: yuvalysh0@gmail.com?subject=friendsbook feedback'
    }
  }
}
</script>

<style scoped>

</style>
