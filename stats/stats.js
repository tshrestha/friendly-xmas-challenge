!function() {
  var thb = document.getElementById('total-hours-boys');
  var thg = document.getElementById('total-hours-girls');

  var lbb = document.getElementById('leader-board-boys');
  var lbg = document.getElementById('leader-board-girls');

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
      var boys = [];
      var girls = [];

      var totalsByUser = {
        boys: [],
        girls: []
      };

      for (var user in data) {
        if (data.hasOwnProperty(user)) {
          if (data[user].team === 'boys') {
            boys.push(data[user]);
          } else {
            girls.push(data[user]);
          }

          totalsByUser[data[user].team].push(getTotalsByUser(user, data[user].activities));
        }
      }

      var activities = {
        boys: getActivities(boys),
        girls: getActivities(girls)
      };

      totalsByUser.boys.sort(sortDesc);
      totalsByUser.girls.sort(sortDesc);

      displayTotalHours(activities);
      displayLeaderBoard(totalsByUser);
    });
  }

  function sortDesc(a, b) {
    return b.total - a.total;
  }

  function displayTotalHours(activities) {
    thb.innerHTML = activities.boys.reduce(sum, 0) + ' Hrs';
    thg.innerHTML = activities.girls.reduce(sum, 0) + ' Hrs';

    function sum(total, value) {
      return total + (parseFloat(value.hours || 0));
    }
  }

  function displayLeaderBoard(totals) {
    console.log(totals);
    for (var team in totals) {
      var rows = '';

      if (totals.hasOwnProperty(team)) {
        totals[team].forEach(function(t) {
          rows += '<tr><td>' + t.user + '</td>' +
            '<td class="text-right">' + t.total + '</td></tr>'
        });
      }

      if (team === 'boys') {
        lbb.innerHTML = rows;
      } else {
        lbg.innerHTML = rows;
      }
    }
  }

  function getTotalsByUser(user, activities) {
    if (!activities) {
      return {user: user, total: 0};
    }

    var total = 0;
    for (var ts in activities) {
      if (activities.hasOwnProperty(ts)) {
        activities[ts].forEach(function(a) {
          total += parseFloat(a.hours);
        });
      }
    }

    return {user: user, total: total}
  }

  function getActivities(users) {
    var activities = [];

    users.forEach(function(u) {
      if (u.activities) {
        for (var timestamp in u.activities) {
          if (u.activities.hasOwnProperty(timestamp)) {
            activities = activities.concat(u.activities[timestamp]);
          }
        }
      }
    });

    return activities;
  }
}();