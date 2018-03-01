var Canal = require('../canal');

describe("Test values", function(){

it("values() 3", function()
{
	var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ]).values()
			.collect();
	expect(result).toEqual([ 1, 2, 3 ]);
});

it("values() 1", function()
{
	var result = Canal.of([ [ "a", 1 ] ]).values().collect();
	expect(result).toEqual([ 1 ]);
});

it("values() empty", function()
{
	var result = Canal.of([]).values().collect();
	expect(result).toEqual([]);
});

});
