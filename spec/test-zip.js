var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test zip", function()
{
	it("zip() 1 2 vs 2 3", function()
	{
		var result = Canal.of([ 1, 2 ]) //
		.zip(Canal.of([ 2, 3 ])).collect();
		expect(result).to.eql([ [ 1, 2 ], [ 2, 3 ] ]);
	});

	it("zip() 1 2 3 vs 2 3", function()
	{
		var result = Canal.of([ 1, 2, 3 ]) //
		.zip(Canal.of([ 2, 3 ])).collect();
		expect(result).to.eql([ [ 1, 2 ], [ 2, 3 ] ]);
	});

	it("zip() empty vs 1", function()
	{
		var result = Canal.of([]) //
		.zip(Canal.of([ 1 ])).collect();
		expect(result).to.eql([]);
	});

	it("zip() empty vs empty", function()
	{
		var result = Canal.of([]) //
		.zip(Canal.of([])).collect();
		expect(result).to.eql([]);
	});
	
	it("zipWithPhase() 1", function()
	{
		var result = Canal.of([ "one" ]).zipWithPhase().collect();

		expect(result).to.eql([ [ "one", 3 ] ]);
	});
	
	it("zipWithPhase() empty", function()
	{
		var result = Canal.of([ ]).zipWithPhase().collect();

		expect(result).to.eql([ ]);
	});
	
	it("zipWithPhase()", function()
	{
		var result = Canal.of([ "one", "two", "three" ]).zipWithPhase().collect();

		expect(result).to.eql([ [ "one", 1 ], [ "two", 0 ], [ "three", 2 ] ]);
	});

	it("zipWithIndex()", function()
	{
		var result = Canal.of([ "one", "two", "three" ]).zipWithIndex().collect();

		expect(result).to.eql([ [ "one", 0 ], [ "two", 1 ], [ "three", 2 ] ]);
	});
});
