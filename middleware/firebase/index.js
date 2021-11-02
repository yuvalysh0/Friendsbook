import firebase from "firebase/compat";
import auth from 'firebase/auth'
import {uid} from "quasar";

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })


/* TODO
* HARDCODE YOUR CREDENTIALS FOR KNOW,
* BECAUSE I DONT WANT U TO WASTE ANY MORE TIME
* LATER ON, FIGURE A WAY TO FIX THE .ENV SITUATION
* I WILL HELP YOU TOO.
* KEEP UP WITH THE GOOD WORK <3
* P.S :
* DONT EAT YOUR BF'S TUNA SANDWITCHES ..
* */

// firebase.initializeApp({
//   apiKey: process.env.FB_API_KEY,
//   authDomain: process.env.FB_AUTH_DOMAIN,
//   databaseURL: process.env.FB_DATABASE_URL,
//   projectId: process.env.FB_PROJECT_IDL,
//   storageBucket: process.env.FB_STORAGE_BUCKET,
//   messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
//   appId: process.env.FB_APP_ID
// })

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
  deleteComment,
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
  deletePost,
  deleteAllUserPosts,
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
        createNewUser(newUser, url, userId)
      }).catch((error) => {
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
    if (!snapshot.val().whoLikedit) {
      arr = []
    } else {
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

async function deletePost(postId) {
  await realtimeDatabase.ref(`posts/${postId}`).remove().then(() => {
    console.log('post deleted from realTimeDB')
  })
  await realtimeDatabase.ref(`comments/${postId}`).remove().then(() => {
    console.log('comments were removed from realTimeDB')
  })
  await db.collection('posts').doc(`${postId}`).delete().then(() => {
    console.log("post successfully deleted!");
  }).catch((error) => {
    console.error("Error removing document: ", error);
  })
}

async function deleteAllUserPosts(userId) {
  await db.collection('posts').get().then(snapshot => {
    snapshot.forEach((doc) => {
      if (doc.data().userId === userId) {
        this.deletePost(doc.data().id).then(() => {
          console.log('the post was deleted. ')
        })
      }
    })
  });
}

function getRef(postId) {
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
  return await realtimeDatabase.ref(`comments/${postId}`).orderByChild('date').once('value').then((snapshot) => {
    return snapshot.val()
  }).catch(err => {
    console.log(err)
  })
}

async function addComment(comment, postId, userId) {
  let date = Date.now()
  await getUserInfo(userId).then(res => {
    let user = res
    realtimeDatabase.ref(`comments/${postId}/${date}`).set({
      date: date,
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

async function deleteComment(postId, comment) {
  await realtimeDatabase.ref(`comments/${postId}/${comment.date}`).remove().then(() => {
    console.log('The comment was removed! :) ')
    this.getComments()
  }).catch(err => {
    console.log(err)
  })
}
