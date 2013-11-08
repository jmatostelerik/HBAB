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

		return ((Math.log(size) / Math.log(7) ) / (Math.pow(size, 2) / 49));
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
			rawPeople = [
  {
    "TeamNumber": 1,
    "Name": "Sasha Krsmanovic",
    "Telerik E-mail Alias": "Sasha.Krsmanovic@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 1,
    "Name": "Abhishek Kant",
    "Telerik E-mail Alias": "abhishek.kant@telerik.com",
    "Skill": "Business",
    "Location": "APAC",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 1,
    "Name": "Dhananjay Kumar",
    "Telerik E-mail Alias": "dhananjay.kumar@telerik.com",
    "Skill": "Engineering",
    "Location": "APAC",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 1,
    "Name": "Lohith Goudagere Nagaraj",
    "Telerik E-mail Alias": "lohith.nagaraj@telerik.com",
    "Skill": "Engineering",
    "Location": "APAC",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 1,
    "Name": "John Bristowe",
    "Telerik E-mail Alias": "john.bristowe@telerik.com",
    "Skill": "Engineering",
    "Location": "APAC",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 1,
    "Name": "Faris Sweis",
    "Telerik E-mail Alias": "fariss@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 1,
    "Name": "Svetla Yankova ",
    "Telerik E-mail Alias": "Svetla.Yankova@telerik.com",
    "Skill": "Design",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 2,
    "Name": "Tim Tognacci | Telerik",
    "Telerik E-mail Alias": "tim.tognacci@telerik.com",
    "Skill": "Business",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 2,
    "Name": "Anthony Abdulla",
    "Telerik E-mail Alias": "Anthony.Abdulla@telerik.com",
    "Skill": "Business",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 2,
    "Name": "Grant Bellinghausen",
    "Telerik E-mail Alias": "grant.bellinghausen@telerik.com",
    "Skill": "Business",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 2,
    "Name": "Caitlin Steinert",
    "Telerik E-mail Alias": "caitlin.steinert@telerik.com",
    "Skill": "Design",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 2,
    "Name": "Paul Townsend",
    "Telerik E-mail Alias": "paul.townsend@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 2,
    "Name": "Jason McIntosh",
    "Telerik E-mail Alias": "jason.mcintosh@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 2,
    "Name": "Robert Shoemate",
    "Telerik E-mail Alias": "shoemate@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 2,
    "Name": "Carey Payette",
    "Telerik E-mail Alias": "carey.payette@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 3,
    "Name": "Anton Hristov",
    "Telerik E-mail Alias": "anton.hristov@telerik.com",
    "Skill": "Business",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 3,
    "Name": "Nadezhda Stoyanova",
    "Telerik E-mail Alias": "nadezhda.stoyanova@telerik.com",
    "Skill": "Business",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 3,
    "Name": "Craig Palenshus",
    "Telerik E-mail Alias": "craig.palenshus@telerik.com",
    "Skill": "Design",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 3,
    "Name": "Phil Japikse",
    "Telerik E-mail Alias": "phil.japikse@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 3,
    "Name": "Jeff Fritz",
    "Telerik E-mail Alias": "fritz@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 3,
    "Name": "Steve Smith",
    "Telerik E-mail Alias": "steve.smith@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 3,
    "Name": "Chris Wagner",
    "Telerik E-mail Alias": "Chris.Wagner@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 4,
    "Name": "Brian Field",
    "Telerik E-mail Alias": "brian.field@telerik.com",
    "Skill": "Business",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 4,
    "Name": "Rodney Manor",
    "Telerik E-mail Alias": "Rodney.Manor@telerik.com",
    "Skill": "Business",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 4,
    "Name": "Gerard Juarez",
    "Telerik E-mail Alias": "gerard.juarez@telerik.com",
    "Skill": "Design",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 4,
    "Name": "Claude McCracken",
    "Telerik E-mail Alias": "claude.mccracken@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 4,
    "Name": "Quinn McTiernan",
    "Telerik E-mail Alias": "quinn.mctiernan@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 4,
    "Name": "Jeff Valore",
    "Telerik E-mail Alias": "jeff.valore@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 4,
    "Name": "Steven Vore",
    "Telerik E-mail Alias": "steven.vore@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 5,
    "Name": "Stefan Gyoshev | Telerik",
    "Telerik E-mail Alias": "stefan.gyoshev@telerik.com",
    "Skill": "Business",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 5,
    "Name": "Christopher Park | Telerik",
    "Telerik E-mail Alias": "christopher.park@telerik.com",
    "Skill": "Business",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 5,
    "Name": "Lance McCarthy | Telerik",
    "Telerik E-mail Alias": "lance.mccarthy@telerik.com",
    "Skill": "Design",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 5,
    "Name": "Rich Hildebrand",
    "Telerik E-mail Alias": "rich.hildebrand@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 5,
    "Name": "David Longshore",
    "Telerik E-mail Alias": "david.longshore@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 5,
    "Name": "John Matos",
    "Telerik E-mail Alias": "john.matos@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 5,
    "Name": "Todd Ropog",
    "Telerik E-mail Alias": "todd.ropog@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 6,
    "Name": "Tanya Veleva",
    "Telerik E-mail Alias": "Tanya.Veleva@telerik.com",
    "Skill": "Business",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 6,
    "Name": "Daniel Levy | Telerik",
    "Telerik E-mail Alias": "daniel.levy@telerik.com",
    "Skill": "Business",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 6,
    "Name": "Marcus Mosby",
    "Telerik E-mail Alias": "marcus.mosby@telerik.com",
    "Skill": "Design",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 6,
    "Name": "Brendan Enrick",
    "Telerik E-mail Alias": "brendan.enrick@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 6,
    "Name": "Tom Yee",
    "Telerik E-mail Alias": "tom.yee@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 6,
    "Name": "Ignacio Fuentes",
    "Telerik E-mail Alias": "ignacio.fuentes@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 6,
    "Name": "Richard Hellwege | Telerik",
    "Telerik E-mail Alias": "richard.hellwege@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 6,
    "Name": "Kevin Kuebler",
    "Telerik E-mail Alias": "kuebler@telerik.com",
    "Skill": "Engineering",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 7,
    "Name": "Eigil Rosager Poulsen",
    "Telerik E-mail Alias": "eigil@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 7,
    "Name": "Michael Pickett",
    "Telerik E-mail Alias": "michael.pickett@telerik.com",
    "Skill": "Design",
    "Location": "North America",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 7,
    "Name": "Soren Enemaerke",
    "Telerik E-mail Alias": "soren.enemaerke@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 7,
    "Name": "Morten Damsgaard",
    "Telerik E-mail Alias": "morten@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 7,
    "Name": "Jan Blessenohl",
    "Telerik E-mail Alias": "jan.blessenohl@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 8,
    "Name": "Gavril Gavrilov",
    "Telerik E-mail Alias": "Gavril.gavrilov@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 8,
    "Name": "Vassil Terziev",
    "Telerik E-mail Alias": "terziev@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 8,
    "Name": "Simeon Nenov",
    "Telerik E-mail Alias": "simeon.nenov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 8,
    "Name": "Konstantina Gocheva",
    "Telerik E-mail Alias": "konstantina.gocheva@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 8,
    "Name": "Georgi Atanasov",
    "Telerik E-mail Alias": "Georgi.Atanasov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 8,
    "Name": "Vasil Dininski",
    "Telerik E-mail Alias": "vasil.dininski@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 8,
    "Name": "Alexander Gyoshev",
    "Telerik E-mail Alias": "alexander.gyoshev@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 9,
    "Name": "Yordan Dimitrov",
    "Telerik E-mail Alias": "yordan.dimitrov@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 9,
    "Name": "Petya Bogdanova",
    "Telerik E-mail Alias": "petya.bogdanova@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 9,
    "Name": "Viktor Bukurov",
    "Telerik E-mail Alias": "viktor.bukurov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 9,
    "Name": "Kiril N. Nikolov",
    "Telerik E-mail Alias": "kiril.nikolov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 9,
    "Name": "Alexander Vakrilov",
    "Telerik E-mail Alias": "alexander.vakrilov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 9,
    "Name": "Stanimir Karoserov",
    "Telerik E-mail Alias": "stanimir.karoserov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 9,
    "Name": "Georgi Mateev",
    "Telerik E-mail Alias": "georgi.mateev@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 9,
    "Name": "Nikola Irinchev",
    "Telerik E-mail Alias": "nikola.irinchev@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 10,
    "Name": "Natasha Mullins",
    "Telerik E-mail Alias": "Natasha.mullins@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 10,
    "Name": "Assia Iossifova",
    "Telerik E-mail Alias": "assia.iossifova@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 10,
    "Name": "Svetlin Nikolaev",
    "Telerik E-mail Alias": "Svetlin.Nikolaev@telerik.com",
    "Skill": "Design",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 10,
    "Name": "Nikolay Kostov",
    "Telerik E-mail Alias": "nikolay.kostov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 10,
    "Name": "Viktor Staikov",
    "Telerik E-mail Alias": "Viktor.Staikov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 10,
    "Name": "Georgi Stavrev",
    "Telerik E-mail Alias": "georgi.stavrev@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 10,
    "Name": "Stefan Dobrev",
    "Telerik E-mail Alias": "stefan.dobrev@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 10,
    "Name": "Kamen Bundev",
    "Telerik E-mail Alias": "kamen.bundev@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 10,
    "Name": "Angel Angelov",
    "Telerik E-mail Alias": "angel.angelov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 11,
    "Name": "Antonia Bozhkova",
    "Telerik E-mail Alias": "antonia.bozhkova@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 11,
    "Name": "Kaloyan Kapralov",
    "Telerik E-mail Alias": "kaloyan.kapralov@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 11,
    "Name": "George P Petrov",
    "Telerik E-mail Alias": "GeorgeP.Petrov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 11,
    "Name": "Anton Sotirov",
    "Telerik E-mail Alias": "anton.sotirov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 11,
    "Name": "Pavel Kolev",
    "Telerik E-mail Alias": "pavel.kolev@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 11,
    "Name": "Kristian D. Dimitrov",
    "Telerik E-mail Alias": "KristianD.Dimitrov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 11,
    "Name": "Vladimir Amiorkov",
    "Telerik E-mail Alias": "Vladimir.Amiorkov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 11,
    "Name": "Ivan A. Petrov",
    "Telerik E-mail Alias": "ivan.a.petrov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 11,
    "Name": "Nikodim Lazarov",
    "Telerik E-mail Alias": "nikodim.lazarov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 12,
    "Name": "Kalina Maneva",
    "Telerik E-mail Alias": "kalina.maneva@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 12,
    "Name": "Momchil Andreev",
    "Telerik E-mail Alias": "momchil.andreev@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 12,
    "Name": "Lyubomir Dokov",
    "Telerik E-mail Alias": "lyubomir.dokov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 12,
    "Name": "Antonio Stoilkov",
    "Telerik E-mail Alias": "antonio.stoilkov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 12,
    "Name": "Yanaki Yanakiev",
    "Telerik E-mail Alias": "yanaki.yanakiev@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 12,
    "Name": "Svetoslav Petsov",
    "Telerik E-mail Alias": "svetoslav.petsov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 12,
    "Name": "Peter V. Kirov",
    "Telerik E-mail Alias": "pvkirov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 13,
    "Name": "Mariya Rashkovska",
    "Telerik E-mail Alias": "Mariya.Rashkovska@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 13,
    "Name": "Nikolaj Wahl-Rasmussen",
    "Telerik E-mail Alias": "nikolaj.wahl-rasmussen@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 13,
    "Name": "Kalin Milanov",
    "Telerik E-mail Alias": "kalin.milanov@telerik.com",
    "Skill": "Design",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 13,
    "Name": "Ivan Stefanov",
    "Telerik E-mail Alias": "ivan.stefanov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 13,
    "Name": "Rasmus Svendsen",
    "Telerik E-mail Alias": "svendsen@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 13,
    "Name": "Boyko Karadzhov",
    "Telerik E-mail Alias": "Boyko.Karadzhov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 13,
    "Name": "Thomas Andersen",
    "Telerik E-mail Alias": "thomas.andersen@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 14,
    "Name": "Martin Kirov",
    "Telerik E-mail Alias": "martin.kirov@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 14,
    "Name": "Elena Pundjeva",
    "Telerik E-mail Alias": "elena.pundjeva@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 14,
    "Name": "Vasil Yordanov",
    "Telerik E-mail Alias": "vasil.yordanov@telerik.com",
    "Skill": "Design",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 14,
    "Name": "Martin Gebov",
    "Telerik E-mail Alias": "martin.gebov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 14,
    "Name": "Rayko Grozdanov",
    "Telerik E-mail Alias": "rayko.grozdanov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 14,
    "Name": "Bulent Karaahmed",
    "Telerik E-mail Alias": "Bulent.Karaahmed@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 14,
    "Name": "Ivan Stoyanov",
    "Telerik E-mail Alias": "ivan.stoyanov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 14,
    "Name": "Tihomir Petrov",
    "Telerik E-mail Alias": "Tihomir.Petrov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 15,
    "Name": "Vassil Petev",
    "Telerik E-mail Alias": "vpetev@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 15,
    "Name": "Marin Sotirov",
    "Telerik E-mail Alias": "marin.sotirov@telerik.com",
    "Skill": "Design",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 15,
    "Name": "Martin Penkov",
    "Telerik E-mail Alias": "martin.penkov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 15,
    "Name": "Tihomir Valkanov",
    "Telerik E-mail Alias": "tihomir.valkanov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 15,
    "Name": "Dimitrina Petrova",
    "Telerik E-mail Alias": "dimitrina.petrova@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 15,
    "Name": "Richard Flamsholt",
    "Telerik E-mail Alias": "richard.flamsholt@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 15,
    "Name": "Ivaylo Gergov",
    "Telerik E-mail Alias": "Ivaylo.Gergov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 16,
    "Name": "Svetla Kantcheva",
    "Telerik E-mail Alias": "svetla.kantcheva@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 16,
    "Name": "Vesselina Tasheva",
    "Telerik E-mail Alias": "vesselina.tasheva@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 16,
    "Name": "Erjan Gavalji",
    "Telerik E-mail Alias": "erjan.gavalji@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 16,
    "Name": "Rositsa Topchiyska",
    "Telerik E-mail Alias": "rositsa.topchiyska@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 16,
    "Name": "Tsvetan Raikov",
    "Telerik E-mail Alias": "tsvetan.raikov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 16,
    "Name": "Ivaylo Kenov",
    "Telerik E-mail Alias": "Ivaylo.Kenov@Telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 16,
    "Name": "Miroslav Miroslavov",
    "Telerik E-mail Alias": "miroslav.miroslavov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 17,
    "Name": "Ivailo Ivanov",
    "Telerik E-mail Alias": "ivailo.ivanov@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 17,
    "Name": "Hristo Borisov",
    "Telerik E-mail Alias": "hristo.borisov@telerik.com",
    "Skill": "Business",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 17,
    "Name": "Rumen Paletov",
    "Telerik E-mail Alias": "rumen.paletov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 17,
    "Name": "Miroslav Nedyalkov",
    "Telerik E-mail Alias": "miroslav.nedyalkov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 17,
    "Name": "Filip Slanchev",
    "Telerik E-mail Alias": "filip.slanchev@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 17,
    "Name": "Tsvyatko Konov",
    "Telerik E-mail Alias": "tsvyatko.konov@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  },
  {
    "TeamNumber": 17,
    "Name": "Jordan Ilchev",
    "Telerik E-mail Alias": "jordan.ilchev@telerik.com",
    "Skill": "Engineering",
    "Location": "Europe",
    "Assigned": "Yes"
  }
]
				var links = [];
				var people = [];

				if (rawPeople !== undefined && rawPeople.length !== undefined)
				{
					var numSuperStars = 3;
					var starPower = 50;

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
							var link = newPeopleLink({
								sourceIndex: starIndex,
								targetIndex: random.intUpToNexceptFor(numPeople, starIndex),
							});

							while (link.otherWeight < 1) {
								link = newPeopleLink({
									sourceIndex: starIndex,
									targetIndex: random.intUpToNexceptFor(numPeople, starIndex),
								});
							}
							links.push(link);
						}
					}
				}

				callback(null, { people: people, relationships: links });
		}
	}
})();
