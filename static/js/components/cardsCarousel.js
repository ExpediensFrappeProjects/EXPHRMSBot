//**Function to Create HTML for a Cards Carousel Based on the Provided Data**//
function createCardsCarousel(cardsData) {
    let cards = "";
    
    //Mapping through the card data to create individual card items
    cardsData.map((card_item) => {
        const item = `<div class="carousel_cards in-left">
    <img class="cardBackgroundImage" src=${card_item.image}>
    <div class="cardFooter"> <span class="cardTitle" title="abc">${card_item.title}</span>
    <div class="cardDescription"></div></div></div>`;
        cards += item;
    });
    
    //Constructing the overall HTML for the cards carousel
    const cardContents = `<div id="paginated_cards" class="cards"> <div class="cards_scroller">${cards} <span class="arrow prev fa fa-chevron-circle-left "></span> <span class="arrow next fa fa-chevron-circle-right" ></span> </div> </div>`;
    
    return cardContents;
}


//**Function to Display the Cards Carousel in the Chat Interface**//
function showCardsCarousel(cardsToAdd) {
    //Creating the HTML for the cards carousel
    const cards = createCardsCarousel(cardsToAdd);

    //Appending the cards carousel to the chat interface and making it visible
    $(cards).appendTo(".chats").show();

    //Displaying individual cards based on the number of cards provided
    if (cardsToAdd.length <= 2) {
        $(`.cards_scroller>div.carousel_cards:nth-of-type(2)`).fadeIn(3000);
    } else {
        for (let i = 0; i < cardsToAdd.length; i += 1) {
            $(`.cards_scroller>div.carousel_cards:nth-of-type(${i})`).fadeIn(3000);
        }
        $(".cards .arrow.prev").fadeIn("3000");
        $(".cards .arrow.next").fadeIn("3000");
    }

    //Scroll to the bottom of the chat results
    scrollToBottomOfResults();

    //Configuring event listeners for scrolling through the card carousel
    const card = document.querySelector("#paginated_cards");
    const card_scroller = card.querySelector(".cards_scroller");
    const card_item_size = 225;

    function scrollToNextPage() {
        card_scroller.scrollBy(card_item_size, 0);
    }

    function scrollToPrevPage() {
        card_scroller.scrollBy(-card_item_size, 0);
    }

    card.querySelector(".arrow.next").addEventListener("click", scrollToNextPage);
    card.querySelector(".arrow.prev").addEventListener("click", scrollToPrevPage);

    //Focusing on the user input after displaying the cards carousel
    $(".usrInput").focus();
}