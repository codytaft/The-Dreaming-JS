displayDreams = dreams => {
  console.log(dreams);
  $(document).ready(function() {
    $('.dream-list').empty();
    dreams.forEach(dream => {
      $('.dream-list').prepend(`
          <li id=${dream.dream_id} class="dream-list-item">
            <h4 class="dream-date">${dream.date.slice(
              0,
              10
            )}<i class="far fa-trash-alt" onclick="onTrashClick(event)"></i></h4>
            <p class="dream-text">${dream.dream}</p>
            `);
    });
  });
};
