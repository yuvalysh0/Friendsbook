<template>
  <div class="constrain q-pt-lg">
    <q-card class="auth-tabs">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="login" label="Login"/>
        <q-tab name="register" label="Register"/>
      </q-tabs>

      <q-separator/>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login">
          <Login/>
        </q-tab-panel>

        <q-tab-panel name="register">
          <Register/>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab: 'login'
    }
  },
  components: {
    'Login' : require('components/Auth/Login').default,
    'Register' : require('components/Auth/Register').default
  }
}
</script>

<style scoped>

.auth-tabs {
  max-width: 500px;
  margin: 0 auto;
}

</style>
