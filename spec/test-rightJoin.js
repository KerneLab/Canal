var Canal = require('../canal');

describe("Test rightJoin", function(){

it("rightJoin()", function()
{
	var result = Canal.of([ [ "b", 1 ], [ "c", 2 ], [ "d", 3 ] ]).rightJoin(
			Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "b", 3 ], [ "c", 4 ] ]))
			.mapJoint(function(l, r)
			{
				return [ l.or("_"), r ];
			}).collect();
	expect(result).toEqual([ [ "_", 1 ], [ 1, 2 ], [ 1, 3 ], [ 2, 4 ] ]);
});

it("rightJoin() 1 vs empty", function()
{
	var result = Canal.of([ [ "b", 1 ] ]).rightJoin(Canal.of([])).mapJoint(
			function(l, r)
			{
				return [ l.or("_"), r ];
			}).collect();
	expect(result).toEqual([]);
});

it("rightJoin() empty vs 1", function()
{
	var result = Canal.of([]).rightJoin(Canal.of([ [ "a", 1 ] ])).mapJoint(
			function(l, r)
			{
				return [ l.or("_"), r ];
			}).collect();
	expect(result).toEqual([ [ "_", 1 ] ]);
});

it("rightJoin() empty vs empty", function()
{
	var result = Canal.of([]).rightJoin(Canal.of([])).mapJoint(function(l, r)
	{
		return [ l.or("_"), r ];
	}).collect();
	expect(result).toEqual([]);
});

});
