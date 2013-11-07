(function () {
	var intUpTo = function(n) {
		return  Math.floor(Math.random() * n);
	};

	module.exports = {
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
})();