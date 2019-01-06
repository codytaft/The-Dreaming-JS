let statusElt = document.getElementById('status');
let recordingUpdate = document.getElementById('recordingUpdate');
let searchElt = document.getElementById('search');
let voiceIcon = document.getElementById('voiceIcon');
let textSaveButton = document.getElementById('textSaveButton');
let dateInput = document.getElementById('date-input');
let clientID = 'RiMx52JTjy6L9At1dnmk3A==';
let conversationState = null;
let voiceRequest = null;
let textResult;

$(document).ready(function() {
  statusElt.value = '';
  searchElt.value = '';
});

// Houndify Audio Recorder
let recorder = new Houndify.AudioRecorder();
recorder.on('start', function() {
  //Initialize VoiceRequest
  voiceRequest = initVoiceRequest(recorder.sampleRate);
  voiceIcon.className = 'selected radio icon big red';
});

recorder.on('data', function(data) {
  voiceRequest.write(data);
});

recorder.on('end', function() {
  voiceRequest.end();
  recordingUpdate.hidden = false;
  recordingUpdate.innerText = 'Stopped recording. Waiting for response...';
  voiceIcon.className = 'unmute big icon';
  textSaveButton.disabled = false;
});

recorder.on('error', function(error) {
  voiceRequest.abort();
  recordingUpdate.hidden = false;
  recordingUpdate.innerText = 'Error: ' + error;
  voiceIcon.className = 'unmute big icon';
  textSaveButton.disabled = false;
});

//Initialiaze voice request
function initVoiceRequest(sampleRate) {
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
  recordingUpdate.hidden = false;
  recordingUpdate.innerText = 'Streaming voice request...';
  voiceIcon.className = 'loading circle notched icon big';
  textSaveButton.disabled = true;
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
}

//Fires if error occurs during the request
function onError(err, info) {
  statusElt.innerText = 'Error: ' + JSON.stringify(err);
}

//Fires every time backend sends a speech-to-text
//transcript of a voice query
//See https://houndify.com/reference/HoundPartialTranscript

function onTranscriptionUpdate(transcript) {
  statusElt.innerText = transcript.PartialTranscript;
}

//Save dream to database on click
function onSaveClick() {
  let date = dateInput.value;
  let dream = statusElt.innerText;
  saveDreamToDatabase(date, dream);

  $('.dream-list').prepend(`
  <li class="dream-list-item">
  <h4>${date.slice(0, 10)}</h4>
  <p>${dream}</p>
  `);

  statusElt.innerText = 'Click on microphone icon or type dream here.';
}
