var Canal = require('../canal');

describe("Test keys", function(){

it("keys() 3", function()
{
	var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ] ]).keys()
			.collect();
	expect(result).toEqual([ "a", "b", "c" ]);
});

it("keys() 1", function()
{
	var result = Canal.of([ [ "a", 1 ] ]).keys().collect();
	expect(result).toEqual([ "a" ]);
});

it("keys() empty", function()
{
	var result = Canal.of([]).keys().collect();
	expect(result).toEqual([]);
});

});
