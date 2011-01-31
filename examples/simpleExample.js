$(function() {
    $("#populate").click(function() {
        $("#origForm").objToFields({quote:"We work, yay!"});
		return false;
    });
    $("#populateAndClear").click(function() {
        $("#origForm").objToFields({quote:"We work, yay!"}, true);
		return false;
    });
    $("#copy").click(function() {
        $("#otherForm").objToFields($("#origForm").fieldsToObj(),  true);
		return false;
    });
});//(jQuery);
