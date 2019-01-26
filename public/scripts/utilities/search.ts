var handleSearchChange = (event: Event) => {
  if (!event.target) return;

  var value = (event.target as HTMLInputElement).value.toLowerCase();
  let dreamsList = [...$(".dream-list")[0].children];
  dreamsList.filter(dream => {
    $(dream).toggle(
      $(dream)
        .text()
        .toLowerCase()
        .indexOf(value) > -1
    );
  });
};
