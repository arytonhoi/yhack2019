'use strict';

function filter(json_filename, filter) {
  const fs = require('fs');

  let rawdata = fs.readFileSync(json_filename);
  let jsondata = JSON.parse(rawdata);
  let results = jsondata.results;

  var matches = [];

  for (var i = 0; i < results.length; i++) {
    let result = results[i];
    if (result.keywords.includes(filter)) {
      var match = {};

      var sentiment;
      if (result.sentiment_score < 0) {
        sentiment = 'negative';
      } else {
        sentiment = 'positive';
      }

      match["username"] = result.username;
      match["source"] = result.source;
      match["sentiment"] = sentiment;
      match["location"] = result.location[0];
      match["content"] = result.content;    

      matches.push(result)
    }
  }
  return matches
}

filter('data/test/refined_tripad_test.json', 'flight')