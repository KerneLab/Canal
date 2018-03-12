var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test miscellaneous", function()
{
	it("mapOfPairs()", function()
	{
		var map = Canal.mapOfPairs([ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ]);

		expect(map).to.eql({
			"a" : 1,
			"b" : 2,
			"c" : 3
		});
	});

	it("pairsOfMap()", function()
	{
		var pairs = Canal.pairsOfMap({
			"a" : 1,
			"b" : 2,
			"c" : 3
		});

		expect(pairs).to.eql([ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ]);
	});
});
