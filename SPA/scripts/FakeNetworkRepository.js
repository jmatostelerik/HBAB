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
		}
	}

	var nonDegenerateLink = function (list) {
		var sourceIndex = random.intUpTo(list.length);

		return {
			sourceUID: list[sourceIndex].UID,
			targetUID: list[random.intUpToNexceptFor(list.length, sourceIndex)].UID,
			weight: (random.intUpTo(3) + random.intUpTo(4))
		};
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

					for (var i = numPeople * avgLinksPerPerson; i > 0; i--) {
						links.push(nonDegenerateLink(people));
					}

					for (var fromIndex = 0; fromIndex < numPeople; fromIndex++) {
						for (var toIndex = fromIndex + 1; toIndex < numPeople; toIndex++) {
							if (people[fromIndex].team === people[toIndex].team)
							{
								links.push({
									sourceUID: people[fromIndex].UID,
									targetUID: people[toIndex].UID,
									weight: 2
								})
							}
						}
					}

					for (var i = 0; i < numSuperStars; i++)
					{
						var starIndex = random.intUpTo(numPeople);
						for (var j = 0; j < starPower; j++)
						{
							links.push({
								sourceUID: people[starIndex].UID,
								targetUID: people[random.intUpToNexceptFor(numPeople, starIndex)].UID,
								weight: random.intUpTo(8)
							})
						}
					}
				}

				links.forEach(function (link) { link.UID = nextID(); });

				callback(error, { people: people, relationships: links });
			});
		}
	}
})();
