var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test flatMap", function(){

it("flatMap() 1->2", function()
{
	var result = Canal.of([ 1, 2, 3 ]).flatMap(function(d)
	{
		return [ d, d + 0.5 ];
	}).collect();
	expect(result).to.eql([ 1, 1.5, 2, 2.5, 3, 3.5 ]);
});

it("flatMap() 1->1", function()
{
	var result = Canal.of([ 1, 2, 3 ]).flatMap(function(d)
	{
		return [ d + 0.5 ];
	}).collect();
	expect(result).to.eql([ 1.5, 2.5, 3.5 ]);
});

it("flatMap() 1->0", function()
{
	var result = Canal.of([ 1, 2, 3 ]).flatMap(function(d)
	{
		return [];
	}).collect();
	expect(result).to.eql([]);
});

it("flatMap() empty", function()
{
	var result = Canal.of([]).flatMap(function(d)
	{
		return [ d, d + 0.5 ];
	}).collect();
	expect(result).to.eql([]);
});

});
