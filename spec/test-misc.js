var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test miscellaneous", function()
{
	it("mapOfPairs(pairs)", function()
	{
		var map = Canal.mapOfPairs([ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ]);

		expect(map).to.eql({
			"a" : 1,
			"b" : 2,
			"c" : 3
		});
	});

	it("of(obj)", function()
	{
		var result = Canal.of({
			"a" : 1,
			"b" : 2,
			"c" : 3
		}).take(2);

		expect(result).to.eql([ [ "a", 1 ], [ "b", 2 ] ]);
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

	it("pairsOfMap() map keys", function()
	{
		var pairs = Canal.pairsOfMap({
			"a" : 1,
			"b" : 2,
			"c" : 3
		}, [ "b", "c", "a" ]);

		expect(pairs).to.eql([ [ "b", 2 ], [ "c", 3 ], [ "a", 1 ] ]);
	});

	it("sigum() l1 r1 l2 r2", function()
	{
		var cmp = Canal.signum(1, 1, 2, 3);

		expect(cmp).to.eql(-1);
	});

	it("sigum() l1 r1 l2 r2 l3 r3", function()
	{
		var cmp = Canal.signum(1, 1, 2, 2, 3, 1);

		expect(cmp).to.eql(1);
	});

	it("cmp() null null", function()
	{
		var cmp = Canal.cmp("id");

		expect(cmp(null, null)).to.eql(0);
	});

	it("cmp() null 1", function()
	{
		var cmp = Canal.cmp("id");

		expect(cmp(null, 1)).to.eql(-1);
	});

	it("cmp() 1 null", function()
	{
		var cmp = Canal.cmp("id");

		expect(cmp(1, null)).to.eql(1);
	});
	
	it("of(Canal)", function()
	{
		var res = Canal.of(Canal.of([ 1, 2, 3 ])).collect();

		expect(res).to.eql([ 1, 2, 3 ]);
	});

});
