var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test subtract", function(){

it("subtract() 1 2 3 vs 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.subtract(Canal.of([ 2, 3 ])).collect();
	expect(result).to.eql([ 1 ]);
});

it("subtract() 1 2 3 vs 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.subtract(Canal.of([ 1, 2, 3 ])).collect();
	expect(result).to.eql([]);
});

it("subtract() 1 2 vs 1 2 3", function()
{
	var result = Canal.of([ 1, 2 ]) //
	.subtract(Canal.of([ 1, 2, 3 ])).collect();
	expect(result).to.eql([]);
});

it("subtract() 1 2 3 3 vs 2 3", function()
{
	var result = Canal.of([ 1, 2, 3, 3 ]) //
	.subtract(Canal.of([ 2, 3 ])).collect();
	expect(result).to.eql([ 1 ]);
});

it("subtract() 1 2 3 3 vs 2 2 3", function()
{
	var result = Canal.of([ 1, 2, 3, 3 ]) //
	.subtract(Canal.of([ 2, 2, 3 ])).collect();
	expect(result).to.eql([ 1 ]);
});

it("subtract() 1 2 3 3 vs 1 2", function()
{
	var result = Canal.of([ 1, 2, 3, 3 ]) //
	.subtract(Canal.of([ 1, 2 ])).collect();
	expect(result).to.eql([ 3, 3 ]);
});

it("subtract() empty vs 1 2 3", function()
{
	var result = Canal.of([]) //
	.subtract(Canal.of([ 1, 2, 3 ])).collect();
	expect(result).to.eql([]);
});

it("subtract() 1 2 3 vs empty", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.subtract(Canal.of([])).collect();
	expect(result).to.eql([ 1, 2, 3 ]);
});

it("subtract() empty vs empty", function()
{
	var result = Canal.of([]) //
	.subtract(Canal.of([])).collect();
	expect(result).to.eql([]);
});

});
