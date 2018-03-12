var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test union", function()
{
	it("union() 1 2 vs 2 3", function()
	{
		var result = Canal.of([ 1, 2 ]) //
		.union(Canal.of([ 2, 3 ])).collect();
		expect(result).to.eql([ 1, 2, 2, 3 ]);
	});

	it("union() 1 2 vs 2 3 vs 4 5", function()
	{
		var result = Canal.of([ 1, 2 ]) //
		.union(Canal.of([ 2, 3 ])) //
		.union(Canal.of([ 4, 5 ])).collect();
		expect(result).to.eql([ 1, 2, 2, 3, 4, 5 ]);
	});

	it("union() 1 2 vs empty", function()
	{
		var result = Canal.of([ 1, 2 ]) //
		.union(Canal.of([])).collect();
		expect(result).to.eql([ 1, 2 ]);
	});

	it("union() 1 2 vs null", function()
	{
		var result = Canal.of([ 1, 2 ]) //
		.union(null).collect();
		expect(result).to.eql([ 1, 2 ]);
	});

	it("union() empty vs 2 3", function()
	{
		var result = Canal.of([]) //
		.union(Canal.of([ 2, 3 ])).collect();
		expect(result).to.eql([ 2, 3 ]);
	});

	it("union() empty vs empty", function()
	{
		var result = Canal.of([]) //
		.union(Canal.of([])).collect();
		expect(result).to.eql([]);
	});
});
