import firebase from "firebase/compat";

export default {
  firebase,
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


function setNewPost() {
}

