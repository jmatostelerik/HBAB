$(document).ready(function(){
	$(".colorizeSelect").on("change", updateWithEnergy(0));

	for(var i in enumerations){
		addFilter(i);
	}


	var presetSelect = $(".presetSelect");
	presets.forEach(function(preset, i){
		presetSelect.append("<option value='"+ i +"'>"+ preset.name +"</option>");
	});
	presetSelect.append("<option value=''>--Custom--</option>");
	

	$("#filtersDiv").on("change", ".filterSelect", updateWithEnergy(0.8));
	$("#Jiggle").on("click", updateWithEnergy(0.2));
	$("#Shake").on("click", updateWithEnergy(0.8));
	$("#Upheaval").on("click", updateWithEnergy(2));

	$("#HitWithBus").on("click", function () {
		var heaviestNode, greatestWeight = -Infinity;
		$(".node").each(function (_, domNode) {
			if (domNode.__data__.weight > greatestWeight) {
				greatestWeight = domNode.__data__.weight;
				heaviestNode = domNode;
			}
		});

		if (heaviestNode) { removeNode(heaviestNode); }
	});

	$(".presetSelect").on("change", function(e){
		loadPreset($(e.target).val());
	});

	$("#letsGoAlready, #lightbox").on("click", function(){
		$("#lightbox").remove();
		updateWithEnergy(1)();
	});

	NetworkRepository.CallWithNetworkData({}, initForceGraph);
});

var constant = function (x) { return function () { return x;}; };
var weightScale = d3.scale.linear().domain([0, 8]);
var exponentialWeight = function(link) {
	return Math.pow(2, weightScale(link.relationship.weight) * 3) / 8;
};
var color = d3.scale.category20();

var defaultOpts = {
	charge: constant(-90),
	nodeFilter: constant(true),
	linkDistance: constant(60),
	linkStrength: exponentialWeight,
	strokeWidth: function (link) { return exponentialWeight(link) * 8; }
};

function initForceGraph(err, graph){
	var selector = "#graph";
	window.forceGraph = newForceGraph(graph, selector, $(window).innerHeight(), $(window).innerWidth());
	updateWithEnergy(2)();
	$(selector).on("mouseenter mouseleave", ".node", function(e){
		if(e.type === "mouseenter")	createTooltip(this);
		else clearTooltips();
	});
	$(selector).on("click", ".node", function(e){
		removeNode(this);
	});

	loadPreset("0");
}

var excludedUIDs = [];
var updateWithEnergy = function (energy) {
	return function () {

		// update colors
		var colorizeBy = $(".colorizeSelect").val();
		var nodeColor = function(node) {
			return color( enumerations[colorizeBy].indexOf(node.person[colorizeBy].toString()));
		};
		updateColorKey(enumerations[colorizeBy]);

		// update filters
		var filterValues = {},
			filterSelects = $("#filtersDiv .filterSelect");

		filterSelects.each(function(i, el){
			var $el = $(el);
			filterValues[$el.attr("data-name")] = $el.val();
		});
		var nodeFilter = function (node){
			//Adjust Node weight
				//Get Pristine datasource
				//get node.UID from pristine datasource

				//get status of team filter
				//sum weights from prisitine datasource
				//apply weight to node

			for(var i in filterValues){
				if(filterValues[i].indexOf(node.person[i].toString()) === -1){
					return false;
				}
			}

			if (excludedUIDs.some(function (UID) { return UID === node.UID; })) {
				return false;
			}

			return true;
		};

		var opts = $.extend(defaultOpts, {
			energy: energy,
			nodeColor: nodeColor,
			nodeFilter: nodeFilter
		});

		forceGraph.update(opts);
	};
};


// define some enumerators to map colors to keys
var enumerations = {
	role: "Engineering,Design,Business".split(","),
	location: "Europe,APAC,North America".split(","),
	team: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17".split(",")
};

// ideally the user could setup a preset and save it to localStorage
// or something, but for now theyre hardcoded
var presets = [
	{
		name: "Role Distribution per Team",
		config: {
			colorizeSelect: "role",
			filters: {
				"role": "Engineering,Design,Business".split(","),
				"location": "Europe,APAC,North America".split(","),
				"team": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17".split(",")
			}
		}
	},{
		name: "Devs by Location",
		config: {
			colorizeSelect: "location",
			filters: {
				"role": ["Engineering"],
				"location": "Europe,APAC,North America".split(","),
				"team": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17".split(",")
			}
		}
	},{
		name: "Connections between Teams",
		config: {
			colorizeSelect: "team",
			filters: {
				"role": "Engineering,Design,Business".split(","),
				"location": "Europe,APAC,North America".split(","),
				"team": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17".split(",")
			}
		}
	}
];

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
	updateWithEnergy(Math.pow(2, weightScale(node.__data__.weight / 3) * 3) / 4)();
}

function loadPreset(id){
	var preset = presets[id];

	if(!id){
		$("#customOptions").show("fast");
		$("#presetTitle").text("Custom");

	} else {
		$("#customOptions").hide("fast");		
		$("#presetTitle").text(preset.name);
		$(".colorizeSelect").val(preset.config.colorizeSelect);
		for(var i in preset.config.filters){
			$(".filterSelect[data-name='"+ i +"']").val(preset.config.filters[i]);
		}
		updateWithEnergy(0.8)();
	}
}
