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
		return {
			"postTeam": alice.team === bob.team ? random.intUpTo(3) : 0,
			"default": locationWeight(alice, bob) + skillWeight(alice, bob)
		}
	};

	chanceGroupMatters = function (size) {
		if (size < 4) {
			return 1;
		}

		return ((Math.log(size) / Math.log(4) ) / (Math.pow(size, 2) / 16));
	};

	var newLink = function (list) {
		var aspectWeight = function (key) {
			return function (alice, bob) {
				if (alice[key] !== bob[key]) { return 0; }

				var numPeopleWithAspect = list.filter(function (person) { return person[key] === alice[key] }).length;
				return Math.random() < chanceGroupMatters(numPeopleWithAspect) ? random.intUpTo(3) + 1 : 0
			}
		}

		return function (indexLink) {
			var leftPerson = list[indexLink.sourceIndex];
			var rightPerson = list[indexLink.targetIndex];
			var teamWeight = aspectWeight("team")(leftPerson, rightPerson);
			var otherWeight = aspectWeight("location")(leftPerson, rightPerson) + aspectWeight("role")(leftPerson, rightPerson);
			return {
				UID: nextID(),
				sourceUID: leftPerson.UID,
				targetUID: rightPerson.UID,
				teamWeight: teamWeight + otherWeight,
				otherWeight: otherWeight
			}
		};
	}

	var nonDegenerateLink = function (list) {
		var sourceIndex = random.intUpTo(list.length);

		return newLink(list)({
			sourceIndex: sourceIndex,
			targetIndex: random.intUpToNexceptFor(list.length, sourceIndex),
		});
	};

	window.NetworkRepository = {
		CallWithNetworkData: function (ignoredOptions, callback) {
			d3.json("data/hackathonGroups.json", function (error, rawPeople) {
				var links = [];
				var people = [];

				if (rawPeople !== undefined && rawPeople.length !== undefined)
				{
					var numSuperStars = 6;
					var starPower = 25;

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

					for (var fromIndex = 0; fromIndex < numPeople; fromIndex++) {
						for (var toIndex = fromIndex + 1; toIndex < numPeople; toIndex++) {
							var left = people[fromIndex];
							var right = people[toIndex];
							var link = newPeopleLink({
								sourceIndex: fromIndex,
								targetIndex: toIndex,
							});
							
							if (link.teamWeight > 0) {
								links.push(link);
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
