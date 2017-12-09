!function() {
  // firebase.auth().onAuthStateChanged(function(user) {
  //   if (user) {
  //     user.updateProfile({
  //       // update obj
  //     });
  //   }
  // });

  function authenticate(email, password) {
    firebase.auth().signOut();

    if (email && password) {
      firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .catch(authFailure)
    }
  }

  function authFailure(error) {
    console.log(error);
  }
}();