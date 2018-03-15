var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test first", function()
{
	var pred = function(d)
	{
		return d > 2;
	};

	it("first()", function()
	{
		var result = Canal.of([ 1, 2, 3 ]).first().or("_");
		expect(result).to.be(1);
	});

	it("first() empty", function()
	{
		var result = Canal.of([]).first().or("_");
		expect(result).to.be("_");
	});

	it("first(pred)", function()
	{
		var result = Canal.of([ 1, 2, 3 ]).first(pred).or("_");
		expect(result).to.be(3);
	});

	it("first(pred) empty", function()
	{
		var result = Canal.of([]).first(pred).or("_");
		expect(result).to.be("_");
	});
});
