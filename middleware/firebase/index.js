import firebase from "firebase/compat";
import auth from 'firebase/auth'
import {uid} from "quasar";


firebase.initializeApp({
  apiKey: "AIzaSyCMy8DkMnj8iUsis3MhLzy9TwVHCwB--vo",
  authDomain: "friends-book-94ac5.firebaseapp.com",
  databaseURL: "https://friends-book-94ac5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "friends-book-94ac5",
  storageBucket: "friends-book-94ac5.appspot.com",
  messagingSenderId: "435702556828",
  appId: "1:435702556828:web:b0aec9fc32243158a32559"
})

export default {
  getRef,
  getComments,
  addComment,
  addPhotoToDb,
  firebase,
  getWhoLikedThePost,
  addLike,
  deleteLike,
  addOrDeleteLike,
  getAllLikes,
  uploadProfilePictureToStorage,
  getPosts,
  getPostsById,
  getUserInfo,
  getProfilePictureFromDb: (userId) => {
    db.collection('users').doc(userId).get().then(
      user => {
        let userData = user.data()
        return userData.profilePic;
      })
  }

}

let realtimeDatabase = firebase.database();
let db = firebase.firestore();

function uploadProfilePictureToStorage(file, userId, newUser) {
  const storageRef = firebase.storage().ref().child(`${userId}`).child('profilePicture');
  storageRef.put(file).then((snapshot) => {
    storageRef.getDownloadURL()
      .then((url) => {
        // Insert url into an <img> tag to "download"
        createNewUser(newUser, url, userId)
      }).catch((error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          break;
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;

        // ...

        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
      }
    })
  })
}

function createNewUser(newUser, pictureLink, userId) {
  let user = {
    email: newUser.email,
    password: newUser.password,
    profilePic: pictureLink,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    id: userId
  }
  db.collection('users').doc(user.id).set(user)
    .then(() => {
    }).catch((error) => {
    console.error("Error writing document: ", error);
  });
}

function getUserInfo(id) {
  let user = []
  return db.collection('users').doc(id).get().then(user => {
    return user.data();
  })
}

function getPosts() {
  let posts = []
  return db.collection('posts').orderBy('date', 'desc').get().then(snapshot => {
    snapshot.forEach((doc) => {
      posts.push(doc.data())
    })
    return posts
  });
}

async function addLike(postId, userId, likes) {
  let arr = await realtimeDatabase.ref(`posts/${postId}`).get().then(snapshot => {
    if (!snapshot.val().whoLikedit){
      arr = []
    }
    else {
      arr = snapshot.val().whoLikedit
    }
    arr.push(userId)
    realtimeDatabase.ref(`posts/${postId}`).set({allLikes: likes, whoLikedit: arr}).then(() => {
      console.log('arr add like: ', arr)
    })
  })
}

async function deleteLike(postId, userId, likes) {
  let arr = await realtimeDatabase.ref(`posts/${postId}`).get().then(snapshot => {
    arr = snapshot.val().whoLikedit
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === userId)
        arr.splice(i, 1)
    }
    realtimeDatabase.ref(`posts/${postId}`).set({allLikes: likes, whoLikedit: arr}).then(() => {
      console.log('arr delete like: ', arr)
    })
  })
}

async function addOrDeleteLike(postId, userId, func) {
  let likes = await this.getAllLikes(postId)
  let arr = []
  if (func === 'add') {
    addLike(postId, userId, ++likes).then(() => {
      console.log('add like in addOrDeleteLike - index')
    })
  } else {
    deleteLike(postId, userId, --likes).then(() => {
      console.log('delete like in addOrDeleteLike - index')
    })
  }
}

function getPostsById(id) {
  let posts = []
  return db.collection('posts').orderBy('date', 'desc').get().then(snapshot => {
    snapshot.forEach((doc) => {
      if (doc.data().userId === id) {
        posts.push(doc.data())
      }
    })
    return posts
  });
}

function getWhoLikedThePost(postId, userId) {
  return realtimeDatabase.ref(`posts/${postId}`).once('value').then((snapshot) => {
    let arr = snapshot.val().whoLikedit
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === userId) {
        return true
      }
    }
    return false
    // ...
  }).catch(err => {
    console.log(err)
  });
}

function getRef(postId){
  return realtimeDatabase.ref(`posts/${postId}`)
}

async function getAllLikes(postId) {
  return await realtimeDatabase.ref(`posts/${postId}`).once('value').then((snapshot) => {
    return snapshot.val().allLikes
    // ...
  }).catch(err => {
    console.log(err)
  });
}

async function addPhotoToDb(postId) {
  await realtimeDatabase.ref(`posts/${postId}`).set({
    allLikes: 0,
    whoLikedit: []
  }).then(() => {
    console.log('The post was added to real time db')
  })
}

async function getComments(postId) {
  return await realtimeDatabase.ref(`comments/${postId}`).once('value').then((snapshot) => {
    return snapshot.val()
  }).catch(err => {
    console.log(err)
  })
}

async function addComment(comment, postId, userId) {
  await getUserInfo(userId).then(res => {
    let user = res
    realtimeDatabase.ref(`comments/${postId}/${uid()}`).set({
      date: Date.now(),
      text: comment,
      userId: {
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id,
        profilePic: user.profilePic
      }
    })
  })
}
