handleSearchChange = event => {
  const value = event.target.value.toLowerCase();
  let dreamsList = [...$('.dream-list')[0].children];
  dreamsList.filter(dream => {
    $(dream).toggle(
      $(dream)
        .text()
        .toLowerCase()
        .indexOf(value) > -1
    );
  });
};
