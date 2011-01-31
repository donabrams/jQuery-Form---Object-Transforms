$(function() {
    $("#populate").click(function() {
        alert("click");
        $("#origForm").objToFields({quote:"We work, yay!"});
    });
    $("#populateAndClear").click(function() {
        $("#origForm").objToFields({quote:"We work, yay!"}, true);
    });
    $("#copy").click(function() {
        $("#otherForm").objToFields($("#origForm").fieldsToObj(),  true);
    });
})(jQuery);
