var SheetsImporter = function() {
  function SheetsExporter() {}

  SheetsExporter.prototype.export = function(callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        var activities = parseSheet(JSON.parse(xhr.response).values);
        callback(activities);
      }
    };

    xhr.open('GET', 'https://sheets.googleapis.com/v4/spreadsheets/1YgroX9iObzokZj-br4Hskdr-eS0V6iAQWvPpeRxfe4g/values/Sheet1?key=AIzaSyAQS329VRzo3cEyXwLbzwA_ulmMLf-skq4');
    xhr.send();
  };

  return SheetsExporter;

  function parseSheet(values) {
    var dates = [];
    for (var i = 7; i <= 21; i++) {
      dates.push('12-' + i + '-2017');
    }

    var schema = {
      "girls": {
        "start": 2,
        "stop": 10,
        "name": 0
      },
      "boys": {
        "start": 13,
        "stop": 21,
        "name": 0
      }
    };

    var activities = {};
    setActivities(schema.boys, values, dates, activities);
    setActivities(schema.girls, values, dates, activities);

    return activities;
  }

  function setActivities(schema, values, dates, activities) {
    for (var j = schema.start; j < schema.stop; j++) {
      var user = values[j][schema.name].toLowerCase();
      if (user === 'mikey dee') user = 'michael';
      if (user === 'modak') user = 'mark';
      if (user === 'lexi') user = 'alexis';

      var loggedActivities = values[j].slice(1);
      if (loggedActivities && loggedActivities.length) {
        var buckets = [];
        for (var i = 0; i < loggedActivities.length; i += 2) {
          buckets.push([loggedActivities[i], loggedActivities[i + 1]])
        }

        dates.forEach(function(d, k) {
          var bucket = buckets[k];
          if (bucket && bucket[0] && bucket[1]) {
            var hours = bucket[0];
            var activity = bucket[1];

            if (!activities[user]) activities[user] = {};
            if (!activities[user][d]) activities[user][d] = [];

            activities[user][d].push({
              hours: hours,
              activity: activity
            })
          }
        });
      }
    }
  }
}();