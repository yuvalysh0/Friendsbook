//dependencies
let cors = require('cors')
const express = require('express')
const admin = require('firebase-admin');
let inspect = require('util').inspect;
let Busboy = require('busboy');
let path = require('path')
let os = require('os')
let fs = require('fs')
let UUId = require('uuid-v4')

//config - express

const app = express()
app.use(cors())

//config - firebase
const serviceAccount = require("serviceAccountKey.json");



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'friends-book-94ac5.appspot.com',
  databaseURL: "https://friends-book-94ac5-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.firestore();
let bucket = admin.storage().bucket()

//endpoint - posts

app.get('/posts', (request, response) => {
  response.set('Access-Control-Allow-Origin', '*')
  let posts = []
  db.collection('posts').orderBy('date', 'desc').get().then(snapshot => {
    snapshot.forEach((doc) => {
      posts.push(doc.data())
    })
    response.send(posts)
  });
})

//endpoint - createPost

app.post('/createPost', (request, response) => {
  response.set('Access-Control-Allow-Origin', '*')

  let uuid = UUId()

  var busboy = new Busboy({headers: request.headers});

  let fields = {}
  let fileData = {}

  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
    // /tmp/123123-123123.png
    let filePath = path.join(os.tmpdir(), filename)
    file.pipe(fs.createWriteStream(filePath))
    fileData = {filePath, mimetype}
  });

  busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    fields[fieldname] = val
  });

  busboy.on('finish', function () {

    bucket.upload(
      fileData.filePath,
      {
        uploadType: 'media',
        metadata: {
          metadata: {
            contentType: fileData.mimetype,
            firebaseStorageDownloadTokens: uuid
          }
        }
      },
      (err, uploadedFile) => {
        if (!err) {
          createDocument(uploadedFile)
        }
      }
    )

    function createDocument(uploadedFile) {
      db.collection('posts').doc(fields.id).set({
        id: fields.id,
        caption: fields.caption,
        location: fields.location,
        userId: fields.userId,
        date: parseInt(fields.date),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${uploadedFile.name}?alt=media&token=${uuid}`
      }).then(() => {
        response.send('Post Added: ' + fields.id)
      })
    }
  })

  request.pipe(busboy);
})


//listen

app.listen(process.env.PORT || 3000)
