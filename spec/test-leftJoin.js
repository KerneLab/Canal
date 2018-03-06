var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test leftJoin", function(){

it("leftJoin()", function()
{
	var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "b", 3 ], [ "c", 4 ] ])
			.leftJoin(Canal.of([ [ "b", 1 ], [ "c", 2 ], [ "d", 3 ] ]))
			.mapJoint(function(l, r)
			{
				return [ l, r.or("_") ];
			}).collect();
	expect(result).to.eql([ [ 1, "_" ], [ 2, 1 ], [ 3, 1 ], [ 4, 2 ] ]);
});

it("leftJoin() 1 vs empty", function()
{
	var result = Canal.of([ [ "a", 1 ] ]).leftJoin(Canal.of([])).mapJoint(
			function(l, r)
			{
				return [ l, r.or("_") ];
			}).collect();
	expect(result).to.eql([ [ 1, "_" ] ]);
});

it("leftJoin() empty vs 1", function()
{
	var result = Canal.of([]).leftJoin(Canal.of([ [ "b", 1 ] ])).mapJoint(
			function(l, r)
			{
				return [ l, r.or("_") ];
			}).collect();
	expect(result).to.eql([]);
});

it("leftJoin() empty vs empty", function()
{
	var result = Canal.of([]).leftJoin(Canal.of([])).mapJoint(function(l, r)
	{
		return [ l, r.or("_") ];
	}).collect();
	expect(result).to.eql([]);
});

});
