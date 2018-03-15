var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test choose", function()
{
	var chooser = function(a, b)
	{
		return a > b;
	};

	it("choose() 1 2 3", function()
	{
		var result = Canal.of([ [ 1, 2 ], [ 3, 2 ], [ 3, 1 ] ]) //
		.choose(chooser).collect();
		expect(result).to.eql([ [ 3, 2 ], [ 3, 1 ] ]);
	});

	it("choose() 1", function()
	{
		var result = Canal.of([ [ 3, 2 ] ]) //
		.choose(chooser).collect();
		expect(result).to.eql([ [ 3, 2 ] ]);
	});

	it("choose() 0", function()
	{
		var result = Canal.of([ [ 1, 2 ] ]) //
		.choose(chooser).collect();
		expect(result).to.eql([]);
	});

	it("choose() empty", function()
	{
		var result = Canal.of([]) //
		.choose(chooser).collect();
		expect(result).to.eql([]);
	});
});
