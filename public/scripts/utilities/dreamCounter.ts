var dreamCounter = (dreams: Dream[]) => {
  let dreamWordsCount: { [n: string]: number; } = {};
  for (let dream of dreams) {
    const dreamWords = dream.dream.split(' ');
    for (let word of dreamWords) {
      let letterNumberOnlyArray = word.match(/[a-zA-Z0-9]/g);
      if (letterNumberOnlyArray) {
        let lowerCaseWord = letterNumberOnlyArray.join('').toLowerCase();
        if (!dreamWordsCount[lowerCaseWord]) {
          dreamWordsCount[lowerCaseWord] = 1;
        } else {
          dreamWordsCount[lowerCaseWord]++;
        }
      }
    }
  }

  let filteredWords = rangeOfWords(dreamWordsCount);

  // let dreamWordArray = filteredWords.map(word => {
  //   return { text: [word], count: filteredWords[word] };
  // });

  return filteredWords;
};

var rangeOfWords = (words: { [n: string]: number }) => {
  let wordArrayTotal = [];
  let wordArray = [];
  for (let word in words) {
    if (words[word]) {
      wordArrayTotal.push({ [word]: words[word] });
    }
    if (words[word] < 25 && words[word] >= 1) {
      wordArray.push({ text: [word], count: words[word] });
    }
  }
  return wordArray;
  // return wordArray.sort((a, b) => {
  //   return Object.values(b)[0] - Object.values(a)[0];
  // });
};
