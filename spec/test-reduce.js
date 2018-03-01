var Canal = require('../canal');

describe("Test reduce", function(){

it("reduce()", function()
{
	var result = Canal.of([ 1, 2, 3, 4 ]).reduce(function(a, b)
	{
		return a * b;
	}).or("_");
	expect(result).toEqual(24);
});

it("reduce() 1 2", function()
{
	var result = Canal.of([ 1, 2 ]).reduce(function(a, b)
	{
		return a * b;
	}).or("_");
	expect(result).toEqual(2);
});

it("reduce() 1", function()
{
	var result = Canal.of([ 1 ]).reduce(function(a, b)
	{
		return a * b;
	}).or("_");
	expect(result).toEqual(1);
});

it("reduce() empty", function()
{
	var result = Canal.of([]).reduce(function(a, b)
	{
		return a * b;
	}).or("_");
	expect(result).toEqual("_");
});

});
