// let dreamsPromise = Promise.resolve(getAllDreams());

// dreamsPromise
//   .then(dreams => {
//     return dreamCounter(dreams);
//   })
//   .then(filteredWords => {
//     let myData = {
//       type: 'wordcloud',
//       options: {
//         words: filteredWords
//       }
//     };
//     return myData;
//   })
//   .then(cloudData => {
//     zingchart.render({
//       id: 'myChart',
//       data: cloudData,
//       height: 200,
//       width: '100%'
//     });
//   });
