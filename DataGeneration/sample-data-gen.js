var random = require('./randomUtils');
var people = require('./hackathonGroups');

var nonDegenerateLink = function (list) {
	var sourceIndex = random.intUpTo(list.length);

	return {
		source: sourceIndex,
		target: random.intUpToNexceptFor(list.length, sourceIndex),
		value: random.intUpTo(3) + random.intUpTo(4)
	};
};

var avgLinksPerPerson = 3;

// var topics = [
// 	".NET",
// 	"JavaScript",
// 	"HR question"
// ];

var links = [];

for (var i = people.length * avgLinksPerPerson; i > 0; i--) {
	links.push(nonDegenerateLink(people));
}

console.log(JSON.stringify({
	nodes: people.map(function (person) {
		return {
			name: person.Name,
			group: person.TeamNumber
		};
	}),
	links: links
}));