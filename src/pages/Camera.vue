<template>
  <q-page>
    <div class="row q-col-gutter-lg constrain" style="justify-content: center;">
      <div class="camera-frame q-pa-md">
        <video
            v-show="!imageCaptured"
            class="full-width"
            autoplay
            playsinline
            ref="video"
        />
        <canvas
            v-show="imageCaptured"
            ref="canvas"
            class="full-width"
            height="240"
        />
      </div>
      <div class="text-center q-pa-md" style="width: 600px">
        <q-btn
            v-if="hasCameraSupport"
            @click="captureImage()"
            color="primary"
            icon="photo_camera"
            :disable="imageCaptured"
            round
            size="lg"
        />
        <q-file
            v-else
            v-model="imageUpload"
            @input="captureImageFallback"
            outlined
            label="Choose an image"
            accept="image/*"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file"/>
          </template>
        </q-file>
        <div class="row justify-center q-ma-md">
          <q-input
              v-model="post.caption"
              class="col col-sm-6"
              label="Caption *"
              dense
          />
        </div>
        <div class="row justify-center q-ma-md">
          <q-input
              v-model="post.location"
              class="col col-sm-6"
              label="Location"
              :loading="loadingState"
              dense>
            <template v-slot:append>
              <q-btn
                  @click="getLocation()"
                  v-if="!loadingState && locationSupported"
                  round
                  dense
                  icon="place"
                  flat
              />
            </template>
          </q-input>
        </div>
        <div class="row justify-center q-mt-lg">
          <q-btn
              unelevated
              rounded
              color="primary"
              @click="addPost(user.id)"
              label="Post Image"
              :disable="!imageCaptured || !post.caption"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import {uid} from 'quasar'
import {mapState, mapActions} from 'vuex'

require('md-gum-polyfill')
export default {
  name: "Camera",
  data() {
    return {
      post: {
        id: uid(),
        caption: '',
        location: '',
        photo: null,
        date: Date.now(),
        userId: user.id
      },
      imageCaptured: false,
      imageUpload: [],
      hasCameraSupport: true,
      loadingState: false
    }
  },

  computed: {
    ...mapState('users', ['user']),
    locationSupported() {
      return 'geolocation' in navigator
    }
  },

  methods: {
    ...mapActions('users', ['getUserInfo']),
    initCamera() {
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(stream => {
        this.$refs.video.srcObject = stream;
      }).catch(err => {
        this.hasCameraSupport = false
      })
    },
    captureImage() {
      let video = this.$refs.video;
      let canvas = this.$refs.canvas;
      canvas.width = video.getBoundingClientRect().width;
      canvas.height = video.getBoundingClientRect().height;
      let context = canvas.getContext('2d')
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      this.imageCaptured = true;
      this.post.photo = this.dataURItoBlob(canvas.toDataURL())
      this.disableCamera();
    },
    captureImageFallback(file) {
      this.post.photo = file;

      let canvas = this.$refs.canvas;
      let context = canvas.getContext('2d')

      var reader = new FileReader();
      reader.onload = event => {
        var img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          this.imageCaptured = true;
        }
        img.src = event.target.result;
      }
      reader.readAsDataURL(file);
    },
    disableCamera() {
      this.$refs.video.srcObject.getVideoTracks().forEach(track => {
        track.stop()
      })
    },
    dataURItoBlob(dataURI) {
      var byteString = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ab], {type: mimeString});
      return blob;

    },
    getLocation() {
      this.loadingState = true;
      navigator.geolocation.getCurrentPosition(position => {
        this.getCityAndCountry(position)
      }, err => {
        this.locationError()
      }, {timeout: 7000})
    },
    getCityAndCountry(position) {
      let apiUrl = `https://geocode.xyz/${position.coords.latitude},${position.coords.longitude}?json=1`
      this.$axios.get(apiUrl).then(result => {
        this.locationSuccess(result)
      }).catch(err => {
        this.locationError()
      })
    },
    locationSuccess(result) {
      this.post.location = result.data.city;
      if (result.data.country) {
        this.post.location += `, ${result.data.country}`
      }
      this.loadingState = false;
    },
    locationError() {
      this.$q.dialog({
        title: 'Error',
        message: 'Could not find your location'
      })
      this.loadingState = false;
    },
    addPost(userId) {
      this.$q.loading.show()
      let formData = new FormData()
      formData.append('id', this.post.id)
      formData.append('caption', this.post.caption)
      formData.append('location', this.post.location)
      formData.append('date', this.post.date)
      formData.append('userId', userId)
      formData.append('file', this.post.photo, this.post.id + '.png')

      this.$axios.post('http://localhost:3000/createPost', formData)
          .then(response => {
            console.log(response)
            this.$router.push('/')
            this.showNotify()
            this.$q.loading.hide()

          }).catch(err => {
        this.$q.dialog({
          title: 'Error',
          message: 'Could not create post!'
        })
        this.$q.loading.hide()
      })
    },
    showNotify() {
      this.$q.notify({
        message: 'The photo was added successfully!',
        color: 'secondary',
        actions: [
          {
            label: 'Dismiss', color: 'white'
          }
        ]
      })
    }
  },


  mounted() {
    this.initCamera()
    this.getUserInfo(this.$q.localStorage.getItem('userId'))
  },

  beforeDestroy() {
    if (this.hasCameraSupport) {
      this.disableCamera();
    }
  }

}
</script>

<style scoped>

</style>
