$(document).ready(function(){

	$(".roleSelect").on("change", updateForceGraphOpts);

});




// define some enumerators to map colors to keys
var roles = "Engineering,Design,Business".split(","),
	locations = "Europe,APAC,North America".split(",");