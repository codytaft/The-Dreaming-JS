var statusElt = document.getElementById('status');
var transcriptElt = document.getElementById('query');
var searchElt = document.getElementById('search');
var saveDirections = document.getElementById('saveDirectionsText');
var clientID = 'RiMx52JTjy6L9At1dnmk3A==';
var conversationState = null;
var voiceRequest = null;
var textResult;

$(document).ready(function() {
  statusElt.value = '';
  transcriptElt.value = '';
  // searchElt.value = '';
});

// Houndify Audio Recorder
var recorder = new Houndify.AudioRecorder();
recorder.on('start', function() {
  //Initialize VoiceRequest
  voiceRequest = initVoiceRequest(recorder.sampleRate);
  document.getElementById('voiceIcon').className =
    'selected radio icon big red';
});

recorder.on('data', function(data) {
  voiceRequest.write(data);
});

recorder.on('end', function() {
  voiceRequest.end();
  statusElt.innerText = 'Stopped recording. Waiting for response...';
  document.getElementById('voiceIcon').className = 'unmute big icon';
  document.getElementById('textSaveButton').disabled = false;
  document.getElementById('query').readOnly = false;
});

recorder.on('error', function(error) {
  voiceRequest.abort();
  statusElt.innerText = 'Error: ' + error;
  document.getElementById('voiceIcon').className = 'unmute big icon';
  document.getElementById('textSaveButton').disabled = false;
  document.getElementById('query').readOnly = false;
});

//Initialiaze voice request
function initVoiceRequest(sampleRate) {
  // responseElt.parentNode.hidden = true;
  // infoElt.parentNode.hidden = true;

  let voiceRequest = new Houndify.VoiceRequest({
    //Your Houndify Client ID
    clientId: clientID,

    //For testing environment you might want to authenticate on frontend without Node.js server.
    //In that case you may pass in your Houndify Client Key instead of "authURL".
    //clientKey: "YOUR_CLIENT_KEY",

    //Otherwise you need to create an endpoint on your server
    //for handling the authentication.
    //See SDK's server-side method HoundifyExpress.createAuthenticationHandler().
    authURL: '/houndifyAuth',

    //REQUEST INFO JSON
    //See https://houndify.com/reference/RequestInfo
    requestInfo: {
      UserID: 'test_user',
      Latitude: 37.388309,
      Longitude: -121.973968
    },

    //Pass the current ConversationState stored from previous queries
    //See https://www.houndify.com/docs#conversation-state
    conversationState: conversationState,

    //Sample rate of input audio
    sampleRate: sampleRate,

    //Enable Voice Activity Detection
    //Default: true
    enableVAD: true,

    //Partial transcript, response and error handlers
    onTranscriptionUpdate: onTranscriptionUpdate,
    onResponse: function(response, info) {
      recorder.stop();
      onResponse(response, info);
    },
    onError: function(err, info) {
      recorder.stop();
      onError(err, info);
    }
  });
  return voiceRequest;
}

function onMicrophoneClick() {
  if (recorder && recorder.isRecording()) {
    recorder.stop();
    return;
  }

  recorder.start();
  statusElt.innerText = 'Streaming voice request...';
  document.getElementById('voiceIcon').className =
    'loading circle notched icon big';
  document.getElementById('textSaveButton').disabled = true;
  document.getElementById('query').readOnly = true;
}

//Fires after server responds with Response JSON
//Info object contains useful information about the completed request
//See https://houndify.com/reference/HoundServer
function onResponse(response, info) {
  if (response.AllResults && response.AllResults.length) {
    //Pick and store appropriate ConversationState from the results.
    //This example takes the default one from the first result.
    conversationState = response.AllResults[0].ConversationState;
  }

  textResult = response.AllResults[0].WrittenResponse;
  statusElt.innerText = textResult;
  statusElt.contentEditable = true;
  saveDirections.hidden = false;
  saveDirections.innerText =
    'Edit dream text above and click save when finished';

  // responseElt.parentNode.hidden = false;
  // responseElt.value = response.stringify(undefined, 2);
  // infoElt.parentNode.hidden = false;
  // infoElt.value = JSON.stringify(info, undefined, 2);
}

//Fires if error occurs during the request
function onError(err, info) {
  statusElt.innerText = 'Error: ' + JSON.stringify(err);
  // responseElt.parentNode.hidden = true;
  // infoElt.parentNode.hidden = false;
  // infoElt.value = JSON.stringify(info, undefined, 2);
}

//Fires every time backend sends a speech-to-text
//transcript of a voice query
//See https://houndify.com/reference/HoundPartialTranscript

function onTranscriptionUpdate(transcript) {
  transcriptElt.value = transcript.PartialTranscript;
}

//Save dream to database on click
function onSaveClick() {
  let date = document.getElementById('date-input').value;
  let dream = statusElt.innerText;
  saveDreamToDatabase(date, dream);
  console.log(dream);
  $('.dream-list').prepend(`
  <li class="dream-list-item">
  <h4>${date.slice(0, 10)}</h4>
  <p>${dream}</p>
  `);
}
