var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test map", function()
{
	var mapper = function(d)
	{
		return d / 2;
	};

	it("map() 1 2 3", function()
	{
		var result = Canal.of([ 1, 2, 3 ]) //
		.map(mapper).collect();
		expect(result).to.eql([ 0.5, 1, 1.5 ]);
	});

	it("map() 1", function()
	{
		var result = Canal.of([ 1 ]) //
		.map(mapper).collect();
		expect(result).to.eql([ 0.5 ]);
	});

	it("map() empty", function()
	{
		var result = Canal.of([]) //
		.map(mapper).collect();
		expect(result).to.eql([]);
	});
});
