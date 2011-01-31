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
		console.log("form obj");
		console.log($("#origForm").fieldsToObj());
        $("#otherForm").objToFields($("#origForm").fieldsToObj(),  true);
		console.log("flattened form obj");
		console.log($.flattenObject($("#origForm").fieldsToObj()));
		return false;
    });
});//(jQuery);
