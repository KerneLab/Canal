var Canal = require('../canal');

describe("Test zip", function(){

it("zip() 1 2 vs 2 3", function()
{
	var result = Canal.of([ 1, 2 ]) //
	.zip(Canal.of([ 2, 3 ])).collect();
	expect(result).toEqual([ [ 1, 2 ], [ 2, 3 ] ]);
});

it("zip() 1 2 3 vs 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.zip(Canal.of([ 2, 3 ])).collect();
	expect(result).toEqual([ [ 1, 2 ], [ 2, 3 ] ]);
});

it("zip() empty vs 1", function()
{
	var result = Canal.of([]) //
	.zip(Canal.of([ 1 ])).collect();
	expect(result).toEqual([]);
});

it("zip() empty vs empty", function()
{
	var result = Canal.of([]) //
	.zip(Canal.of([])).collect();
	expect(result).toEqual([]);
});

});
