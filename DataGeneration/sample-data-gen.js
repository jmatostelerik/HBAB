var random = require('./randomUtils');
var people = require('./hackathonGroups');

var nonDegenerateLink = function (list) {
	var sourceIndex = random.intUpTo(list.length);

	return {
		source: sourceIndex,
		target: random.intUpToNexceptFor(list.length, sourceIndex),
		weight: (random.intUpTo(3) + random.intUpTo(4))
	};
};

var avgLinksPerPerson = 1;

// var topics = [
// 	".NET",
// 	"JavaScript",
// 	"HR question"
// ];

var links = [];

for (var i = people.length * avgLinksPerPerson; i > 0; i--) {
	links.push(nonDegenerateLink(people));
}

var modelPeople = people.map(function (person) {
	return {
		name: person.Name,
		team: person.TeamNumber
	};
});

var numPeople = modelPeople.length;

for (var fromIndex = 0; fromIndex < numPeople; fromIndex++) {
	for (var toIndex = fromIndex + 1; toIndex < numPeople; toIndex++) {
		if (modelPeople[fromIndex].team === modelPeople[toIndex].team)
		{
			links.push({
				source: fromIndex,
				target: toIndex,
				weight: 3
			})
		}
	}
}

console.log(JSON.stringify({
	nodes: modelPeople,
	links: links
}));