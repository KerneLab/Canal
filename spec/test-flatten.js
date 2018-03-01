var Canal = require('../canal');

describe("Test flatten", function(){

it("flatten() [1 2]", function()
{
	var result = Canal.of([ [ 1, 2 ], [ 2, 3 ], [ 3, 4 ] ]) //
	.flatten().collect();
	expect(result).toEqual([ [ 1, 2 ], [ 2, 3 ], [ 3, 4 ] ]);
});

it("flatten() [1 [2 3]]", function()
{
	var result = Canal
			.of([ [ 1, [ 2, 3 ] ], [ 2, [ 3, 4 ] ], [ 3, [ 4, 5 ] ] ]) //
			.flatten().collect();
	expect(result).toEqual([ [ 1, 2, 3 ], [ 2, 3, 4 ], [ 3, 4, 5 ] ]);
});

it("flatten() [1 [2 3] 4]", function()
{
	var result = Canal.of(
			[ [ 1, [ 2, 3 ], 4 ], [ 2, [ 3, 4 ], 5 ], [ 3, [ 4, 5 ], 6 ] ]) //
	.flatten().collect();
	expect(result).toEqual(
					[ [ 1, 2, 3, 4 ], [ 2, 3, 4, 5 ], [ 3, 4, 5, 6 ] ]);
});

it("flatten() [1 [2 [3]]]", function()
{
	var result = Canal.of(
			[ [ 1, [ 2, [ 3 ] ] ], [ 2, [ 3, [ 4 ] ] ], [ 3, [ 4, [ 5 ] ] ] ]) //
	.flatten().collect();
	expect(result).toEqual([ [ 1, 2, 3 ], [ 2, 3, 4 ], [ 3, 4, 5 ] ]);
});

it("flatten(1) [1 [2 [3]]]", function()
{
	var result = Canal.of(
			[ [ 1, [ 2, [ 3 ] ] ], [ 2, [ 3, [ 4 ] ] ], [ 3, [ 4, [ 5 ] ] ] ]) //
	.flatten(1).collect();
	expect(result).toEqual([ [ 1, 2, [ 3 ] ], [ 2, 3, [ 4 ] ],
			[ 3, 4, [ 5 ] ] ]);
});

it("flatten() [[[1] 2] 3]", function()
{
	var result = Canal.of(
			[ [ [ [ 1 ], 2 ], 3 ], [ [ [ 2 ], 3 ], 4 ], [ [ [ 3 ], 4 ], 5 ] ]) //
	.flatten().collect();
	expect(result).toEqual([ [ 1, 2, 3 ], [ 2, 3, 4 ], [ 3, 4, 5 ] ]);
});

it("flatten(1) [[[1] 2] 3]", function()
{
	var result = Canal.of(
			[ [ [ [ 1 ], 2 ], 3 ], [ [ [ 2 ], 3 ], 4 ], [ [ [ 3 ], 4 ], 5 ] ]) //
	.flatten(1).collect();
	expect(result).toEqual([ [ [ 1 ], 2, 3 ], [ [ 2 ], 3, 4 ],
			[ [ 3 ], 4, 5 ] ]);
});

it("flatten() empty", function()
{
	var result = Canal.of([]) //
	.flatten().collect();
	expect(result).toEqual([]);
});

});
