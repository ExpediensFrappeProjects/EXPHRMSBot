//**Function to render a PDF attachment in the chat interface**//
function renderPdfAttachment(pdf_data) {
    // Extracting URL and title from the provided PDF data
    const { url: pdf_url } = pdf_data.custom;
    const { title: pdf_title } = pdf_data.custom;

    // Constructing the HTML for the PDF attachment
    const pdf_attachment = `<div class="pdf_attachment"><div class="row"><div class="col s3 pdf_icon">
    <i class="fa fa-file-pdf-o" aria-hidden="true"></i></div><div class="col s9 pdf_link"><a>
    ${pdf_title} </a></div></div></div>`;

    // Appending the PDF attachment to the chat interface
    $(".chats").append(pdf_attachment);

    // Scroll to the bottom of the chat results
    scrollToBottomOfResults();

    // Adding click event listener to the PDF link for downloading the PDF
    const mypdfbutton = document.querySelector('.pdf_link');
    mypdfbutton.addEventListener("click", function (e) {
        generateAndDownloadBlob('http://192.168.20.106:3000/static/files/Holiday%20Calendar%202024.pdf', 'Holiday List 2024.pdf');
    });
}

//**Function to Fetch a PDF File, Generate a blob, and Initiate its Download**//
function generateAndDownloadBlob(url, fileName) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            // Creating a hidden link element to trigger the download
            var link = document.createElement("a");
            var blobUrl = URL.createObjectURL(blob);

            // Setting attributes for the link
            link.setAttribute("href", blobUrl);
            link.setAttribute("download", fileName);
            link.style.visibility = 'hidden';

            // Appending the link to the body, triggering the click, and removing the link
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
}