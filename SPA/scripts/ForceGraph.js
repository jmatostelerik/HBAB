function ForceGraph(model, selector, width, height){
	this._model = model;
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

	cloneModel: function(){
		return $.extend(this._model);
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
			.nodes(this._model.nodes)
			.links(this._model.links)
			.start()
			.on("tick", function() {
				this.link.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });

				this.node.attr("cx", function(d) { return d.x; })
					.attr("cy", function(d) { return d.y; });
			}.bind(this));

		this.refresh(this.cloneModel());
	},

	refresh: function(model){

		this.link = this.svg.selectAll(".link").data(model.links);
		this.node = this.svg.selectAll(".node").data(model.nodes);

		// add new links
		this.link.enter().append("line")
			.attr("class", "link")
			.style("stroke-width", function(d) { return Math.sqrt(d.weight); });

		// update existing links
		this.link
			.style("stroke-width", function(d) { return Math.sqrt(d.weight); });

		// deal with removed links
		

		this.node.enter().append("circle")
			.attr("class", "node")
			.attr("r", 9)
			.style("fill", function(d) { return color(d.team); })
			.call(this.force.drag);

		// TODO - nice styled popup?
		this.node.append("title")
			.text(function(d) { return d.name; });

		this.link.exit().transition().style("opacity", 0).remove();
		this.node.exit().transition().style("opacity", 0).remove();
	},

	showRole: function(role){
		var model = this.cloneModel();

		model.nodes = model.nodes.filter(function(d){
			if(d.role !== role){
				d.visible = false;
			} else {
				d.visible = true;
				return true;
			}
		});
		model = this.removeDeadLinks(model);
		// TODO - make sure refresh isnt called before removeDeadLinks Finishes
		this.refresh(model);
	},

	removeDeadLinks: function(model){
		model.links = model.links.filter(function(link){
			return link.source.visible && link.target.visible;
		});
		return model;
	}
};