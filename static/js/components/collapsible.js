//**Function to Create a Collapsible List Based on the Provided Data**//
function createCollapsible(collapsible_data) {
    let collapsible_list = "";

    //Iterating through the provided data to create individual collapsible items
    for (let i = 0; i < collapsible_data.length; i += 1) {
        const collapsible_item = `<li><div class="collapsible-header">${collapsible_data[i].title}</div><div class="collapsible-body">
<span>${collapsible_data[i].description}</span></div></li>`;

        collapsible_list += collapsible_item;
    }

    //Constructing the overall HTML for the collapsible list
    const collapsible_contents = `<ul class="collapsible">${collapsible_list}</ul>`;

    //Appending the collapsible list to the chat interface
    $(collapsible_contents).appendTo(".chats");

    //Initializing the collapsible feature for the created list
    $(".collapsible").collapsible();

    //Scroll to the bottom of the chat results
    scrollToBottomOfResults();
}