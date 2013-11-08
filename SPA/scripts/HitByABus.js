$(document).ready(function(){

	$(".colorizeSelect").on("change", updateForceGraphOpts);

	for(var i in enumerations){
		addFilter(i);
	}

	$("#filtersDiv").on("change", ".filterSelect", updateForceGraphOpts);

	NetworkRepository.CallWithNetworkData({}, initForceGraph);
});

var constant = function (x) { return function () { return x;}; };
var weightScale = d3.scale.linear().domain([0, 8]);
var color = d3.scale.category20();
var defaultOpts = {
	charge: constant(-120),
	nodeFilter: constant(true),
	linkDistance: constant(30),
	linkStrength: function(link) {
		return weightScale(link.relationship.weight) * weightScale(link.relationship.weight);
	},
	strokeWidth: function(link) {
		return Math.pow(1.5, weightScale(link.relationship.weight) * 4);
	},
	nodeColor: function(node) {
		return color( roles.indexOf(node.person.role));
	}
};

function initForceGraph(err, graph){
	var selector = "#graph";
	window.forceGraph = newForceGraph(graph, selector, $(window).innerHeight(), $(window).innerWidth());
	updateForceGraphOpts();
	$(selector).on("mouseenter mouseleave", ".node", function(e){
		if(e.type === "mouseenter")	createTooltip(this);
		else clearTooltips();
	});
	$(selector).on("click", ".node", function(e){
		removeNode(this);
	});
}

var excludedUIDs = [];
function updateForceGraphOpts(){
	var opts = $.extend({}, defaultOpts);

	// update colors
	var colorizeBy = $(".colorizeSelect").val();
	opts.nodeColor = function(node) {
		return color( enumerations[colorizeBy].indexOf(node.person[colorizeBy].toString()));
	}
	updateColorKey(enumerations[colorizeBy]);

	// update filters
	var filterValues = {},
		filterSelects = $("#filtersDiv .filterSelect");

	filterSelects.each(function(i, el){
		var $el = $(el);
		filterValues[$el.attr("data-name")] = $el.val();
	});
	opts.nodeFilter = function (node){
		for(var i in filterValues){
			if(filterValues[i].indexOf(node.person[i].toString()) === -1){
				return false;
			}
		}

		if (excludedUIDs.some(function (UID) { return UID === node.UID })) {
			return false;
		}

		return true;
	},

	forceGraph.update(opts);
}

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

function addFilter(name){
	var html = ["<label>"+ (name.charAt(0).toUpperCase() + name.slice(1)) +"</label>"];
	html.push("<select class='filterSelect' data-name='"+ name +"' multiple>");
	enumerations[name].forEach(function(str, i){
		html.push("<option value='"+ str +"' selected>"+ str +"</option>");
	});
	html.push("</select>");
	$("#filtersDiv").append(html.join(""));
}

function createTooltip(node){
	var person = node.__data__.person,
		html = ["<div class='tooltip'>"];

	html.push("<div class='name'>"+ person.name +"</div>");

	for(var i in enumerations){
		html.push("<span class='"+ i +"'>"+ person[i] +"</span>");
	}
	
	html.push("</div>");

	html = $(html.join(""));

	$("body").append(html);

	html.css({
		"top": node.__data__.y - html.height() - 20,
		"left": node.__data__.x - html.width() * 0.5
	});
}

function clearTooltips(){
	$(".tooltip").remove();
}

function removeNode(node){
	excludedUIDs.push(node.__data__.UID);
	clearTooltips();
	updateForceGraphOpts();
}
