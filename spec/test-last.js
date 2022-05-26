var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test last", function()
{
	var pred = function(d)
	{
		return d < 3;
	};

	it("last()", function()
	{
		var result = Canal.of([ 1, 2, 3 ]).last().or("_");
		expect(result).to.be(3);
	});

	it("last() empty", function()
	{
		var result = Canal.of([]).last().or("_");
		expect(result).to.be("_");
	});

	it("last(pred)", function()
	{
		var result = Canal.of([ 1, 2, 3 ]).last(pred).or("_");
		expect(result).to.be(2);
	});

	it("last(pred) empty", function()
	{
		var result = Canal.of([]).last(pred).or("_");
		expect(result).to.be("_");
	});
});
