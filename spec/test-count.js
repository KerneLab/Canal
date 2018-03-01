var Canal = require('../canal');

describe("Test count", function(){

it("count()", function()
{
	var result = Canal.of([ 1, 2, 3 ]).count();
	expect(result).toEqual(3);
});

it("count() empty", function()
{
	var result = Canal.of([]).count();
	expect(result).toEqual(0);
});

});
