var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test filter", function(){

it("filter() 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]).filter(function(d)
	{
		return d > 2;
	}).collect();
	expect(result).to.eql([ 3 ]);
});

it("filter() 1 2", function()
{
	var result = Canal.of([ 1, 2 ]).filter(function(d)
	{
		return d > 2;
	}).collect();
	expect(result).to.eql([]);
});

it("filter() empty", function()
{
	var result = Canal.of([]).filter(function(d)
	{
		return d > 2;
	}).collect();
	expect(result).to.eql([]);
});

});
