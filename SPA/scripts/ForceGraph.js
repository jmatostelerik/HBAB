(function () {
	var STOP_ENERGY = .1;
	var funcOrZeroIfNot = function(func, predicate) {
		return function (item) {
			return predicate(item) ? func(item) : 0;
		}
	};

	window.newForceGraph = function(pristineData, selector, height, width) {
		var UIDkey = function (item) { return item.UID; };

		var vertices = [];
		vertices.byUID = {};
		var edges = [];
		var radiusFactor = 4;

		pristineData.people.forEach(function (person, index, people) {
			var newVertex = {
				UID: person.UID,
				person: person,
				x: width / 2 + (width / radiusFactor) * Math.cos(2 * Math.PI * index / people.length),
				y: height / 2 + (height / radiusFactor) * Math.sin(2 * Math.PI * index / people.length),
			};

			vertices.push(newVertex);
			vertices.byUID[newVertex.UID] = newVertex;
		});

		pristineData.relationships.forEach(function (relationship) {
			edges.push({
				UID: relationship.UID,
				relationship: relationship,
				source: vertices.byUID[relationship.sourceUID],
				target: vertices.byUID[relationship.targetUID]
			});
		});

		var redraw = function() {
		  console.log("here", d3.event.translate, d3.event.scale);
		  svg.attr("transform",
		      "translate(" + d3.event.translate + ")"
		      + " scale(" + d3.event.scale + ")");
		}

		var svg = d3.select(selector)
					.append("svg")
					.attr("width", width)
					.attr("height", height)
					.attr("pointer-events", "all")
					.append('svg:g')
					.call(d3.behavior.zoom().on("zoom", redraw));
		var domVertices = function () { return svg.selectAll(".node"); };
		var domEdges = function () { return svg.selectAll(".link"); };

		var forceWeb = d3.layout.force()
			.nodes(vertices)
			.links(edges)
			.size([width, height])
			.on("tick", function (){
				domVertices().attr("cx", function (vertex) { return vertex.x; })
				   		     .attr("cy", function (vertex) { return vertex.y; });
			   	
			   	domEdges().attr("x1", function (edge) { return edge.source.x; })
			   	          .attr("y1", function (edge) { return edge.source.y; })
			   	          .attr("x2", function (edge) { return edge.target.x; })
			   	          .attr("y2", function (edge) { return edge.target.y; });
   	          	if (forceWeb.alpha < STOP_ENERGY) {
   	          		forceWeb.alpha = 0;
   	          	}
			});

		var getFrictionToMakeDurationProportionalToEnergy = function (initialEnergy) {
			return initialEnergy === 0 ?
				.5
				: Math.pow(2, (Math.log(STOP_ENERGY) - Math.log(initialEnergy)) / (10 * initialEnergy));
		}
		
		return {
			update: function (options) {
				var edgeIsIncluded = function (edge) {
					return options.nodeFilter(edge.source) && options.nodeFilter(edge.target);
				};

				edgeOn = domEdges().data(edges.filter(edgeIsIncluded), UIDkey);
				
				edgeOn.enter()
					.append("line")
					.attr("class", "link");

				edgeOn.exit().remove();

				edgeOn.style("stroke-width", options.strokeWidth);



				vertexOn = domVertices().data(vertices.filter(options.nodeFilter), UIDkey);
				
				vertexOn.enter()
				    .append("circle")
				    .attr("class", "node")
				    .attr("r", 0)
				    .transition()
				    .delay(function(d, i){return 10*i;})
				    .attr("r", 9)				    
				    .ease("elastic", 5, 1.2);
				    
				vertexOn.style("fill", options.nodeColor);
				
				vertexOn.exit()
					.transition()
				    .delay(function(d, i){return 5*i;})
				    .attr("r", 0)				    
				    .ease("bounce")
				    .remove();

				forceWeb
					.charge(funcOrZeroIfNot(options.charge, options.nodeFilter))
					.linkStrength(funcOrZeroIfNot(options.linkStrength, edgeIsIncluded))
					.linkDistance(options.linkDistance);

				if (options.energy !== 0) {
					forceWeb
						.start()
						.friction(getFrictionToMakeDurationProportionalToEnergy(options.energy))
						.alpha(options.energy);
				}
			}
		}
	}
})();