function ForceGraph(model, selector, width, height){
	this.model = model;
	this.initGraph(selector, width, height);
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

		this.refresh();
	},

	refresh: function(){

		this.link = this.svg.selectAll(".link").data(this.model.links);
		this.node = this.svg.selectAll(".node").data(this.model.nodes);


		// add new links
		this.link.enter().append("line")
			.attr("class", "link")
			.style("stroke-width", function(d) { return Math.sqrt(d.weight); });

		// update existing links
		this.link
			.style("stroke-width", function(d) { return Math.sqrt(d.weight); });

		// deal with removed links
		this.link.exit().transition().remove();


		this.node.enter().append("circle")
			.attr("class", "node")
			.attr("r", 9)
			.style("fill", function(d) { return color(d.team); })
			.call(this.force.drag);

		// TODO - nice styled popup?
		this.node.append("title")
			.text(function(d) { return d.name; });

		this.node.exit().remove();


		this.force.on("tick", function() {
			this.link.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });

			this.node.attr("cx", function(d) { return d.x; })
				.attr("cy", function(d) { return d.y; });
		}.bind(this));

	},

	showRole: function(role){
		// this.model.nodes = this.model.nodes.slice(0, Math.ceil(Math.random()*this.model.nodes.length));
		// this.removeDeadLinks();
		this.model.nodes = this.model.nodes.filter(function(d){
			if(d.role !== role){
				d.visible = false;
			} else {
				d.visible = true;
				return true;
			}
		});
		this.removeDeadLinks();
		this.refresh();
	},

	removeDeadLinks: function(){
		this.model.links = this.model.links.filter(function(link){
			return link.source.visible && link.target.visible;
		});
	}
};