const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar';

let gapiLoaded = false;

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        document.getElementById('authorize-button').onclick = handleAuthClick;
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        document.getElementById('authorize-button').style.display = 'none';
        document.getElementById('add-event-button').style.display = 'inline';
        document.getElementById('event-form').style.display = 'block';
    } else {
        document.getElementById('authorize-button').style.display = 'inline';
        document.getElementById('add-event-button').style.display = 'none';
        document.getElementById('event-form').style.display = 'none';
    }
}

function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleAddEventClick() {
    const eventTitle = document.getElementById('event-title').value;
    const eventStartTime = new Date(document.getElementById('event-start-time').value);
    const eventEndTime = new Date(document.getElementById('event-end-time').value);

    const event = {
        'summary': eventTitle,
        'start': {
            'dateTime': eventStartTime.toISOString(),
            'timeZone': 'UTC'
        },
        'end': {
            'dateTime': eventEndTime.toISOString(),
            'timeZone': 'UTC'
        }
    };

    const request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
    });

    request.execute(function(event) {
        console.log('Event created: ', event);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('add-event-button').addEventListener('click', handleAddEventClick);
    handleClientLoad();
});
