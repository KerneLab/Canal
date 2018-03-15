var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test leftJoin", function()
{
	var mapper = function(l, r)
	{
		return [ l, r.or("_") ];
	};

	it("leftJoin()", function()
	{
		var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "b", 3 ], [ "c", 4 ] ]) //
		.leftJoin(Canal.of([ [ "b", 1 ], [ "c", 2 ], [ "d", 3 ] ])) //
		.mapJoint(mapper).collect();
		expect(result).to.eql([ [ 1, "_" ], [ 2, 1 ], [ 3, 1 ], [ 4, 2 ] ]);
	});

	it("leftJoin() partially", function()
	{
		var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "b", 3 ], [ "c", 4 ] ]) //
		.leftJoin(Canal.of([ [ "b", 1 ], [ "c", 2 ], [ "d", 3 ] ])) //
		.mapJoint(mapper).take(2);
		expect(result).to.eql([ [ 1, "_" ], [ 2, 1 ] ]);
	});

	it("leftJoin() 1 vs empty", function()
	{
		var result = Canal.of([ [ "a", 1 ] ]).leftJoin(Canal.of([])) //
		.mapJoint(mapper).collect();
		expect(result).to.eql([ [ 1, "_" ] ]);
	});

	it("leftJoin() 3 vs empty partially", function()
	{
		var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ]) //
		.leftJoin(Canal.of([])).mapJoint(mapper).take(2);
		expect(result).to.eql([ [ 1, "_" ], [ 2, "_" ] ]);
	});

	it("leftJoin() empty vs 1", function()
	{
		var result = Canal.of([]).leftJoin(Canal.of([ [ "b", 1 ] ])) //
		.mapJoint(mapper).collect();
		expect(result).to.eql([]);
	});

	it("leftJoin() empty vs empty", function()
	{
		var result = Canal.of([]).leftJoin(Canal.of([])) //
		.mapJoint(mapper).collect();
		expect(result).to.eql([]);
	});
});
