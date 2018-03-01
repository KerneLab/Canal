var Canal = require('../canal');

describe("Test skip", function(){

it("skip(2) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.skip(2).collect();
	expect(result).toEqual([ 3 ]);
});

it("skip(0) 1 2", function()
{
	var result = Canal.of([ 1, 2 ]) //
	.skip(0).collect();
	expect(result).toEqual([ 1, 2 ]);
});

it("skip(1) 1", function()
{
	var result = Canal.of([ 1 ]) //
	.skip(1).collect();
	expect(result).toEqual([]);
});

it("skip(0) empty", function()
{
	var result = Canal.of([]) //
	.skip(0).collect();
	expect(result).toEqual([]);
});

it("skip(1) empty", function()
{
	var result = Canal.of([]) //
	.skip(1).collect();
	expect(result).toEqual([]);
});

});
