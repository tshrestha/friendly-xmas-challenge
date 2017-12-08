!function() {
  var signInBtn = document.getElementById("signin");
  var emailInput = document.getElementById("email");
  var passwordInput = document.getElementById("password");

  signInBtn.onclick = function() {
    authenticate(emailInput.value, passwordInput.value);
  };

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var host = window.location.host;
      var root = '/';

      if (host === 'tshrestha.github.io') {
        root += 'friendly-xmas-challenge/'
      }
      window.location = root + 'activities'
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
    console.error(error.code);
    console.error(error.message);
  }
}();