(function () {
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

		pristineData.people.forEach(function (person) {
			var newVertex = {
				UID: person.UID,
				person: person		
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

		var svg = d3.select(selector).append("svg").attr("width", width).attr("height", height);
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
			});

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
				    .attr("r", 9);
				    
				vertexOn.style("fill", options.nodeColor);
				
				vertexOn.exit().remove();



				forceWeb
					.charge(funcOrZeroIfNot(options.charge, options.nodeFilter))
					.linkStrength(funcOrZeroIfNot(options.linkStrength, edgeIsIncluded))
					.linkDistance(options.linkDistance)
					.friction(.95);

				if (options.energy !== 0) {
					forceWeb
						.start()
						.alpha(options.energy);
				}
			}
		}
	}
})();