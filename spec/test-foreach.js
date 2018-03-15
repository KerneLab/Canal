var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test foreach", function()
{
	it("foreach()", function()
	{
		var result = [];
		Canal.of([ 1, 2, 3 ]).foreach(function(d, i)
		{
			result.push(d + "-" + i);
		});
		expect(result).to.eql([ "1-0", "2-1", "3-2" ]);
	});

	it("foreach() 1", function()
	{
		var result = [];
		Canal.of([ 1 ]).foreach(function(d, i)
		{
			result.push(d + "-" + i);
		});
		expect(result).to.eql([ "1-0" ]);
	});

	it("foreach(null) 2", function()
	{
		var result = [];
		Canal.of([ 1, 2 ]).peek(function(d)
		{
			result.push(d + 1);
		}).foreach();
		expect(result).to.eql([ 2, 3 ]);
	});

	it("foreach() empty", function()
	{
		var result = [];
		Canal.of([]).foreach();
		expect(result).to.eql([]);
	});
});
