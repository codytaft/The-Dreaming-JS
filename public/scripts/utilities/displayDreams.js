$(document).ready(function() {
  dreamsPromise.then(dreams => {
    dreams.forEach(dream => {
      $('.dream-list').prepend(`
        <li id=${dream.id} class="dream-list-item">
          <h4>${dream.date.slice(0, 10)}</h4>
          <p>${dream.dream}</p>
          `);
    });
  });
});
