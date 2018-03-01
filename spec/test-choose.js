var Canal = require('../canal');

describe("Test choose", function(){

it("choose() 1 2 3", function()
{
	var result = Canal.of([ [ 1, 2 ], [ 3, 2 ], [ 3, 1 ] ]) //
	.choose(function(a, b)
	{
		return a > b;
	}).collect();
	expect(result).toEqual([ [ 3, 2 ], [ 3, 1 ] ]);
});

it("choose() 1", function()
{
	var result = Canal.of([ [ 3, 2 ] ]) //
	.choose(function(a, b)
	{
		return a > b;
	}).collect();
	expect(result).toEqual([ [ 3, 2 ] ]);
});

it("choose() 0", function()
{
	var result = Canal.of([ [ 1, 2 ] ]) //
	.choose(function(a, b)
	{
		return a > b;
	}).collect();
	expect(result).toEqual([]);
});

it("choose() empty", function()
{
	var result = Canal.of([]) //
	.choose(function(a, b)
	{
		return a > b;
	}).collect();
	expect(result).toEqual([]);
});

});
