function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();

  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;

  let authenticated = googleAuthenticate(id_token);
  //Display info on login
  if (authenticated) {
    $('#app-display').toggle();
    $('#signout-button').toggle();
    $('.g-signin2').toggle();
  } else {
    $('.login-error')
      .toggle()
      .innerText('Please try to login again');
  }
}

//Google sign out
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    console.log('User signed out.');
  });
  logoutUser();
  $('#signout-button').toggle();
  $('.g-signin2').toggle();
  $('#app-display').toggle();
}
