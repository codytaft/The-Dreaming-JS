let statusElt = document.getElementById('status') as HTMLInputElement;
let recordingUpdate = document.getElementById('recordingUpdate');
let searchElt = document.getElementById('search') as HTMLInputElement;
let voiceIcon = document.getElementById('voiceIcon');
let textSaveButton = document.getElementById('textSaveButton') as HTMLButtonElement;
let dateInput = document.getElementById('date-input') as HTMLInputElement;
let houndifyClientID = 'RiMx52JTjy6L9At1dnmk3A==';
let auth0ClientID = 'e9Ryt-yZb0WA4vcq-YKyWqxk0wb7FaeP';
let auth0Domain = 'dreaming.auth0.com';
let conversationState: any;
let voiceRequest: Houndify.VoiceRequest;
let textResult: string;

$(document).ready(function() {
  if (statusElt) {
    statusElt.value = '';
  }

  if (searchElt) {
    searchElt.value = "";
  }
});

// Houndify Audio Recorder
let recorder = new Houndify.AudioRecorder();
recorder.on('start', function() {
  //Initialize VoiceRequest
  voiceRequest = initVoiceRequest(recorder.sampleRate);

  if (voiceIcon) {
    voiceIcon.className = "selected radio icon big red";
  }
});

recorder.on('data', function(data: any) {
  if (voiceRequest) {
    voiceRequest.write(data);
  }
});

recorder.on('end', function() {
  if (voiceRequest) {
    voiceRequest.end();
  }

  if (recordingUpdate) {
    recordingUpdate.hidden = false;
    recordingUpdate.innerText = 'Stopped recording. Waiting for response...';
  }

  if (voiceIcon) {
    voiceIcon.className = 'unmute big icon';
  }

  if (textSaveButton) {
    textSaveButton.disabled = false;
  }
});

recorder.on('error', function(error: string) {
  if (voiceRequest) {
    voiceRequest.abort();
  }

  if (recordingUpdate) {
    recordingUpdate.hidden = false;
    recordingUpdate.innerText = 'Error: ' + error;
  }

  if (voiceIcon) {
    voiceIcon.className = "unmute big icon";
  }

  if (textSaveButton) {
    textSaveButton.disabled = false;
  }
});

//Initialiaze voice request
var initVoiceRequest = (sampleRate: any) => {
  let voiceRequest = new Houndify.VoiceRequest({
    //Your Houndify Client ID
    clientId: houndifyClientID,

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
    onResponse: function(response: any, info: any) {
      recorder.stop();
      onResponse(response, info);
    },
    onError: function(err: any, info: any) {
      recorder.stop();
      onError(err, info);
    }
  });
  return voiceRequest;
};

var onMicrophoneClick = () => {
  if (recorder && recorder.isRecording()) {
    recorder.stop();
    return;
  }

  recorder.start();
  if (recordingUpdate) {
    recordingUpdate.hidden = false;
    recordingUpdate.innerText = 'Streaming voice request...';
  }

  if (voiceIcon) {
    voiceIcon.className = 'loading circle notched icon big';
  }

  if (textSaveButton) {
    textSaveButton.disabled = true;
  }
};

//Fires after server responds with Response JSON
//Info object contains useful information about the completed request
//See https://houndify.com/reference/HoundServer
var onResponse = (response: { AllResults: { WrittenResponse: any, ConversationState: any; }[]; }, info: any) => {
  if (response.AllResults && response.AllResults.length) {
    //Pick and store appropriate ConversationState from the results.
    //This example takes the default one from the first result.
    conversationState = response.AllResults[0].ConversationState;
  }

  textResult = response.AllResults[0].WrittenResponse;
  statusElt.innerText = textResult;
  statusElt.contentEditable = 'true';
};

//Fires if error occurs during the request
var onError = (err: string, info: any) => {
  statusElt.innerText = 'Error: ' + JSON.stringify(err);
};

//Fires every time backend sends a speech-to-text
//transcript of a voice query
//See https://houndify.com/reference/HoundPartialTranscript

var onTranscriptionUpdate = (transcript: { PartialTranscript: string; }) => {
  statusElt.innerText = transcript.PartialTranscript;
};

//Save dream to database on click
var onSaveClick = async (event: Event) => {
  let date = dateInput.value;
  let dream = statusElt.innerText;
  await saveDreamToDatabase(date, dream).then(dreamId => {
    $('.dream-list').prepend(`
    <li id="${dreamId.dreamId[0]}" class="dream-list-item">
    <h4>${date.slice(
      0,
      10
    )}<i class="far fa-trash-alt" onclick="onTrashClick(event)"></i></h4>
    <p>${dream}</p>
    `);
  });

  statusElt.innerText = 'Click on microphone icon or type dream here.';
};

var onTrashClick = (e: { target: any; }) => {
  $(e.target)
    .parent()
    .parent()
    .remove();
  let dreamId = $(e.target)
    .parent()
    .parent()
    .attr('id');

    if (dreamId) {
      deleteDreamFromDatabase(dreamId);
    }
};
