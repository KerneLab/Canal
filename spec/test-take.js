var Canal = require('../canal');

describe("Test take", function(){

it("take(1) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]).take(1);
	expect(result).toEqual([ 1 ]);
});

it("take(3) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]).take(3);
	expect(result).toEqual([ 1, 2, 3 ]);
});

it("take(4) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]).take(4);
	expect(result).toEqual([ 1, 2, 3 ]);
});

it("take(0) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]).take(0);
	expect(result).toEqual([]);
});

it("take(1) empty", function()
{
	var result = Canal.of([]).take(1);
	expect(result).toEqual([]);
});

});
