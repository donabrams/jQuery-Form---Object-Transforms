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
		console.log("form obj");
		console.log($("#origForm").fieldsToObj());
		console.log("form obj ignoring nulls");
		console.log($("#origForm").fieldsToObj(null, null, true));
		console.log("flattened form obj");
		console.log($.flattenObject($("#origForm").fieldsToObj()));
		console.log("flattened form obj w/ nullAsEmptyString");
		console.log($.flattenObject($("#origForm").fieldsToObj(), null, null, true));
		return false;
    });
});//(jQuery);
