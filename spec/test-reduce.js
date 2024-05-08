var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test reduce", function()
{
	var reducer = function(a, b)
	{
		return a * b;
	};

	it("reduce()", function()
	{
		var result = Canal.of([ 1, 2, 3, 4 ]).reduce(reducer).or("_");
		expect(result).to.eql(24);
	});

	it("reduce() 1 2", function()
	{
		var result = Canal.of([ 1, 2 ]).reduce(reducer).or("_");
		expect(result).to.eql(2);
	});

	it("reduce() 1", function()
	{
		var result = Canal.of([ 1 ]).reduce(reducer).or("_");
		expect(result).to.eql(1);
	});

	it("reduce() empty", function()
	{
		var result = Canal.of([]).reduce(reducer).or("_");
		expect(result).to.eql("_");
	});

	it("reduce() 1 2 until", function()
	{
		var result = Canal.of([ 1, 2 ]).reduce(reducer, function(r)
		{
			return r >= 2;
		}).or("_");
		expect(result).to.eql(2);
	});

	it("reduce() until empty", function()
	{
		var result = Canal.of([]).reduce(reducer, null).or("_");
		expect(result).to.eql("_");
	});
});
