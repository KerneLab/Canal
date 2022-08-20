var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test batch", function()
{
	it("batch(2)", function()
	{
		var result = [];
		Canal.of([ 1, 2, 3 ]).batch(2, function(c)
		{
			result.push(c.collect());
		});
		expect(result).to.eql([ [1,2], [3] ]);
	});

	it("batch(2) 1", function()
	{
		var result = [];
		Canal.of([ 1 ]).batch(2, function(c)
		{
			result.push(c.collect());
		});
		expect(result).to.eql([ [1] ]);
	});

	it("batch() 2", function()
	{
		var result = [];
		Canal.of([ 1, 2 ]).batch();
		expect(result).to.eql([ ]);
	});

	it("batch() empty", function()
	{
		var result = [];
		Canal.of([]).batch();
		expect(result).to.eql([]);
	});
});
