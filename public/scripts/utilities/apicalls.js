let currentUser;
saveDreamToDatabase = async (date, dream) => {
  try {
    const url = window.location.href + `api/v1/dreams`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: date,
        dream: dream,
        user_id: currentUser.user_token
      })
    });
    const newDream = await response.json();
    return await newDream;
  } catch (error) {
    console.log(error);
  }
};

getUserDreams = async user => {
  try {
    const url =
      window.location.href + `api/v1/users/${user.user_token}/user_token`;
    const response = await fetch(url);
    const data = await response.json();
    currentUser = user;
    makeWordCloud(data);
    displayDreams(data);
  } catch (error) {
    console.log(error);
  }
};

googleAuthenticate = async id_token => {
  var xhr = await new XMLHttpRequest();
  const authUrl = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id_token}`;
  xhr.open('POST', authUrl);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send('idtoken=' + id_token);
  xhr.onload = await function() {
    addUser(xhr.responseText, id_token);
  };
};

addUser = async (responseText, token) => {
  try {
    const url = window.location.href + `api/v1/users`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userResponse: responseText,
        token: token
      })
    });
    const newUser = await response.json();
    getUserDreams(newUser);
  } catch (error) {
    console.log(error);
  }
};

makeWordCloud = dreams => {
  const filteredWords = dreamCounter(dreams);
  let cloudData = {
    type: 'wordcloud',
    options: {
      words: filteredWords
    }
  };
  $(document).ready(function() {
    zingchart.render({
      id: 'myChart',
      data: cloudData,
      height: 200,
      width: '100%'
    });
  });
};

displayDreams = dreams => {
  $(document).ready(function() {
    dreams.forEach(dream => {
      $('.dream-list').prepend(`
          <li id=${dream.id} class="dream-list-item">
            <h4>${dream.date.slice(0, 10)}</h4>
            <p>${dream.dream}</p>
            `);
    });
  });
};
