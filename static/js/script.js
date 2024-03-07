//**Module for Importing Other JS Files**//
function include(file) {
  const script = document.createElement('script');
  script.src = file;
  script.type = 'text/javascript';
  script.defer = true;

  document.getElementsByTagName('head').item(0).appendChild(script);
}

//**Bot Pop-Up Intro**//
document.addEventListener("DOMContentLoaded", () => {
  const elemsTap = document.querySelector(".tap-target");
  const instancesTap = M.TapTarget.init(elemsTap, {});
  instancesTap.open();
  setTimeout(() => {
    instancesTap.close();
  }, 4000);
});

//**Import Components**//
include('./static/js/components/index.js');
window.addEventListener('load', () => {
  //Initialization
  $(document).ready(() => {
    //Bot Pop-Up Intro
    $("div").removeClass("tap-target-origin");

    //Drop Down Menu for Close, Restart Conversation & Clear the Chats.
    $(".dropdown-trigger").dropdown();

    //Initiate the modal for displaying the charts, if you dont have charts, then you comment the below line
    $(".modal").modal();

    //Enable this if u have configured the bot to start the conversation.
    showBotTyping();
    $("#userInput").prop('disabled', true);

    //If you want the bot to start the conversation
    customActionTrigger();
  });
  
  // Toggle The Chatbot Screen
  $("#profile_div").click(() => {
    $(".profile_div").toggle();
    $(".widget").toggle();
  });

  //**Clear Function to Clear the Chat Contents of the Widget**//
  $("#clear").click(() => {
    $(".chats").fadeOut("normal", () => {
      $(".chats").html("");
      $(".chats").fadeIn();
    });
  });

  //**Close Function to Close the Widget**//
  $("#close").click(() => {
    $(".profile_div").toggle();
    $(".widget").toggle();
    scrollToBottomOfResults();
  });
});