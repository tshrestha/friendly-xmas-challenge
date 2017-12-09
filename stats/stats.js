!function() {
  document.getElementById('activities-btn').onclick = function() {
    var root = '/';
    if (window.location.host === 'tshrestha.github.io') {
      root += 'friendly-xmas-challenge/';
    }

    window.location = root + 'activities';
  };

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      fetchStats();
    }
  });

  function fetchStats() {
    var db = firebase.database();
    db.ref('users').on('value', function(res) {
      var data = res.val();
      console.log(data);
    });
  }
}();