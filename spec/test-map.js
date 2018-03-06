var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test map", function(){

it("map() 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.map(function(d)
	{
		return d / 2;
	}).collect();
	expect(result).to.eql([ 0.5, 1, 1.5 ]);
});

it("map() 1", function()
{
	var result = Canal.of([ 1 ]) //
	.map(function(d)
	{
		return d / 2;
	}).collect();
	expect(result).to.eql([ 0.5 ]);
});

it("map() empty", function()
{
	var result = Canal.of([]) //
	.map(function(d)
	{
		return d / 2;
	}).collect();
	expect(result).to.eql([]);
});

});
