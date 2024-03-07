//**Hide the Bot Avatar and Typing Animation**//
function hideBotTyping() {
    $("#botAvatar").remove();
    $(".botTyping").remove();
}

//**Display the Bot Avatar and Typing Animation**//
function showBotTyping() {
    const botTyping = '<img class="botAvatar" id="botAvatar" src="./static/img/BotAvatar.png"/><div class="botTyping"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';
    $(botTyping).appendTo(".chats");
    $(".botTyping").show();
    scrollToBottomOfResults();
}