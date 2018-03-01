var Canal = require('../canal');

describe("Test collect", function(){

it("collect()", function()
{
	var result = Canal.of([ 1, 2, 3 ]).collect();
	expect(result).toEqual([ 1, 2, 3 ]);
});

it("collect() 1", function()
{
	var result = Canal.of([ 1 ]).collect();
	expect(result).toEqual([ 1 ]);
});

it("collect() empty", function()
{
	var result = Canal.of([]).collect();
	expect(result).toEqual([]);
});

});
