var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test filter", function()
{
	var pred = function(d)
	{
		return d > 2;
	};

	it("filter() 1 2 3", function()
	{
		var result = Canal.of([ 1, 2, 3 ]).filter(pred).collect();
		expect(result).to.eql([ 3 ]);
	});

	it("filter() 1 2", function()
	{
		var result = Canal.of([ 1, 2 ]).filter(pred).collect();
		expect(result).to.eql([]);
	});

	it("filter() empty", function()
	{
		var result = Canal.of([]).filter(pred).collect();
		expect(result).to.eql([]);
	});
});
