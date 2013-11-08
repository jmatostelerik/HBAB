$(document).ready(function(){

	$(".colorizeSelect").on("change", updateForceGraphOpts);

});




// define some enumerators to map colors to keys
var enumerations = {
	role: "Engineering,Design,Business".split(","),
	location: "Europe,APAC,North America".split(","),
	team: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17".split(",")
};




function updateColorKey(arr){
	var html = ["<div>Color Key</div>"];
	arr.forEach(function(str, i){
		html.push("<div class='colorKeyBlock' style='background-color: "+ color(i) +";'></div>");
		html.push("<div class='colorKeyValue'>"+ str +"</div><br>");
	});
	$("#colorKey").html(html.join(""));
}
