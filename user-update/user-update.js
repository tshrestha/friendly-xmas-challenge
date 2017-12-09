!function() {
  var update;

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      user.updateProfile(update);
    }
  });

  function authenticate(email, password) {
    if (email && password) {
      firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .catch(authFailure)
    }
  }

  function authFailure(error) {
    console.log(error);
  }

  return function update(email, password, updateObj) {
    update = updateObj;
    authenticate(email, password);
  }
}();