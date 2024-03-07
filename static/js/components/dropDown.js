function renderDropDown(drop_down_data) {
    let drop_down_options = "";
    for (let i = 0; i < drop_down_data.length; i += 1) {
        drop_down_options += `<option value="${drop_down_data[i].value}">${drop_down_data[i].label}</option>`;
    }
    const drop_down_select = `<div class="dropDownMsg"><select class="browser-default dropDownSelect"> <option value="" disabled selected>Choose Your Option</option>${drop_down_options}</select></div>`;
    $(".chats").append(drop_down_select);
    scrollToBottomOfResults();
    $("select").on("change", function () {
        let value = "";
        let label = "";
        $("select option:selected").each(() => {
            label += $(this).val();
            value += $(this).val();
        });

        setUserResponse(label);
        send(value);
        $(".dropDownMsg").remove();
    });
}