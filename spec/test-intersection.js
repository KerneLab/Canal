var Canal = require('../canal');

describe("Test intersection", function(){

it("intersection() 1 2 3 vs 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.intersection(Canal.of([ 2, 3 ])).collect();
	expect(result).toEqual([ 2, 3 ]);
});

it("intersection() 1 2 3 3 vs 2 3", function()
{
	var result = Canal.of([ 1, 2, 3, 3 ]) //
	.intersection(Canal.of([ 2, 3 ])).collect();
	expect(result).toEqual([ 2, 3 ]);
});

it("intersection() 1 2 3 vs 2 3 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.intersection(Canal.of([ 2, 3, 3 ])).collect();
	expect(result).toEqual([ 2, 3 ]);
});

it("intersection() 1 2 3 vs empty", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.intersection(Canal.of([])).collect();
	expect(result).toEqual([]);
});

it("intersection() empty vs 1 2 3", function()
{
	var result = Canal.of([]) //
	.intersection(Canal.of([ 1, 2, 3 ])).collect();
	expect(result).toEqual([]);
});

it("intersection() empty vs empty", function()
{
	var result = Canal.of([]) //
	.intersection(Canal.of([])).collect();
	expect(result).toEqual([]);
});

});
