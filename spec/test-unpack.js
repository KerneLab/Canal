var Canal = require('../canal');

describe("Test unpack", function(){

it("unpack() 3", function()
{
	var result = Canal.of([ [ 1, 2 ], [ 2, 3 ], [ 3, 4 ] ]) //
	.unpack(function(a, b)
	{
		return a + b;
	}).collect();
	expect(result).toEqual([ 3, 5, 7 ]);
});

it("unpack() 1", function()
{
	var result = Canal.of([ [ 1, 2, 3 ] ]) //
	.unpack(function(a, b, c)
	{
		return a * b;
	}).collect();
	expect(result).toEqual([ 2 ]);
});

it("unpack() empty", function()
{
	var result = Canal.of([]) //
	.unpack(function(a, b)
	{
		return a + b;
	}).collect();
	expect(result).toEqual([]);
});

});
