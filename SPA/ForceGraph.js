function ForceGraph(model){
	this.model = model;
}

var strengthScale = d3.scale.linear().domain([0, 15]);
var distanceScale = d3.scale.linear().domain([20, 50]);
var color = d3.scale.category20();

ForceGraph.prototype = {
	constructor: ForceGraph,

	linkDistance: function(l){
		return distanceScale(l.weight) * 200;
	},
	linkStrength: function(l){
		return strengthScale(l.weight) * 0.5;
	},

	initGraph: function(selector, width, height){

		this.width = width;
		this.height = height;
		this.$el = $(selector);

		this.force = d3.layout.force()
			.charge(-120)
			.linkDistance(this.linkDistance)
			.linkStrength(this.linkStrength)
			.size([this.width, this.height]);

		this.svg = d3.select(selector).append("svg")
			.attr("width", this.width)
			.attr("height", this.height);

		this.force
			.nodes(this.model.nodes)
			.links(this.model.links)
			.start();


		var link = this.svg.selectAll(".link").data(this.model.links);

		link.enter().append("line")
			.attr("class", "link")
			.style("stroke-width", function(d) { return Math.sqrt(d.weight); });

		link.exit().remove();


		var node = this.svg.selectAll(".node").data(this.model.nodes);

		node.enter().append("circle")
			.attr("class", "node")
			.attr("r", 5)
			.style("fill", function(d) { return color(d.team); })
			.call(this.force.drag);

		// TODO - nice styled popup?
		node.append("title")
			.text(function(d) { return d.name; });

		node.exit().remove();



		this.force.on("tick", function() {
			link.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });

			node.attr("cx", function(d) { return d.x; })
				.attr("cy", function(d) { return d.y; });
		});
	}
};