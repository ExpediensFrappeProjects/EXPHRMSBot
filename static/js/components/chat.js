const converter = new showdown.Converter();


function scrollToBottomOfResults() {
  const terminalResultsDiv = document.getElementById("chats");
  terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
}


function setUserResponse(message) {
  const user_response = `<img class="userAvatar" src='./static/img/UserAvatar.png'><p class="userMsg">${message} </p><div class="clearfix"></div>`;
  $(user_response).appendTo(".chats").show("slow");

  $(".usrInput").val("");
  scrollToBottomOfResults();
  showBotTyping();
  $(".suggestions").remove();
}


function getBotResponse(text) {
  botResponse = `<img class="botAvatar" src="./static/img/BotAvatar.png"/><span class="botMsg">${text}</span><div class="clearfix"></div>`;
  return botResponse;
}


function setBotResponse(response) {
  setTimeout(() => {
    hideBotTyping();
    if (response.length < 1) {
      //If there is no response from Rasa, send  fallback message to the user
      const fallbackMsg = "I'm Sorry. There seems to be an issue right now. Please Try Again Later.";
      const BotResponse = `<img class="botAvatar" src="./static/img/BotAvatar.png"/><p class="botMsg">${fallbackMsg}</p><div class="clearfix"></div>`;
      $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
      setTimeout(() => {
        send('main_menu');
      }, 2000);
      scrollToBottomOfResults();
      
    } else {
      //If we get response from Rasa
      for (let i = 0; i < response.length; i += 1) {
        //Check if the response contains "text"
        if (Object.hasOwnProperty.call(response[i], "text")) {
          if (response[i].text != null) {
            //Convert the text to mardown format using showdown.js(https://github.com/showdownjs/showdown);
            let botResponse;
            let html = converter.makeHtml(response[i].text);
            html = html
              .replaceAll("<p>", "")
              .replaceAll("</p>", "")
              .replaceAll("<strong>", "<b>")
              .replaceAll("</strong>", "</b>");
            html = html.replace(/(?:\r\n|\r|\n)/g, "<br>");
            html = html.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"(?:[^>]*?)>(.*?)<\/a>/g, '<a href="$1" target="_blank">$2</a>');

       
            if (html.includes("<blockquote>")) {
              html = html.replaceAll("<br>", "");
              botResponse = getBotResponse(html);
            }
            // check for image
            if (html.includes("<img")) {
              html = html.replaceAll("<img", '<img class="imgcard_mrkdwn" ');
              botResponse = getBotResponse(html);
            }
            // check for preformatted text
            if (html.includes("<pre") || html.includes("<code>")) {
              botResponse = getBotResponse(html);
            }
            // check for list text
            if (
              html.includes("<ul") ||
              html.includes("<ol") ||
              html.includes("<li") ||
              html.includes("<h3")
            ) {
              html = html.replaceAll("<br>", "");
              botResponse = `<img class="botAvatar" src="./static/img/BotAvatar.png"/><span class="botMsg">${html}</span><div class="clearfix"></div>`;
              botResponse = getBotResponse(html);
            } else {
              // if no markdown formatting found, render the text as it is.
              if (!botResponse) {
                botResponse = `<img class="botAvatar" src="./static/img/BotAvatar.png"/><p class="botMsg">${html}</p><div class="clearfix"></div>`;
              }
            }
            // append the bot response on to the chat screen
            $(botResponse).appendTo(".chats").hide().fadeIn(1000);
          }
        }

        // check if the response contains "images"
        if (Object.hasOwnProperty.call(response[i], "image")) {
          if (response[i].image !== null) {
            const BotResponse = `<div class="singleCard"><img class="imgcard" src="${response[i].image}"></div><div class="clearfix">`;

            $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
          }
        }

        // check if the response contains "buttons"
        if (Object.hasOwnProperty.call(response[i], "buttons")) {
          if (response[i].buttons.length > 0) {
            addSuggestion(response[i].buttons);
          }
        }

        // check if the response contains "attachment"
        if (Object.hasOwnProperty.call(response[i], "attachment")) {
          if (response[i].attachment != null) {
            if (response[i].attachment.type === "video") {
              // check if the attachment type is "video"
              const video_url = response[i].attachment.payload.src;

              const BotResponse = `<div class="video-container"> <iframe src="${video_url}" frameborder="0" allowfullscreen></iframe> </div>`;
              $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
            }
          }
        }
        // check if the response contains "custom" message
        if (Object.hasOwnProperty.call(response[i], "custom")) {
          const { payload } = response[i].custom;
          if (payload === "quickReplies") {
            // check if the custom payload type is "quickReplies"
            const quickRepliesData = response[i].custom.data;
            showQuickReplies(quickRepliesData);
            return;
          }

          // check if the custom payload type is "pdf_attachment"
          if (payload === "pdf_attachment") {
            renderPdfAttachment(response[i]);
            return;
          }

          // check if the custom payload type is "dropDown"
          if (payload === "dropDown") {
            const dropDownData = response[i].custom.data;
            renderDropDown(dropDownData);
            return;
          }

          // check if the custom payload type is "location"
          if (payload === "location") {
            $("#userInput").prop("disabled", true);
            getLocation();
            scrollToBottomOfResults();
            return;
          }

          // check if the custom payload type is "cardsCarousel"
          if (payload === "cardsCarousel") {
            const restaurantsData = response[i].custom.data;
            showCardsCarousel(restaurantsData);
            return;
          }

          // check if the custom payload type is "chart"
          if (payload === "chart") {
            /**
             * sample format of the charts data:
             *  var chartData =  { "title": "Leaves", "labels": ["Sick Leave", "Casual Leave", "Earned Leave", "Flexi Leave"], "backgroundColor": ["#36a2eb", "#ffcd56", "#ff6384", "#009688", "#c45850"], "chartsData": [5, 10, 22, 3], "chartType": "pie", "displayLegend": "true" }
             */

            const chartData = response[i].custom.data;
            const {
              title,
              labels,
              backgroundColor,
              chartsData,
              chartType,
              displayLegend,
            } = chartData;

            // pass the above variable to createChart function
            createChart(
              title,
              labels,
              backgroundColor,
              chartsData,
              chartType,
              displayLegend
            );

            // on click of expand button, render the chart in the charts modal
            $(document).on("click", "#expand", () => {
              createChartinModal(
                title,
                labels,
                backgroundColor,
                chartsData,
                chartType,
                displayLegend
              );
            });
            return;
          }

          // check of the custom payload type is "collapsible"
          if (payload === "collapsible") {
            const { data } = response[i].custom;
            // pass the data variable to createCollapsible function
            createCollapsible(data);
          }
        }
      }
      scrollToBottomOfResults();
    }
    $(".usrInput").focus();
  }, 500);
}



//**Send the User Message to the Flask Server**//
async function send(message) {
  await new Promise((r) => setTimeout(r, 2000));
  $.ajax({
    url: flask_server_url,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ message, sender: sender_id }),
    success(botResponse, status) {
      console.log("Response from Rasa: ", botResponse, "\nStatus: ", status, "Sender:", sender_id);

      //If user wants to restart the chat and clear the existing chat contents.
      if (message.toLowerCase() === "/restart") {
        $("#userInput").prop("disabled", false);
        
        //If you want the bot to start the conversation after restart.
        customActionTrigger();
        return;
      }
      setBotResponse(botResponse);
    },
    error(xhr, textStatus) {
      if (message.toLowerCase() === "/restart") {
        $("#userInput").prop("disabled", false);

        //If you want the bot to start the conversation after the restart action.
        customActionTrigger();
        return;
      }
      //If there is no response from Rasa Server, set error bot response.
      setBotResponse("");
      console.log("Error From Bot End: ", textStatus);
    },
  });
}


//**Make Bot to Initiating the Conversation with the User**//
function customActionTrigger() {
  $.ajax({
    url: flask_server_url,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ message: "Start Conversation", sender: sender_id }),
    success(botResponse, status) {
      console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);
      setBotResponse(botResponse);
      $("#userInput").prop("disabled", false);
    },
    error(xhr, textStatus) {
      setBotResponse("");
      console.log("Error From Bot End: ", textStatus);
      $("#userInput").prop("disabled", false);
    },
  });
}


//**Clears the Conversation from the Chat Ccreen & Send the `/resart` Event to the Rasa Server**//
function restartConversation() {
  $("#userInput").prop("disabled", true);
  //Destroy the existing chart
  $(".collapsible").remove();

  if (typeof chatChart !== "undefined") {
    chatChart.destroy();
  }

  $(".chart-container").remove();
  if (typeof modalChart !== "undefined") {
    modalChart.destroy();
  }
  $(".chats").html("");
  $(".usrInput").val("");
  
  send("/restart");
}
//Triggers restartConversation function.
$("#restart").click(() => {
  restartConversation();
});

/*If User Hits Enter or Send Button*/
$(".usrInput").on("keyup keypress", (e) => {
  const keyCode = e.keyCode || e.which;

  const text = $(".usrInput").val();
  if (keyCode === 13) {
    if (text === "" || $.trim(text) === "") {
      e.preventDefault();
      return false;
    }
    //Destroy the existing chart, if yu are not using charts, then comment the below lines
    $(".collapsible").remove();
    $(".dropDownMsg").remove();
    if (typeof chatChart !== "undefined") {
      chatChart.destroy();
    }

    $(".chart-container").remove();
    if (typeof modalChart !== "undefined") {
      modalChart.destroy();
    }

    $("#paginated_cards").remove();
    $(".suggestions").remove();
    $(".quickReplies").remove();
    $(".usrInput").blur();
    setUserResponse(text);
    send(text);
    e.preventDefault();
    return false;
  }
  return true;
});

$("#sendButton").on("click", (e) => {
  const text = $(".usrInput").val();
  if (text === "" || $.trim(text) === "") {
    e.preventDefault();
    return false;
  }
  //Destroy the existing chart
  if (typeof chatChart !== "undefined") {
    chatChart.destroy();
  }
  $(".chart-container").remove();
  if (typeof modalChart !== "undefined") {
    modalChart.destroy();
  }
  $(".suggestions").remove();
  $("#paginated_cards").remove();
  $(".quickReplies").remove();
  $(".usrInput").blur();
  $(".dropDownMsg").remove();
  setUserResponse(text);
  send(text);
  e.preventDefault();
  return false;
});