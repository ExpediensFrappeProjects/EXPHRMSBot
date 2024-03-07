function getUserPosition(position) {

    const response = `/inform{"latitude":${position.coords.latitude},"longitude":${position.coords.longitude}}`;
    $("#userInput").prop("disabled", false);

    send(response);
    showBotTyping();
}

function handleLocationAccessError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
        default:
            break;
    }

    const response = '/inform{"user_location":"deny"}';

    send(response);
    showBotTyping();
    $(".usrInput").val("");
    $("#userInput").prop("disabled", false);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            getUserPosition,
            handleLocationAccessError,
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}