var random = require('./randomUtils');

var nonDegenerateLink = function (list, categories) {
	var sourceIndex = random.intUpTo(list.length);

	return {
		from: sourceIndex,
		to: random.intUpToNexceptFor(list.length, sourceIndex),
		topic: random.from(categories)
	};
};

var avgLinksPerPerson = 3;

var people = [
	{name: "Alice"},
	{name: "Bob"},
	{name: "Clair"},
	{name: "Daniel"},
	{name: "Elise"},
	{name: "Fredrick"},
	{name: "Gytha"},
	{name: "Havelock"},
	{name: "Ilya"},
	{name: "Johnathon"}
];

var topics = [
	".NET",
	"JavaScript",
	"HR question"
];

var links = [];

for (var i = people.length * avgLinksPerPerson; i > 0; i--) {
	links.push(nonDegenerateLink(people, topics));
}

console.log(JSON.stringify({
	nodes: people,
	links: links
}));