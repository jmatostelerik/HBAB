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
		}
	}

	var newLink = function (list) {
		return function (indexLink) {
			return {
				UID: nextID(),
				sourceUID: list[indexLink.sourceIndex].UID,
				targetUID: list[indexLink.targetIndex].UID,
				weight: indexLink.weight
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
					var numSuperStars = 4;
					var starPower = 8;

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
							if (people[fromIndex].team === people[toIndex].team)
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
