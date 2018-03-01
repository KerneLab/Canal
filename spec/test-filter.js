var Canal = require('../canal');

describe("Test filter", function(){

it("filter() 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]).filter(function(d)
	{
		return d > 2;
	}).collect();
	expect(result).toEqual([ 3 ]);
});

it("filter() 1 2", function()
{
	var result = Canal.of([ 1, 2 ]).filter(function(d)
	{
		return d > 2;
	}).collect();
	expect(result).toEqual([]);
});

it("filter() empty", function()
{
	var result = Canal.of([]).filter(function(d)
	{
		return d > 2;
	}).collect();
	expect(result).toEqual([]);
});

});
