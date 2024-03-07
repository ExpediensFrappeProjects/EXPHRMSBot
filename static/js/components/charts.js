//**Function to Create a Chart in the Main Chat Interface**//
function createChart(
    title,
    labels,
    backgroundColor,
    chartsData,
    chartType,
    displayLegend,
) {
    //HTML structure for the chart container
    const html = '<div class="chart-container"> <span class="modal-trigger" id="expand" title="expand" href="#modal1"><i class="fa fa-external-link" aria-hidden="true"></i></span> <canvas id="chat-chart" ></canvas> </div> <div class="clearfix"></div>';
    
    //Appending the chart container to the chat interface
    $(html).appendTo(".chats");

    //Getting the canvas element for chart rendering
    const ctx = $("#chat-chart");

    //Configuration for the chart data
    const data = {
        labels,
        datasets: [
            {
                label: title,
                backgroundColor,
                data: chartsData,
                fill: false,
            },
        ],
    };

    //Configuration for the chart options
    const options = {
        title: {
            display: true,
            text: title,
        },
        layout: {
            padding: {
                left: 5,
                right: 0,
                top: 0,
                bottom: 0,
            },
        },
        legend: {
            display: displayLegend,
            position: "right",
            labels: {
                boxWidth: 5,
                fontSize: 10,
            },
        },
    };

    //Creating a new Chart instance
    chatChart = new Chart(ctx, {
        type: chartType,
        data,
        options,
    });

    //Scroll to the bottom of the chat results
    scrollToBottomOfResults();
}

//**Function to Create a Chart in a Modal**//
function createChartinModal(
    title,
    labels,
    backgroundColor,
    chartsData,
    chartType,
    displayLegend,
) {
    //Getting the canvas element for chart rendering in the modal
    const ctx = $("#modal-chart");

    //Configuration for the chart data in the modal
    const data = {
        labels,
        datasets: [
            {
                label: title,
                backgroundColor,
                data: chartsData,
                fill: false,
            },
        ],
    };

    //Configuration for the chart options in the modal
    const options = {
        title: {
            display: true,
            text: title,
        },
        layout: {
            padding: {
                left: 5,
                right: 0,
                top: 0,
                bottom: 0,
            },
        },
        legend: {
            display: displayLegend,
            position: "right",
        },
    };

    //Creating a new Chart instance in the modal
    modalChart = new Chart(ctx, {
        type: chartType,
        data,
        options,
    });
}