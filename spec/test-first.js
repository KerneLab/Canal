var Canal = require('../canal');

describe("Test first", function(){

it("first()", function()
{
	var result = Canal.of([ 1, 2, 3 ]).first().or("_");
	expect(result).toBe(1);
});

it("first() empty", function()
{
	var result = Canal.of([]).first().or("_");
	expect(result).toBe("_");
});

it("first(pred)", function()
{
	var result = Canal.of([ 1, 2, 3 ]).first(function(d)
	{
		return d > 2;
	}).or("_");
	expect(result).toBe(3);
});

it("first(pred) empty", function()
{
	var result = Canal.of([]).first(function(d)
	{
		return d > 2;
	}).or("_");
	expect(result).toBe("_");
});

});
