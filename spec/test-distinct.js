var Canal = require('../canal');

describe("Test distinct", function(){

it("distinct() 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]).distinct().collect();
	expect(result).toEqual([ 1, 2, 3 ]);
});

it("distinct().take(2) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]).distinct().take(2);
	expect(result).toEqual([ 1, 2 ]);
});

it("distinct().take(0) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]).distinct().take(0);
	expect(result).toEqual([]);
});

it("distinct() 1 2 2", function()
{
	var result = Canal.of([ 1, 2, 2 ]).distinct().collect();
	expect(result).toEqual([ 1, 2 ]);
});

it("distinct().take(1) 1 2 2", function()
{
	var result = Canal.of([ 1, 2, 2 ]).distinct().take(1);
	expect(result).toEqual([ 1 ]);
});

it("distinct() 1 1", function()
{
	var result = Canal.of([ 1, 1 ]).distinct().collect();
	expect(result).toEqual([ 1 ]);
});

it("distinct() 1", function()
{
	var result = Canal.of([ 1 ]).distinct().collect();
	expect(result).toEqual([ 1 ]);
});

it("distinct().take(1) 1", function()
{
	var result = Canal.of([ 1 ]).distinct().take(1);
	expect(result).toEqual([ 1 ]);
});

it("distinct() empty", function()
{
	var result = Canal.of([]).distinct().collect();
	expect(result).toEqual([]);
});

});
