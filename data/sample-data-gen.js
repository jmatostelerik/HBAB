var utils = require("util");

var randIntUpTo = function(n) {
	return  Math.floor(Math.random() * n);
}

var randUpToNexceptFor = function (n, excludedNumber) {
	var result = randIntUpTo(n - 1);
	if (result >= excludedNumber) {
		result++;
	}

	return result;
}

var randFrom = function (list) {
	return list[randIntUpTo(list.length)];
}

var nonDegenerateLink = function (list, categories) {
	var sourceIndex = randIntUpTo(list.length);

	return {
		from: sourceIndex,
		to: randUpToNexceptFor(list.length, sourceIndex),
		topic: randFrom(categories)
	}
}

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
]

var topics = [
	".NET",
	"JavaScript",
	"HR question"
]

var links = []

for (var i = people.length * avgLinksPerPerson; i > 0; i--) {
	links.push(nonDegenerateLink(people, topics));
}

console.log(utils.inspect({
	nodes: people,
	links: links
}));