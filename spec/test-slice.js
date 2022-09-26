var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test slice", function()
{
	it("slice(2)", function()
	{
		var result = [];
		Canal.of([ 1, 2, 3 ]).slice(2).foreach(function(c){
			result.push(c.collect());
		});
		expect(result).to.eql([ [1,2], [3] ]);
	});

	it("slice(2) 1", function()
	{
		var result = [];
		Canal.of([ 1 ]).slice(2).foreach(function(c){
			result.push(c.collect());
		});
		expect(result).to.eql([ [1] ]);
	});

	it("slice() 2", function()
	{
		var result = Canal.of([ 1, 2 ]).slice().count();
		expect(result).to.eql(0);
	});

	it("slice() empty", function()
	{
		var result = Canal.of([]).slice().count();
		expect(result).to.eql(0);
	});
});
