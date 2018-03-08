var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test cogroup", function()
{
	it("cogroup()", function()
	{
		var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "b", 3 ], [ "c", 4 ] ]).cogroup(
				Canal.of([ [ "b", 1 ], [ "c", 2 ] ])).collect();
		expect(result).to.eql([ [ "a", [ [ 1 ], [] ] ], [ "b", [ [ 2, 3 ], [ 1 ] ] ], [ "c", [ [ 4 ], [ 2 ] ] ] ]);
	});

	it("cogroup() partially", function()
	{
		var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "b", 3 ], [ "c", 4 ] ]).cogroup(
				Canal.of([ [ "b", 1 ], [ "c", 2 ] ])).take(2);
		expect(result).to.eql([ [ "a", [ [ 1 ], [] ] ], [ "b", [ [ 2, 3 ], [ 1 ] ] ] ]);
	});

	it("cogroup() 1 vs empty", function()
	{
		var result = Canal.of([ [ "a", 1 ] ]).cogroup(Canal.of([])).collect();
		expect(result).to.eql([ [ "a", [ [ 1 ], [] ] ] ]);
	});

	it("cogroup() empty vs 1", function()
	{
		var result = Canal.of([]).cogroup(Canal.of([ [ "a", 1 ] ])).collect();
		expect(result).to.eql([ [ "a", [ [], [ 1 ] ] ] ]);
	});

	it("cogroup() 2 vs 3 vs 1", function()
	{
		var result = Canal.of([ [ "a", 1 ], [ "b", 2 ] ]).cogroup(Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "b", 3 ] ]),
				Canal.of([ [ "c", 4 ] ])).collect();
		expect(result).to.eql([ [ "a", [ [ 1 ], [ 1 ], [] ] ], [ "b", [ [ 2 ], [ 2, 3 ], [] ] ],
				[ "c", [ [], [], [ 4 ] ] ] ]);
	});

	it("cogroup() empty vs empty", function()
	{
		var result = Canal.of([]).cogroup(Canal.of([])).collect();
		expect(result).to.eql([]);
	});
});
