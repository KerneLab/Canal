var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test keyBy", function(){

it("keyBy() 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.keyBy(function(d)
	{
		return d + ".";
	}).collect();
	expect(result).to.eql([ [ "1.", 1 ], [ "2.", 2 ], [ "3.", 3 ] ]);
});

it("keyBy() 1", function()
{
	var result = Canal.of([ 1 ]) //
	.keyBy(function(d)
	{
		return d + ".";
	}).collect();
	expect(result).to.eql([ [ "1.", 1 ] ]);
});

it("keyBy() empty", function()
{
	var result = Canal.of([]) //
	.keyBy(function(d)
	{
		return d + ".";
	}).collect();
	expect(result).to.eql([]);
});

});
