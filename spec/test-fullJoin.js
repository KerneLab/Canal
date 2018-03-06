var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test fullJoin", function(){

it("fullJoin()", function()
{
	var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "b", 3 ] ]).fullJoin(
			Canal.of([ [ "b", 1 ], [ "c", 2 ] ])).mapJoint(function(l, r)
	{
		return [ l.or("_"), r.or("_") ];
	}).collect();
	expect(result).to.eql([ [ 1, "_" ], [ 2, 1 ], [ 3, 1 ], [ "_", 2 ] ]);
});

it("fullJoin() 1 vs empty", function()
{
	var result = Canal.of([ [ "a", 1 ] ]).fullJoin(Canal.of([])).mapJoint(
			function(l, r)
			{
				return [ l.or("_"), r.or("_") ];
			}).collect();
	expect(result).to.eql([ [ 1, "_" ] ]);
});

it("fullJoin() empty vs 1", function()
{
	var result = Canal.of([]).fullJoin(Canal.of([ [ "b", 1 ] ])).mapJoint(
			function(l, r)
			{
				return [ l.or("_"), r.or("_") ];
			}).collect();
	expect(result).to.eql([ [ "_", 1 ] ]);
});

it("fullJoin() empty vs empty", function()
{
	var result = Canal.of([]).fullJoin(Canal.of([])).mapJoint(function(l, r)
	{
		return [ l.or("_"), r.or("_") ];
	}).collect();
	expect(result).to.eql([]);
});

});
