(function () {
	var _lastID = 10000;
	var nextID = function () { _lastID++; return _lastID; }

	var intUpTo = function(n) {
		return  Math.floor(Math.random() * n);
	};

	var random = {
		intUpTo: intUpTo,
		intUpToNexceptFor: function (n, excludedNumber) {
			var result = intUpTo(n - 1);
			if (result >= excludedNumber) {
				result++;
			}

			return result;
		},
		from: function (list) {
			return list[intUpTo(list.length)];
 		},
 		coinFlip: function () { return Math.random() < .5; }
	}

	var whatAreTheyTalkingAbout = function (alice, bob) { 
		var devlanguages = ["JavaScript", "JavaScript", "C#"," C#", "C#", "XAML", "HTML", "CSS", "SQL"];
		var designLanguages = ["HTML", "HTML", "XAML", "CSS", "CSS"]
		var products = ["RadControls", "RadControls", "RadControls", "Kendo UI", "Sitefinity", "Icenium", "Icenium"];
		var miscellaneous = ["Football", "Internal news", "Internal news", "Internal news", "Social (not football)"]

		if (random.coinFlip()) { return random.from(miscellaneous); }

		if (alice["Skill"] === "Engineering") {
			return random.from(random.coinFlip() ? devlanguages : products);
		} else if (alice["Skill"] === "Design") {
			return random.from(random.coinFlip() ? products : designLanguages);
		} else {
			return random.from(random.coinFlip() ? products : miscellaneous);
		}
	};

	var newLink = function (list) {
		return function (indexLink) {
			var leftPerson = list[indexLink.sourceIndex];
			var rightPerson = list[indexLink.targetIndex];
			return {
				UID: nextID(),
				sourceUID: leftPerson.UID,
				targetUID: rightPerson.UID,
				weight: indexLink.weight,
				topic: whatAreTheyTalkingAbout(leftPerson, rightPerson)
			}
		};
	}

	var nonDegenerateLink = function (list) {
		var sourceIndex = random.intUpTo(list.length);

		return newLink(list)({
			sourceIndex: sourceIndex,
			targetIndex: random.intUpToNexceptFor(list.length, sourceIndex),
			weight: (random.intUpTo(3) + random.intUpTo(4))
		});
	};

	window.NetworkRepository = {
		CallWithNetworkData: function (ignoredOptions, callback) {
			d3.json("data/hackathonGroups.json", function (error, rawPeople) {
				var links = [];
				var people = [];

				if (rawPeople !== undefined && rawPeople.length !== undefined)
				{
					var avgLinksPerPerson = 1;
					var numSuperStars = 3;
					var starPower = 15;

					people = rawPeople.map(function (person) {
						return {
							UID: nextID(),
							name: person.Name,
							team: person.TeamNumber,
							location: person.Location,
							role: person.Skill,
							email: person.Email
						};
					});

					var numPeople = people.length;
					var newPeopleLink = newLink(people);

					for (var i = numPeople * avgLinksPerPerson; i > 0; i--) {
						links.push(nonDegenerateLink(people));
					}

					for (var fromIndex = 0; fromIndex < numPeople; fromIndex++) {
						for (var toIndex = fromIndex + 1; toIndex < numPeople; toIndex++) {
							var left = people[fromIndex];
							var right = people[toIndex];
							if (left.team === right.team && random.intUpTo(3) !== 0)
							{
								links.push(
									newPeopleLink({
										sourceIndex: fromIndex,
										targetIndex: toIndex,
										weight: 2
									})
								)
							}
						}
					}

					for (var i = 0; i < numSuperStars; i++)
					{
						var starIndex = random.intUpTo(numPeople);
						for (var j = 0; j < starPower; j++)
						{
							links.push(newPeopleLink({
								sourceIndex: starIndex,
								targetIndex: random.intUpToNexceptFor(numPeople, starIndex),
								weight: random.intUpTo(8)
							}));
						}
					}
				}

				callback(error, { people: people, relationships: links });
			});
		}
	}
})();
