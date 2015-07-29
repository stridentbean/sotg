var frequency = {};

var testfunc = function() {
  for (var i = 0; i < data.length; i++) {
    var tweet = data[i].text.split(" ");
    var sentiment = data[i].sentiment;
    for(var j = 0; j < tweet.length; j++) {
      var word = tweet[j];
      if(frequency[word]) {
        frequency[word][0] = frequency[word][0] + 1;
        frequency[word][1] = frequency[word][1] + sentiment;
      } else {
        frequency[word] = [1, sentiment];        
      }
    }
  }

  var formattedWord = [];
  for(var key in frequency) {
    if(frequency[key][0] > 1 && key !== "pizza" && key !== "Pizza" && key.length > 3) {
      formattedWord.push({"text": key, "size": frequency[key][0] * 9, 
        "sentiment" : frequency[key][1]/frequency[key][0]});
    }
  }
  return formattedWord;
};
