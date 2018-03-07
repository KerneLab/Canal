var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test groupBy", function()
{
	it("groupBy() 0:2 1:3 0:4", function()
	{
		var result = Canal.of([ 2, 3, 4 ]) //
		.groupBy(function(d)
		{
			return d % 2;
		}).collect();
		expect(result).to.eql([ [ "0", [ 2, 4 ] ], [ "1", [ 3 ] ] ]);
	});

	it("groupBy() 0:1", function()
	{
		var result = Canal.of([ 1 ]) //
		.groupBy(function(d)
		{
			return d - 1;
		}, function(d)
		{
			return d + 1;
		}).collect();
		expect(result).to.eql([ [ "0", [ 2 ] ] ]);
	});

	it("groupBy() partially", function()
	{
		var result = Canal.of([ 2, 3, 4 ]) //
		.groupBy(function(d)
		{
			return d % 2;
		}).take(1);
		expect(result).to.eql([ [ "0", [ 2, 4 ] ] ]);
	});

	it("groupBy() empty", function()
	{
		var result = Canal.of([]) //
		.groupBy().collect();
		expect(result).to.eql([]);
	});
});
