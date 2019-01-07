saveDreamToDatabase = async (date, dream) => {
  try {
    const url = window.location.href + `api/v1/dreams`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: date,
        dream: dream
      })
    });
    const newDream = await response.json();
    return await newDream;
  } catch (error) {
    console.log(error);
  }
};

getAllDreams = async () => {
  try {
    const url = window.location.href + `api/v1/dreams`;
    const response = await fetch(url);
    const data = await response.json();
    return await Promise.resolve(data);
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
    console.log('Signed in as: ' + xhr.responseText);
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
    console.log(await newUser);
  } catch (error) {
    console.log(error);
  }
};
