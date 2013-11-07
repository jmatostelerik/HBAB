(function () {
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
			source: sourceIndex,
			target: random.intUpToNexceptFor(list.length, sourceIndex),
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
									source: fromIndex,
									target: toIndex,
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
								source: starIndex,
								target: random.intUpToNexceptFor(numPeople, starIndex),
								weight: random.intUpTo(8)
							})
						}
					}
				}

				callback(error, { nodes: people, links: links });
			});
		}
	}
})();
