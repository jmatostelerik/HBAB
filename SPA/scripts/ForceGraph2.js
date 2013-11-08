var newForceGraph = function(pristineData, selector, height, width) {
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

	var svg = d3.select(selector)
		.append("svg")
		.attr("height", height)
		.attr("width", width);
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
			vertexOn = domVertices().data(vertices, UIDkey);
			
			vertexOn.enter()
			    .append("circle")
			    .attr("class", "node")
			    .attr("r", 9);
			    
			vertexOn.style("fill", options.nodeColor);
			
			vertexOn.exit().remove();

			edgeOn = domEdges().data(edges, UIDkey);
			
			edgeOn.enter()
				.append("line")
				.attr("class", "link");
				//.style("stroke-width", options.strokeWidth);

			edgeOn.exit().remove();

			edgeOn.style("stroke-width", options.strokeWidth);

			forceWeb
				.charge(options.charge)
				.linkStrength(options.linkStrength)
				.linkDistance(options.linkDistance)
				.start();
		}
	};
};