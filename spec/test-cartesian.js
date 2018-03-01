var Canal = require('../canal');

describe("Test cartesian", function(){
	
it("cartesian() 3 vs 2", function()
{
	var result = Canal.of([ 1, 2, 3 ]).cartesian(Canal.of([ "A", "B" ]))
			.collect();
	expect(result).toEqual([ [ 1, "A" ], [ 1, "B" ], [ 2, "A" ], [ 2, "B" ],
			[ 3, "A" ], [ 3, "B" ] ]);
});

it("cartesian() 3 vs 1", function()
{
	var result = Canal.of([ 1, 2, 3 ]).cartesian(Canal.of([ "A" ])).collect();
	expect(result).toEqual([ [ 1, "A" ], [ 2, "A" ], [ 3, "A" ] ]);
});

it("cartesian() 1 vs 2", function()
{
	var result = Canal.of([ 1 ]).cartesian(Canal.of([ "A", "B" ])).collect();
	expect(result).toEqual([ [ 1, "A" ], [ 1, "B" ] ]);
});

it("cartesian() 3 vs 0", function()
{
	var result = Canal.of([ 1, 2, 3 ]).cartesian(Canal.of([])).collect();
	expect(result).toEqual([]);
});

it("cartesian() 0 vs 2", function()
{
	var result = Canal.of([]).cartesian(Canal.of([ "A", "B" ])).collect();
	expect(result).toEqual([]);
});

it("cartesian() 0 vs 0", function()
{
	var result = Canal.of([]).cartesian(Canal.of([])).collect();
	expect(result).toEqual([]);
});

});
