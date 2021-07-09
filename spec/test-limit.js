var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test limit", function(){

it("limit(2) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.limit(2).collect();
	expect(result).to.eql([ 1, 2 ]);
});

it("limit(-1) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.limit(-1).collect();
	expect(result).to.eql([ 1, 2, 3 ]);
});

it("limit(3) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.limit(3).collect();
	expect(result).to.eql([ 1, 2, 3 ]);
});

it("limit(0) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.limit(0).collect();
	expect(result).to.eql([]);
});

it("limit(2) empty", function()
{
	var result = Canal.of([]) //
	.limit(2).collect();
	expect(result).to.eql([]);
});

it("limit(0) empty", function()
{
	var result = Canal.of([]) //
	.limit(0).collect();
	expect(result).to.eql([]);
});

it("limit(3) func", function()
{
	var result = Canal.of(function(i){
		return i;
	}) //
	.limit(3).collect();
	expect(result).to.eql([0,1,2]);
});

});
