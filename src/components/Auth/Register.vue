<template>
  <form @submit.prevent="submitForm()">
    <div class="row q-mb-md">
      <q-banner class="bg-grey-3 col">
        <template v-slot:avatar>
          <q-icon name="account_circle" color="primary"/>
        </template>
        Register to access your account.
      </q-banner>
    </div>
    <div class="row q-mb-md">
      <q-input
        outlined
        v-model="formData.email"
        ref="email"
        class="col"
        label="Email"
        lazy-rules
        :rules="[val => isValidEmailAddress(val) || 'Please enter a valid email address.']"
      />
    </div>
    <div class="row q-mb-md">
      <q-input
        outlined
        ref="password"
        v-model="formData.password"
        class="col"
        type="password"
        label="Password"
        lazy-rules
        :rules="[val => val.length >=6 || 'Please enter at least 6 characters.']"
      />
    </div>
    <div class="row q-mb-md">
      <q-input
        outlined
        v-model="formData.firstName"
        class="col"
        label="First Name"
        lazy-rules
        :rules="[val => val.length >=2 || 'Please enter at least 2 characters.']"
      />
    </div>
    <div class="row q-mb-md">
      <q-input
        outlined
        v-model="formData.lastName"
        class="col"
        label="Last Name"
        lazy-rules
        :rules="[val => val.length >=2 || 'Please enter at least 2 characters.']"
      />
    </div>
    <div class="row q-mb-md">
      <q-file
        class="col"
        v-model="formData.profilePic"
        outlined
        label="Choose A Profile Picture"
        accept="image/*"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file"/>
        </template>
      </q-file>
    </div>
    <div class="row q-mb-md">
      <q-space/>
      <q-btn
        class="q-ml-md"
        label="Reset"
        type="reset"
        flat
        color="primary"/>
      <q-btn
        label="Register"
        type="submit"
        color="primary"/>
    </div>
  </form>
</template>

<script>
import {mapActions} from "vuex";

export default {
  data() {
    return {
      formData: {
        email: '',
        password: '',
        profilePic: null,
        firstName: '',
        lastName: '',
        id: '',
      }
    }
  },
  methods: {
    ...mapActions('users', ['getUserInfo']),
    ...mapActions('auth', ['registerUser']),
    isValidEmailAddress(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    submitForm() {
      this.$refs.email.validate()
      this.$refs.password.validate()
      if (!this.$refs.email.hasError && !this.$refs.password.hasError) {
        this.registerUser(this.formData)
          .then(userId => {
            this.getUserInfo(userId)
            this.$q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: 'Signed up'
            })
          }).catch(err => console.log(err))
      }
    },
    onReset() {
      this.formData.email = null
      this.formData.password = null
      this.formData.profilePic = null
      this.formData.firstName = null
      this.formData.lastName = null
    }
  }
}
</script>

<style scoped>

</style>
