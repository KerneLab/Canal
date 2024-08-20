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

	it("zipWithIndex()", function()
	{
		var result = Canal.of([ "one", "two", "three" ]).zipWithIndex().collect();

		expect(result).to.eql([ [ "one", 0 ], [ "two", 1 ], [ "three", 2 ] ]);
	});
	
	it("zipWithEnd() 1", function()
	{
		var result = Canal.of([ "one" ]).zipWithEnd().collect();

		expect(result).to.eql([ [ "one", true ] ]);
	});
	
	it("zipWithEnd() empty", function()
	{
		var result = Canal.of([ ]).zipWithEnd().collect();

		expect(result).to.eql([ ]);
	});
	
	it("zipWithEnd()", function()
	{
		var result = Canal.of([ "one", "two", "three" ]).zipWithEnd().collect();

		expect(result).to.eql([ [ "one", false ], [ "two", false ], [ "three", true ] ]);
	});
});
