!function() {
  var db;
  var currentUser;
  var activities;

  var currentDate = new Date();
  currentDate.setHours(0);
  currentDate.setMinutes(0);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);

  var activityField = document.getElementById('activity');
  var hoursField = document.getElementById('hours');
  var addBtn = document.getElementById('add');
  var statsBtn = document.getElementById('stats-btn');

  addBtn.onclick = function() {
    if (activityField.value && hoursField.value) {
      addActivity({
        activity: activityField.value,
        hours: hoursField.value
      });
    }
  };

  statsBtn.onclick = function() {
    var root = '/';
    if (window.location.host === 'tshrestha.github.io') {
      root += 'friendly-xmas-challenge/';
    }

    window.location = root + 'stats';
  };

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      currentUser = user;
      console.log('User ' + user.displayName + ' signed in.');
      db = firebase.database();
      fetchActivities(user);
    } else {
      window.location = window.location.host === 'tshrestha.github.io'
        ? '/friendly-xmas-challenge'
        : '/';
    }
  });

  function fetchActivities(user) {
    db.ref('users/' + user.displayName).on('value', function(res) {
      if (res.val()) {
        activities = res.val().activities;

        if (activities) {
          displayActivities(activities);
        }
      }
    });
  }

  function addActivity(activity) {
    if (!activities) {
      activities = {};
    }

    var dateStr = (currentDate.getMonth() + 1) + '-' + currentDate.getDate() + '-' + currentDate.getFullYear();
    if (!activities[dateStr]) {
      activities[dateStr] = [];
    }

    activities[dateStr].unshift(activity);
    db.ref('users/' + currentUser.displayName + '/activities').set(activities);
  }

  function updateActivities() {
    db.ref('users/' + currentUser.displayName + '/activities').set(activities);
  }

  function displayActivities(activities) {
    var el = document.getElementById("activities");
    document.getElementById('no-activities').hidden = true;

    var list = '';
    for (var timestamp in activities) {
      if (activities.hasOwnProperty(timestamp)) {
        list += '<div class="card activities-by-day">'
          + '<div class="card-body"><h4>' + getDateLabel(timestamp) + '</h4></div>'
          + "<ul class='list-group list-group-flush'>";

        activities[timestamp].forEach(function(a) {
          list += '<li class="list-group-item flex-column align-items-center">' +
            '<div class="d-flex w-100 justify-content-between">' +
            startCase(a.activity) +
            '<span class="text-muted small">' +
            '<input id="' + a.activity + '-' + timestamp +
            '" type="number" class="form-control form-control-sm hours-logged" value="' + parseFloat(a.hours) + '">&nbsp;Hrs' +
            '</span></div></li>'
        });

        list += '</ul></div>';
      }
    }

    el.innerHTML = list;
    setUpdateListeners(document.getElementsByClassName('hours-logged'));
  }

  function setUpdateListeners(inputs) {
    for (var i = 0; i < inputs.length; i++) {
      inputs.item(i).onchange = function() {
        if (this.value >= 0) {
          var id = this.id.split('-');
          var activity = id[0];
          var timestamp = id.length > 2 ? id.slice(1).join('-') : id[1];

          activities[timestamp]
            .filter(function(a) { return a.activity === activity; })[0].hours = this.value;

          updateActivities();
        }
      }
    }
  }

  function getDateLabel(timestamp) {
    var date = new Date();
    var ad = parseDate(timestamp);

    var today = {
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear()
    };

    date.setDate(date.getDate() - 1);
    var yesterday = {
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear()
    };

    if (ad.getDate() === today.date && ad.getMonth() === today.month && ad.getFullYear() === today.year) {
      return 'Today'

    } else if (ad.getDate() === yesterday.date && ad.getMonth() === yesterday.month && ad.getFullYear() === yesterday.year) {
      return 'Yesterday';
    }

    return ad.toLocaleDateString();
  }

  function parseDate(date) {
    // MM-DD-YYYY
    if (isNaN(date)) {
      var parts = date.split('-');
      return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]))
    }

    // Milliseconds
    return new Date(parseInt(date));
  }

  function startCase(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }
}();